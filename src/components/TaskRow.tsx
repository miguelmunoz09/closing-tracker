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
    <div
      className={`flex flex-col gap-2 px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
        task.completed ? "bg-green-50/50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{task.name}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            task.closingType === "MONTHLY"
              ? "bg-gray-100 text-gray-500"
              : "bg-blue-50 text-blue-600"
          }`}
        >
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
