import type { EntityClosingSection } from "@/lib/data";
import { TaskRow } from "@/components/TaskRow";

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
  const completedCount = section.tasks.filter((t) => t.completed).length;

  return (
    <details open className="mb-3 rounded-lg border border-gray-200 bg-white shadow-sm">
      <summary className="cursor-pointer select-none rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50">
        {section.name}{" "}
        <span className="font-normal text-gray-500">
          ({completedCount}/{section.tasks.length})
        </span>
      </summary>
      <div>
        {section.tasks.map((task) => (
          <TaskRow key={task.id} entityId={entityId} period={period} task={task} />
        ))}
      </div>
    </details>
  );
}
