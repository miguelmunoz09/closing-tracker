"use client";

import { useState, useTransition } from "react";
import { toggleTaskCompletion } from "@/actions/tasks";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * El tilde de cada tarea. Al hacer click actualiza la pantalla al instante
 * (estado optimista) y guarda el cambio en la base en segundo plano.
 * Si falla, se revierte el tilde y se muestra un error.
 */
export function TaskCheckbox({
  entityId,
  taskId,
  period,
  initialCompleted,
  initialCompletedAt,
}: {
  entityId: string;
  taskId: string;
  period: string;
  initialCompleted: boolean;
  initialCompletedAt: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(initialCompleted);
  const [completedAt, setCompletedAt] = useState(initialCompletedAt);
  const [error, setError] = useState<string | null>(null);

  function onChange(next: boolean) {
    setError(null);
    setCompleted(next);
    startTransition(async () => {
      const res = await toggleTaskCompletion({ entityId, taskId, period, completed: next });
      if (res.ok) {
        setCompletedAt(res.completedAt);
      } else {
        setCompleted(!next);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={completed}
        disabled={pending}
        onChange={(e) => onChange(e.target.checked)}
        className="task-checkbox"
        aria-label="Mark task done"
      />
      {completed && completedAt && (
        <span className="whitespace-nowrap text-xs font-medium text-green-700">
          ✓ Done on {formatDate(completedAt)}
        </span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
