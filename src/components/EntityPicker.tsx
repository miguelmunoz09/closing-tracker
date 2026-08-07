"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EntitySummary } from "@/lib/data";
import { getCountryFlag } from "@/lib/countryFlags";

/**
 * Buscador simple de entidades: escribís y filtra por país o código,
 * al elegir una entidad te lleva directo a su pantalla de cierre.
 */
export function EntityPicker({ entities, period }: { entities: EntitySummary[]; period: string }) {
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
        placeholder="Buscar país o código (ej: Uruguay, 2560)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
      />
      <ul className="max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white">
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-gray-500">No se encontraron entidades.</li>
        )}
        {filtered.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => goTo(e.id)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <span className="mr-2">{getCountryFlag(e.country)}</span>
              {e.displayName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
