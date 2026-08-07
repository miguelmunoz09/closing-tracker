import Link from "next/link";
import { getEntities } from "@/lib/data";
import { getDefaultPeriod } from "@/lib/period";
import { EntityPicker } from "@/components/EntityPicker";
import { Flag } from "@/components/Flag";

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold">Monthly Accounting Close</h1>
      <p className="mb-8 text-center text-sm text-gray-600">Choose which profile to use.</p>

      <div className="w-full space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Link
          href={`/corporate?period=${period}`}
          className="block w-full rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
        >
          Corporate team
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wide text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <EntityPicker entities={entityItems} period={period} />
      </div>
    </main>
  );
}
