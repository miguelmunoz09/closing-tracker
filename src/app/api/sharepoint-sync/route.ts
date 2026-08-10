// Webhook called by a Power Automate flow whenever a file is created or
// changed in the SharePoint reports library. Expects one file per entity
// per month, named "CODE_YYYY-MM.ext" (e.g. "2560_2026-08.xlsx"). When such
// a file shows up, this marks every visible "Reporting" section task as
// done for that entity + period — the same way the manual checkbox does
// (a new TaskCompletion row per task, so the history stays complete).
//
// Protected by a token: Power Automate must send the same value as the
// SHAREPOINT_WEBHOOK_SECRET environment variable, either as
// "?token=..." or as an "x-webhook-token" header.
import { NextRequest, NextResponse } from "next/server";
import { TaskClosingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getVisibleTaskClosingTypes } from "@/lib/period";

export const dynamic = "force-dynamic";

const REPORTING_SECTION_NAME = "Reporting";

function parseFileName(fileName: string): { code: string; period: string } | null {
  const base = fileName.replace(/\.[^./\\]+$/, ""); // strip extension
  const separatorIndex = base.lastIndexOf("_");
  if (separatorIndex === -1) return null;

  const code = base.slice(0, separatorIndex).trim();
  const period = base.slice(separatorIndex + 1).trim();
  if (!code || !/^\d{4}-\d{2}$/.test(period)) return null;

  return { code, period };
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-webhook-token") ?? request.nextUrl.searchParams.get("token");
  if (!process.env.SHAREPOINT_WEBHOOK_SECRET || token !== process.env.SHAREPOINT_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: { fileName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const fileName = body.fileName?.trim();
  if (!fileName) {
    return NextResponse.json({ ok: false, error: "Missing 'fileName'." }, { status: 400 });
  }

  const parsed = parseFileName(fileName);
  if (!parsed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Couldn't read an entity code and period from "${fileName}". Expected format: CODE_YYYY-MM.ext (e.g. 2560_2026-08.xlsx).`,
      },
      { status: 400 }
    );
  }

  const entity = await prisma.entity.findUnique({ where: { code: parsed.code } });
  if (!entity) {
    return NextResponse.json(
      { ok: false, error: `No entity found with code "${parsed.code}".` },
      { status: 404 }
    );
  }

  const visibleTypes = getVisibleTaskClosingTypes(parsed.period) as TaskClosingType[];
  const reportingTasks = await prisma.task.findMany({
    where: { closingType: { in: visibleTypes }, section: { name: REPORTING_SECTION_NAME } },
  });

  if (reportingTasks.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "No Reporting tasks apply to this period.",
      marked: 0,
    });
  }

  await prisma.taskCompletion.createMany({
    data: reportingTasks.map((t) => ({
      entityId: entity.id,
      taskId: t.id,
      period: parsed.period,
      completed: true,
    })),
  });

  return NextResponse.json({
    ok: true,
    message: `Marked ${reportingTasks.length} Reporting task(s) as done for ${entity.displayName}, ${parsed.period}.`,
    marked: reportingTasks.length,
  });
}
