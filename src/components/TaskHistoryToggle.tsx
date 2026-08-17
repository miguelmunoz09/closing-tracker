"use client";

import { useState } from "react";
import { getTaskHistory } from "@/actions/tasks";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Link "Ver historial" que despliega, bajo demanda, todas las marcas/desmarcas de una tarea. */
export function TaskHistoryToggle({
  entityId,
  taskId,
  period,
}: {
  entityId: string;
  taskId: string;
  period: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<{ completed: boolean; at: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && events === null) {
      setLoading(true);
      const res = await getTaskHistory({ entityId, taskId, period });
      setLoading(false);
      if (res.ok) setEvents(res.events);
      else setError(res.error);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="whitespace-nowrap text-xs font-medium text-gray-400 underline decoration-gray-300 hover:text-blue-600 hover:decoration-blue-400"
      >
        {open ? "Hide history" : "View history"}
      </button>
      {open && (
        <div className="mt-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {events && events.length === 0 && <p>No changes yet this period.</p>}
          {events && events.length > 0 && (
            <ul className="space-y-0.5">
              {events.map((e, i) => (
                <li key={i}>
                  {e.completed ? "Marked done" : "Unmarked"} — {formatDateTime(e.at)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
