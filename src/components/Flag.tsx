import * as flags from "country-flag-icons/react/3x2";
import type { ComponentType, SVGProps } from "react";
import { getCountryCode } from "@/lib/countryFlags";

// The package exports one named component per ISO code (AR, BR, US, ...);
// this casts it to a lookup map so we can select one by a variable code.
const FLAGS = flags as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

/** Small flag icon (real SVG, works everywhere — Windows doesn't render flag emoji). */
export function Flag({ country, className = "h-4 w-6 shrink-0" }: { country: string; className?: string }) {
  const code = getCountryCode(country);
  const FlagIcon = code ? FLAGS[code] : undefined;

  if (!FlagIcon) return null;

  return (
    <span title={country} className="inline-flex">
      <FlagIcon className={className} />
    </span>
  );
}
