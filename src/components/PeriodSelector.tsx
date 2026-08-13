"use client";

import { formatPeriodLabel } from "@/lib/period";

/**
 * Desplegable de mes/año. Cambiar el valor hace una recarga completa de la
 * página (window.location, no navegación "por dentro" de Next.js) a
 * propósito: así se garantiza que cada tarea arranque de cero con el
 * estado real de ese mes. La navegación "por dentro" (router.push) resultó
 * frágil acá — según el caso, dejaba tildes del mes anterior pegados, o
 * los duplicaba — porque React reutiliza los componentes de cada tarea en
 * vez de recrearlos. Una recarga completa es un poco menos instantánea,
 * pero elimina el problema por completo.
 */
export function PeriodSelector({
  value,
  options,
  basePath,
}: {
  value: string;
  options: string[];
  basePath: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-700">Month</span>
      <select
        value={value}
        onChange={(e) => {
          window.location.href = `${basePath}?period=${e.target.value}`;
        }}
        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
      >
        {options.map((p) => (
          <option key={p} value={p}>
            {formatPeriodLabel(p)}
          </option>
        ))}
      </select>
    </label>
  );
}
