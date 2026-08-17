import Link from "next/link";
import type { CorporateEntityRow } from "@/lib/data";
import { Flag } from "@/components/Flag";
import { GlobeIcon } from "@/components/icons";

/** Per-entity table, useful for spotting at a glance which countries are behind. */
export function EntityProgressTable({
  period,
  byEntity,
}: {
  period: string;
  byEntity: CorporateEntityRow[];
}) {
  return (
    <details open className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer select-none items-center gap-2 px-6 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
        <GlobeIcon className="h-4 w-4 text-gray-400" />
        Progress by entity
      </summary>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-gray-100 bg-gray-50/60 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
            <th className="px-6 py-2.5">Entity</th>
            <th className="px-6 py-2.5 text-right">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {byEntity.map((row) => (
            <tr key={row.entityId} className="hover:bg-gray-50/60">
              <td className="px-6 py-2.5">
                <Link
                  href={`/entity/${row.entityId}?period=${period}`}
                  className="flex items-center gap-2 text-gray-900 hover:text-blue-600"
                >
                  <Flag country={row.country} />
                  {row.displayName}
                </Link>
              </td>
              <td className="px-6 py-2.5 text-right text-gray-600">
                <span className={row.percent === 100 ? "font-medium text-green-700" : ""}>
                  {row.completed}/{row.total} ({row.percent}%)
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
