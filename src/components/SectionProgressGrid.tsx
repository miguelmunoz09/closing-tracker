import type { CorporateSectionRow } from "@/lib/data";
import { ProgressRing } from "@/components/ProgressRing";
import { ChartIcon } from "@/components/icons";

// Reporting doesn't need its own progress chart (per request).
const SECTIONS_WITHOUT_CHART = new Set(["Reporting"]);

export function SectionProgressGrid({ bySection }: { bySection: CorporateSectionRow[] }) {
  const sections = bySection.filter((s) => !SECTIONS_WITHOUT_CHART.has(s.name));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <ChartIcon className="h-4 w-4 text-gray-400" />
        Progress by section
      </h2>
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
