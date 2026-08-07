import type { EditableTask, SectionOption } from "@/lib/data";
import { TaskEditRow } from "@/components/TaskEditRow";

/** Rename, move, or delete any existing task. Collapsed content stays server-rendered. */
export function EditTasksPanel({
  tasks,
  sections,
}: {
  tasks: EditableTask[];
  sections: SectionOption[];
}) {
  return (
    <details className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer select-none text-sm font-semibold text-gray-900">
        Edit existing tasks
      </summary>
      <div className="mt-3">
        {tasks.map((task) => (
          <TaskEditRow key={task.id} task={task} sections={sections} />
        ))}
      </div>
    </details>
  );
}
