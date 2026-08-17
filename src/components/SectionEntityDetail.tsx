import type { SectionEntityRow } from "@/lib/data";
import { Flag } from "@/components/Flag";
import { SectionIcon } from "@/components/icons";

/** Which countries have fully closed a given section (e.g. Revenue) this period. */
export function SectionEntityDetail({
  sectionName,
  title,
  rows,
}: {
  sectionName: string;
  title: string;
  rows: SectionEntityRow[];
}) {
  const closed = rows.filter((r) => r.closed);
  const pending = rows.filter((r) => !r.closed);

  return (
    <details open className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-gray-900">
        <SectionIcon name={sectionName} className="h-4 w-4 text-gray-400" />
        {title}
      </summary>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
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
    </details>
  );
}
