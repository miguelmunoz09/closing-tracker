import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntityById, getEntityClosingData } from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { Flag } from "@/components/Flag";
import { PeriodSelector } from "@/components/PeriodSelector";
import { SectionAccordion } from "@/components/SectionAccordion";

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

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Change profile
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flag country={entity.country} className="h-6 w-9 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">{entity.displayName}</h1>
            <p className="text-sm text-gray-500">
              {completedTasks}/{totalTasks} tasks completed ·{" "}
              {data.periodClosingType === "QUARTERLY" ? "Quarterly close" : "Monthly close"}
            </p>
          </div>
        </div>
        <PeriodSelector
          value={period}
          options={getAvailablePeriods()}
          basePath={`/entity/${entity.id}`}
        />
      </div>

      <div className="mt-6">
        {data.sections.map((section) => (
          <SectionAccordion key={section.id} entityId={entity.id} period={period} section={section} />
        ))}
      </div>
    </main>
  );
}
