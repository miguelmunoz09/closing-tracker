import Link from "next/link";
import { getCorporateSummary, getSections } from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { PeriodSelector } from "@/components/PeriodSelector";
import { ProgressRing } from "@/components/ProgressRing";
import { SectionProgressGrid } from "@/components/SectionProgressGrid";
import { EntityProgressTable } from "@/components/EntityProgressTable";
import { AddTaskForm } from "@/components/AddTaskForm";

export default async function CorporatePage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const period = searchParams.period ?? getDefaultPeriod();
  const [summary, sections] = await Promise.all([getCorporateSummary(period), getSections()]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Cambiar perfil
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Corporate team</h1>
          <p className="text-sm text-gray-500">
            {summary.periodClosingType === "QUARTERLY" ? "Cierre Quarterly" : "Cierre Monthly"}
          </p>
        </div>
        <PeriodSelector value={period} options={getAvailablePeriods()} basePath="/corporate" />
      </div>

      <div className="mt-6 flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProgressRing
          percent={summary.totals.percent}
          label="Avance total del mes"
          sublabel={`${summary.totals.completed}/${summary.totals.total} tareas`}
          size={160}
        />
      </div>

      <SectionProgressGrid bySection={summary.bySection} />

      <EntityProgressTable period={period} byEntity={summary.byEntity} />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">Agregar tarea nueva</h2>
        <p className="mb-3 text-xs text-gray-500">
          Se agrega a la sección elegida y queda disponible para todas las entidades.
        </p>
        <AddTaskForm sections={sections} />
      </div>
    </main>
  );
}
