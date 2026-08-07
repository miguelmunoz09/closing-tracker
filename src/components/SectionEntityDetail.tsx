import type { SectionEntityRow } from "@/lib/data";
import { Flag } from "@/components/Flag";

/** Which countries have fully closed a given section (e.g. Revenue) this period. */
export function SectionEntityDetail({
  title,
  rows,
}: {
  title: string;
  rows: SectionEntityRow[];
}) {
  const closed = rows.filter((r) => r.closed);
  const pending = rows.filter((r) => !r.closed);

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-green-700">
            Closed ({closed.length})
          </p>
          {closed.length === 0 && <p className="text-sm text-gray-400">No entities yet.</p>}
          <ul className="space-y-1.5">
            {closed.map((r) => (
              <li key={r.entityId} className="flex items-center gap-2 text-sm text-gray-900">
                <Flag country={r.country} />
                {r.displayName}
                <span className="text-xs text-gray-400">
                  ({r.completed}/{r.total})
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Pending ({pending.length})
          </p>
          {pending.length === 0 && <p className="text-sm text-gray-400">None — all closed.</p>}
          <ul className="space-y-1.5">
            {pending.map((r) => (
              <li key={r.entityId} className="flex items-center gap-2 text-sm text-gray-600">
                <Flag country={r.country} />
                {r.displayName}
                <span className="text-xs text-gray-400">
                  ({r.completed}/{r.total})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
