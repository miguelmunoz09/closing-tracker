import Link from "next/link";
import { getEntities } from "@/lib/data";
import { getDefaultPeriod } from "@/lib/period";
import { EntityPicker } from "@/components/EntityPicker";
import { Flag } from "@/components/Flag";
import { BuildingIcon, GlobeIcon } from "@/components/icons";

// This page reads the database (entity list), so it has to be generated on
// every visit, not once at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const entities = await getEntities();
  const period = getDefaultPeriod();
  // Flags are rendered here (server-side) so the flag icon library never
  // ships to EntityPicker's client bundle — only the rendered SVG markup does.
  const entityItems = entities.map((e) => ({ ...e, flag: <Flag country={e.country} /> }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Monthly Accounting Close</h1>
        <p className="mt-2 text-gray-500">Choose which profile to use.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href={`/corporate?period=${period}`}
          className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Corporate team</h2>
          <p className="mt-1 text-sm text-gray-500">
            See overall closing progress across every entity for a given month.
          </p>
          <span className="mt-4 text-sm font-medium text-blue-600">Open dashboard →</span>
        </Link>

        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <GlobeIcon className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Reporting entity</h2>
          <p className="mt-1 mb-4 text-sm text-gray-500">
            Pick your country to check off this month's closing tasks.
          </p>
          <EntityPicker entities={entityItems} period={period} />
        </div>
      </div>
    </main>
  );
}
