"use client";

import { useRouter } from "next/navigation";
import { formatPeriodLabel } from "@/lib/period";

/**
 * Desplegable de mes/año. Cambiar el valor navega a la misma pantalla
 * pero con el período elegido en la URL (?period=YYYY-MM).
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
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-700">Mes</span>
      <select
        value={value}
        onChange={(e) => router.push(`${basePath}?period=${e.target.value}`)}
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
