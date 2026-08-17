import { notFound } from "next/navigation";
import { getEntityById, getEntityClosingData } from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { Flag } from "@/components/Flag";
import { PageHeader } from "@/components/PageHeader";
import { PeriodSelector } from "@/components/PeriodSelector";
import { SectionAccordion } from "@/components/SectionAccordion";
import { ShieldCheckIcon } from "@/components/icons";

export default async function EntityPage({
  params,
  searchParams,
}: {
  params: { entityId: string };
  searchParams: { period?: string };
}) {
  const entity = await getEntityById(params.entityId);
  if (!entity) notFound();

  const period = searchParams.period ?? getDefaultPeriod();
  const data = await getEntityClosingData(entity.id, period);

  const totalTasks = data.sections.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = data.sections.reduce(
    (sum, s) => sum + s.tasks.filter((t) => t.completed).length,
    0
  );
  const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allDone = totalTasks > 0 && completedTasks === totalTasks;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <PageHeader
        icon={<Flag country={entity.country} className="h-8 w-11 shrink-0 rounded" />}
        title={entity.displayName}
        subtitle={
          <>
            {completedTasks}/{totalTasks} tasks completed ·{" "}
            {data.periodClosingType === "QUARTERLY" ? "Quarterly close" : "Monthly close"}
          </>
        }
        action={
          <PeriodSelector
            value={period}
            options={getAvailablePeriods()}
            basePath={`/entity/${entity.id}`}
          />
        }
      />

      {totalTasks > 0 && (
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${allDone ? "bg-green-500" : "bg-blue-600"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {allDone && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <ShieldCheckIcon className="h-5 w-5 shrink-0" />
          All tasks closed for this period.
        </div>
      )}

      <div>
        {data.sections.map((section) => (
          <SectionAccordion key={section.id} entityId={entity.id} period={period} section={section} />
        ))}
      </div>
    </main>
  );
}
