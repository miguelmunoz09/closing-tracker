import type { EntityClosingSection } from "@/lib/data";
import { TaskRow } from "@/components/TaskRow";
import { ChevronIcon, SectionIcon } from "@/components/icons";

/** Sección desplegable (usa <details> nativo: no necesita JavaScript). */
export function SectionAccordion({
  entityId,
  period,
  section,
}: {
  entityId: string;
  period: string;
  section: EntityClosingSection;
}) {
  const total = section.tasks.length;
  const completedCount = section.tasks.filter((t) => t.completed).length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;
  const done = completedCount === total && total > 0;

  return (
    <details
      open
      className="group mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3.5 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              done ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            <SectionIcon name={section.name} className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{section.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500">
            {completedCount}/{total}
          </span>
          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 sm:block">
            <div
              className={`h-full rounded-full ${done ? "bg-green-500" : "bg-blue-600"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <ChevronIcon className="h-4 w-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>
      <div className="divide-y divide-gray-100 border-t border-gray-100">
        {section.tasks.map((task) => (
          <TaskRow key={task.id} entityId={entityId} period={period} task={task} />
        ))}
      </div>
    </details>
  );
}
