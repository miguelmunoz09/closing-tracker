import Link from "next/link";
import {
  getCorporateSummary,
  getSectionProgressByEntity,
  getSections,
  getAllTasksForEditing,
} from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { PeriodSelector } from "@/components/PeriodSelector";
import { ProgressRing } from "@/components/ProgressRing";
import { SectionProgressGrid } from "@/components/SectionProgressGrid";
import { EntityProgressTable } from "@/components/EntityProgressTable";
import { SectionEntityDetail } from "@/components/SectionEntityDetail";
import { AddTaskForm } from "@/components/AddTaskForm";
import { EditTasksPanel } from "@/components/EditTasksPanel";

export default async function CorporatePage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const period = searchParams.period ?? getDefaultPeriod();
  const [summary, sections, revenueByEntity, signOffByEntity, allTasks] = await Promise.all([
    getCorporateSummary(period),
    getSections(),
    getSectionProgressByEntity(period, "Revenue"),
    getSectionProgressByEntity(period, "Sign Off"),
    getAllTasksForEditing(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Change profile
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Corporate team</h1>
          <p className="text-sm text-gray-500">
            {summary.periodClosingType === "QUARTERLY" ? "Quarterly close" : "Monthly close"}
          </p>
        </div>
        <PeriodSelector value={period} options={getAvailablePeriods()} basePath="/corporate" />
      </div>

      <div className="mt-6 flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProgressRing
          percent={summary.totals.percent}
          label="Total progress this month"
          sublabel={`${summary.totals.completed}/${summary.totals.total} tasks`}
          size={160}
        />
      </div>

      <SectionProgressGrid bySection={summary.bySection} />

      <SectionEntityDetail title="Revenue — closing status by country" rows={revenueByEntity} />

      <SectionEntityDetail title="Sign Off — closing status by country" rows={signOffByEntity} />

      <EntityProgressTable period={period} byEntity={summary.byEntity} />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">Add new task</h2>
        <p className="mb-3 text-xs text-gray-500">
          Added to the chosen section and becomes available to all entities.
        </p>
        <AddTaskForm sections={sections} />
      </div>

      <EditTasksPanel tasks={allTasks} sections={sections} />
    </main>
  );
}
