import type { EditableTask, SectionOption } from "@/lib/data";
import { TaskEditRow } from "@/components/TaskEditRow";
import { PencilIcon } from "@/components/icons";

/** Rename, move, or delete any existing task. Collapsed content stays server-rendered. */
export function EditTasksPanel({
  tasks,
  sections,
}: {
  tasks: EditableTask[];
  sections: SectionOption[];
}) {
  return (
    <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-gray-900">
        <PencilIcon className="h-4 w-4 text-gray-400" />
        Edit existing tasks
      </summary>
      <div className="mt-3 divide-y divide-gray-100">
        {tasks.map((task) => (
          <TaskEditRow key={task.id} task={task} sections={sections} />
        ))}
      </div>
    </details>
  );
}
