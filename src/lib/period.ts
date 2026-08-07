// Toda la lógica de "meses de reporte" vive en este único archivo,
// para que la página y las consultas a la base usen siempre la misma regla.

// El primer mes disponible en el desplegable de meses.
export const START_PERIOD = "2026-08";

// Hasta cuántos años hacia adelante (desde hoy) se muestran en el desplegable.
const YEARS_AHEAD = 3;

export type PeriodClosingType = "MONTHLY" | "QUARTERLY";

// Marzo, junio, setiembre y diciembre son cierres "Quarterly".
const QUARTERLY_MONTHS = new Set([3, 6, 9, 12]);

/** Dado un período "YYYY-MM", indica si ese mes es Monthly o Quarterly. */
export function getPeriodClosingType(period: string): PeriodClosingType {
  const month = Number(period.split("-")[1]);
  return QUARTERLY_MONTHS.has(month) ? "QUARTERLY" : "MONTHLY";
}

/**
 * Qué tipos de tarea deben verse en un período dado.
 * En un mes Quarterly se ven las tareas Monthly + Quarterly (todas).
 * En un mes Monthly solo se ven las tareas Monthly.
 */
export function getVisibleTaskClosingTypes(period: string): PeriodClosingType[] {
  return getPeriodClosingType(period) === "QUARTERLY"
    ? ["MONTHLY", "QUARTERLY"]
    : ["MONTHLY"];
}

/** Lista de períodos "YYYY-MM" para el desplegable, empezando en START_PERIOD. */
export function getAvailablePeriods(now: Date = new Date()): string[] {
  const [startYear, startMonth] = START_PERIOD.split("-").map(Number);
  const endYear = now.getFullYear() + YEARS_AHEAD;

  const periods: string[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= 12)) {
    periods.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return periods;
}

/** Período seleccionado por defecto: el mes actual si está disponible, si no el primero. */
export function getDefaultPeriod(now: Date = new Date()): string {
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const available = getAvailablePeriods(now);
  return available.includes(current) ? current : START_PERIOD;
}

const MONTH_LABELS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** "2026-08" -> "Agosto 2026" */
export function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-").map(Number);
  return `${MONTH_LABELS_ES[month - 1]} ${year}`;
}
