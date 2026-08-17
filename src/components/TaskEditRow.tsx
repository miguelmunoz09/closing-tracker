"use client";

import { useState } from "react";
import { updateTask, deleteTask } from "@/actions/tasks";
import type { EditableTask, SectionOption } from "@/lib/data";

export function TaskEditRow({ task, sections }: { task: EditableTask; sections: SectionOption[] }) {
  const [name, setName] = useState(task.name);
  const [closingType, setClosingType] = useState<"MONTHLY" | "QUARTERLY">(task.closingType);
  const [sectionId, setSectionId] = useState(task.sectionId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);
    const res = await updateTask({ taskId: task.id, name, closingType, sectionId });
    setPending(false);
    if (res.ok) setSuccess(true);
    else setError(res.error);
  }

  async function handleDelete() {
    setPending(true);
    setError(null);
    const res = await deleteTask(task.id);
    setPending(false);
    if (res.ok) {
      setDeleted(true);
    } else {
      setConfirmingDelete(false);
      setError(res.error);
    }
  }

  if (deleted) {
    return <p className="py-3 text-sm text-gray-400">Task deleted.</p>;
  }

  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <select
        value={sectionId}
        onChange={(e) => setSectionId(e.target.value)}
        className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        value={closingType}
        onChange={(e) => setClosingType(e.target.value as "MONTHLY" | "QUARTERLY")}
        className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <option value="MONTHLY">Monthly</option>
        <option value="QUARTERLY">Quarterly</option>
      </select>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>

        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {success && <span className="text-xs font-medium text-green-700">Saved.</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
