"use client";

import { useState } from "react";
import { addTask } from "@/actions/tasks";
import type { SectionOption } from "@/lib/data";
import { PlusIcon } from "@/components/icons";

/**
 * Formulario para agregar una tarea nueva. Solo lo usa Corporate team: la
 * tarea queda global y a partir de ese momento aparece para todas las
 * entidades (en los meses que le correspondan según Monthly/Quarterly).
 */
export function AddTaskForm({ sections }: { sections: SectionOption[] }) {
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [name, setName] = useState("");
  const [closingType, setClosingType] = useState<"MONTHLY" | "QUARTERLY">("MONTHLY");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    const res = await addTask({ sectionId, name, closingType });

    setPending(false);
    if (res.ok) {
      setName("");
      setSuccess(true);
    } else {
      setError(res.error);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <PlusIcon className="h-4 w-4" />
        New task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Section</span>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Task name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <fieldset className="text-sm">
        <legend className="mb-1 font-medium text-gray-700">Frequency</legend>
        <div className="flex gap-2">
          {(["MONTHLY", "QUARTERLY"] as const).map((type) => (
            <label
              key={type}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                closingType === type
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="closingType"
                className="sr-only"
                checked={closingType === type}
                onChange={() => setClosingType(type)}
              />
              {type === "MONTHLY" ? "Monthly" : "Quarterly"}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm font-medium text-green-700">Task added.</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
