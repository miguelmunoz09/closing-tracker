import Link from "next/link";
import { getCorporateSummary } from "@/lib/data";
import { getAvailablePeriods, getDefaultPeriod } from "@/lib/period";
import { PeriodSelector } from "@/components/PeriodSelector";
import { ProgressBar } from "@/components/ProgressBar";
import { CorporateSummaryTable } from "@/components/CorporateSummaryTable";

export default async function CorporatePage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const period = searchParams.period ?? getDefaultPeriod();
  const summary = await getCorporateSummary(period);

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

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <ProgressBar
          percent={summary.totals.percent}
          label={`Avance total: ${summary.totals.completed}/${summary.totals.total} tareas`}
        />
      </div>

      <CorporateSummaryTable
        period={period}
        byEntity={summary.byEntity}
        bySection={summary.bySection}
      />
    </main>
  );
}
