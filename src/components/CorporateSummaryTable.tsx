import Link from "next/link";
import type { CorporateEntityRow, CorporateSectionRow } from "@/lib/data";

export function CorporateSummaryTable({
  period,
  byEntity,
  bySection,
}: {
  period: string;
  byEntity: CorporateEntityRow[];
  bySection: CorporateSectionRow[];
}) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-4 py-3 text-sm font-semibold">Por entidad</h2>
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
                    {row.displayName}
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

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-4 py-3 text-sm font-semibold">Por sección</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-2">Sección</th>
              <th className="px-4 py-2 text-right">Avance</th>
            </tr>
          </thead>
          <tbody>
            {bySection.map((row) => (
              <tr key={row.sectionId} className="border-t border-gray-100">
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {row.completed}/{row.total} ({row.percent}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
