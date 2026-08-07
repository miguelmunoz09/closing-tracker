import type { CorporateSectionRow } from "@/lib/data";
import { ProgressRing } from "@/components/ProgressRing";

// Reporting no necesita su propio gráfico de avance (a pedido).
const SECTIONS_WITHOUT_CHART = new Set(["Reporting"]);

export function SectionProgressGrid({ bySection }: { bySection: CorporateSectionRow[] }) {
  const sections = bySection.filter((s) => !SECTIONS_WITHOUT_CHART.has(s.name));

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Avance por sección</h2>
      <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
        {sections.map((s) => (
          <ProgressRing
            key={s.sectionId}
            percent={s.percent}
            label={s.name}
            sublabel={`${s.completed}/${s.total}`}
          />
        ))}
      </div>
    </div>
  );
}
