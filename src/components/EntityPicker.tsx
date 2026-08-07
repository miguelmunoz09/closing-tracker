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
      <label htmlFor="entity-search" className="mb-1 block text-sm font-medium text-gray-700">
        Reporting entity
      </label>
      <input
        id="entity-search"
        type="text"
        placeholder="Search by country or code (e.g. Uruguay, 2560)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
      />
      <ul className="max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white">
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-gray-500">No entities found.</li>
        )}
        {filtered.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => goTo(e.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
