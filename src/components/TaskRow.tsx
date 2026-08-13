import type { EntityClosingTask } from "@/lib/data";
import { TaskCheckbox } from "@/components/TaskCheckbox";
import { TaskHistoryToggle } from "@/components/TaskHistoryToggle";

export function TaskRow({
  entityId,
  period,
  task,
}: {
  entityId: string;
  period: string;
  task: EntityClosingTask;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{task.name}</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
          {task.closingType === "MONTHLY" ? "Monthly" : "Quarterly"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TaskCheckbox
          entityId={entityId}
          taskId={task.id}
          period={period}
          initialCompleted={task.completed}
          initialCompletedAt={task.completedAt}
        />
        <TaskHistoryToggle entityId={entityId} taskId={task.id} period={period} />
      </div>
    </div>
  );
}
