"use client";

import { useState } from "react";
import { addTask } from "@/actions/tasks";
import type { SectionOption } from "@/lib/data";

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
        className="mt-4 text-sm font-medium text-gray-700 underline hover:text-gray-900"
      >
        + Agregar tarea nueva
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-md border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold">Agregar tarea nueva</h3>

      <label className="block text-sm">
        Sección
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Nombre de la tarea
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>

      <fieldset className="text-sm">
        <legend className="mb-1">Frecuencia</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="closingType"
              checked={closingType === "MONTHLY"}
              onChange={() => setClosingType("MONTHLY")}
            />
            Monthly
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="closingType"
              checked={closingType === "QUARTERLY"}
              onChange={() => setClosingType("QUARTERLY")}
            />
            Quarterly
          </label>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">Tarea agregada.</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
