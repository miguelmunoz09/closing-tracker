import Link from "next/link";
import type { CorporateEntityRow } from "@/lib/data";
import { getCountryFlag } from "@/lib/countryFlags";

/** Tabla por entidad, útil para ver rápido qué países van atrasados. */
export function EntityProgressTable({
  period,
  byEntity,
}: {
  period: string;
  byEntity: CorporateEntityRow[];
}) {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <h2 className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">
        Avance por entidad
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="px-4 py-2">Entidad</th>
            <th className="px-4 py-2 text-right">Avance</th>
          </tr>
        </thead>
        <tbody>
          {byEntity.map((row) => (
            <tr key={row.entityId} className="border-t border-gray-100">
              <td className="px-4 py-2">
                <Link
                  href={`/entity/${row.entityId}?period=${period}`}
                  className="text-gray-900 hover:underline"
                >
                  {getCountryFlag(row.country)} {row.displayName}
                </Link>
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {row.completed}/{row.total} ({row.percent}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
