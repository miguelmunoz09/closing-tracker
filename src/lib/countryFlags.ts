// ISO 3166-1 alpha-2 code per country, used to look up the flag icon
// (see src/components/Flag.tsx). Emoji flags don't render on Windows, so we
// use real SVG icons instead.
const COUNTRY_CODES: Record<string, string> = {
  Canada: "CA",
  USA: "US",
  Luxembourg: "LU",
  Spain: "ES",
  Mexico: "MX",
  Colombia: "CO",
  Ecuador: "EC",
  Peru: "PE",
  Brazil: "BR",
  Bolivia: "BO",
  Chile: "CL",
  Paraguay: "PY",
  Uruguay: "UY",
  Argentina: "AR",
};

/** ISO country code for a country name, or null if not mapped. */
export function getCountryCode(country: string): string | null {
  return COUNTRY_CODES[country] ?? null;
}
