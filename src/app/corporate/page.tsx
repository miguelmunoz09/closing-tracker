import {
  getCorporateSummary,
  getSectionProgressByEntity,
  getSections,
  getAllTasksForEditing,
} from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { PageHeader } from "@/components/PageHeader";
import { PeriodSelector } from "@/components/PeriodSelector";
import { ProgressRing } from "@/components/ProgressRing";
import { SectionProgressGrid } from "@/components/SectionProgressGrid";
import { EntityProgressTable } from "@/components/EntityProgressTable";
import { SectionEntityDetail } from "@/components/SectionEntityDetail";
import { AddTaskForm } from "@/components/AddTaskForm";
import { EditTasksPanel } from "@/components/EditTasksPanel";
import { BuildingIcon } from "@/components/icons";

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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <PageHeader
        icon={
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BuildingIcon className="h-6 w-6" />
          </div>
        }
        title="Corporate team"
        subtitle={summary.periodClosingType === "QUARTERLY" ? "Quarterly close" : "Monthly close"}
        action={<PeriodSelector value={period} options={getAvailablePeriods()} basePath="/corporate" />}
      />

      <div className="space-y-6">
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProgressRing
            percent={summary.totals.percent}
            label="Total progress this month"
            sublabel={`${summary.totals.completed}/${summary.totals.total} tasks`}
            size={160}
          />
        </div>

        <SectionProgressGrid bySection={summary.bySection} />

        <SectionEntityDetail
          sectionName="Revenue"
          title="Revenue — closing status by country"
          rows={revenueByEntity}
        />

        <SectionEntityDetail
          sectionName="Sign Off"
          title="Sign Off — closing status by country"
          rows={signOffByEntity}
        />

        <EntityProgressTable period={period} byEntity={summary.byEntity} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Add new task</h2>
          <p className="mb-3 text-xs text-gray-500">
            Added to the chosen section and becomes available to all entities.
          </p>
          <AddTaskForm sections={sections} />
        </div>

        <EditTasksPanel tasks={allTasks} sections={sections} />
      </div>
    </main>
  );
}
