"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { EntitySummary } from "@/lib/data";

// The flag is rendered server-side (see app/page.tsx) and passed in as
// already-rendered markup, so the flag icon library never ships to this
// client component's JS bundle.
export type PickerEntity = EntitySummary & { flag: ReactNode };

/**
 * Simple entity search box: type to filter by country or code, selecting an
 * entity takes you straight to its closing screen.
 */
export function EntityPicker({ entities, period }: { entities: PickerEntity[]; period: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entities;
    return entities.filter(
      (e) => e.displayName.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)
    );
  }, [entities, query]);

  function goTo(entityId: string) {
    router.push(`/entity/${entityId}?period=${period}`);
  }

  return (
    <div className="w-full">
      <input
        aria-label="Search reporting entity"
        type="text"
        placeholder="Search by country or code (e.g. Uruguay, 2560)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <ul className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-gray-500">No entities found.</li>
        )}
        {filtered.map((e) => (
          <li key={e.id} className="border-b border-gray-100 last:border-b-0">
            <button
              type="button"
              onClick={() => goTo(e.id)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              {e.flag}
              {e.displayName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
