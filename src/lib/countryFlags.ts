// Emoji de bandera por país, para mostrar junto al nombre en listas y títulos.
const FLAGS: Record<string, string> = {
  Canada: "🇨🇦",
  USA: "🇺🇸",
  Luxemburgo: "🇱🇺",
  España: "🇪🇸",
  México: "🇲🇽",
  Colombia: "🇨🇴",
  Ecuador: "🇪🇨",
  Perú: "🇵🇪",
  Brasil: "🇧🇷",
  Bolivia: "🇧🇴",
  Chile: "🇨🇱",
  Paraguay: "🇵🇾",
  Uruguay: "🇺🇾",
  Argentina: "🇦🇷",
};

/** Bandera del país, o una bandera genérica si no está mapeado. */
export function getCountryFlag(country: string): string {
  return FLAGS[country] ?? "🏳️";
}
