// Webhook called by a Power Automate flow whenever a file is created or
// changed in the SharePoint reports library. Each country uploads one file
// PER REPORT TYPE per month, named "CODE_report-type_YYYY-MM.ext"
// (e.g. "2560_sales-units_2026-08.xlsx"). The "report-type" segment is
// matched against the slugified name of a "Reporting" section task
// ("Sales units" -> "sales-units", "AR" -> "ar", "Units" -> "units",
// "Tax template" -> "tax-template"). When such a file shows up, this marks
// that ONE task as done for that entity + period — same mechanism as the
// manual checkbox (a new TaskCompletion row, so the history stays complete).
//
// Protected by a token: Power Automate must send the same value as the
// SHAREPOINT_WEBHOOK_SECRET environment variable, either as
// "?token=..." or as an "x-webhook-token" header.
import { NextRequest, NextResponse } from "next/server";
import { TaskClosingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getVisibleTaskClosingTypes } from "@/lib/period";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

const REPORTING_SECTION_NAME = "Reporting";

function parseFileName(fileName: string): { code: string; taskSlug: string; period: string } | null {
  const base = fileName.replace(/\.[^./\\]+$/, ""); // strip extension
  const firstUnderscore = base.indexOf("_");
  const lastUnderscore = base.lastIndexOf("_");
  if (firstUnderscore === -1 || firstUnderscore === lastUnderscore) return null; // needs 2 underscores

  const code = base.slice(0, firstUnderscore).trim();
  const taskSlug = base.slice(firstUnderscore + 1, lastUnderscore).trim().toLowerCase();
  const period = base.slice(lastUnderscore + 1).trim();
  if (!code || !taskSlug || !/^\d{4}-\d{2}$/.test(period)) return null;

  return { code, taskSlug, period };
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
        error: `Couldn't read an entity code, report type, and period from "${fileName}". Expected format: CODE_report-type_YYYY-MM.ext (e.g. 2560_sales-units_2026-08.xlsx).`,
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

  const task = reportingTasks.find((t) => slugify(t.name) === parsed.taskSlug);
  if (!task) {
    const validSlugs = reportingTasks.map((t) => slugify(t.name)).join(", ") || "(none apply this period)";
    return NextResponse.json(
      {
        ok: false,
        error: `"${parsed.taskSlug}" doesn't match any Reporting task for ${parsed.period}. Expected one of: ${validSlugs}.`,
      },
      { status: 404 }
    );
  }

  await prisma.taskCompletion.create({
    data: { entityId: entity.id, taskId: task.id, period: parsed.period, completed: true },
  });

  return NextResponse.json({
    ok: true,
    message: `Marked "${task.name}" as done for ${entity.displayName}, ${parsed.period}.`,
  });
}
