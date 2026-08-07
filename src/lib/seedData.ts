// Datos de carga inicial + la función que los inserta. La usan dos lugares:
// - prisma/seed.ts (para cargarlos desde una computadora con acceso directo a la base)
// - src/app/api/seed/route.ts (para cargarlos disparando la ruta ya desplegada,
//   cuando la base solo es accesible desde el propio servidor de Vercel).
import type { PrismaClient, TaskClosingType } from "@prisma/client";

// Datos tomados del archivo "Tareas.xlsx".
export const SECTIONS: {
  name: string;
  sortOrder: number;
  tasks: { name: string; closingType: TaskClosingType }[];
}[] = [
  {
    name: "Revenue",
    sortOrder: 0,
    tasks: [
      { name: "Gross revenue closed?", closingType: "MONTHLY" },
      { name: "Revenue cut-off revised?", closingType: "QUARTERLY" },
      { name: "GTN adjustment performed?", closingType: "MONTHLY" },
    ],
  },
  {
    name: "BS & P&L",
    sortOrder: 1,
    tasks: [
      { name: "Inventory Provision", closingType: "MONTHLY" },
      { name: "Bad debt Allowance", closingType: "MONTHLY" },
      { name: "Return allowance", closingType: "QUARTERLY" },
      { name: "Amortization", closingType: "MONTHLY" },
      { name: "IFRS 16 adjustments", closingType: "MONTHLY" },
      { name: "Long term recla", closingType: "MONTHLY" },
    ],
  },
  {
    name: "Income tax",
    sortOrder: 2,
    tasks: [
      { name: "Current income tax", closingType: "QUARTERLY" },
      { name: "Deferred income tax", closingType: "QUARTERLY" },
      { name: "Tax balance clasification", closingType: "QUARTERLY" },
    ],
  },
  {
    name: "Reporting",
    sortOrder: 3,
    tasks: [
      { name: "Sales units", closingType: "MONTHLY" },
      { name: "AR", closingType: "MONTHLY" },
      { name: "Units", closingType: "MONTHLY" },
      { name: "Tax template", closingType: "QUARTERLY" },
    ],
  },
  {
    name: "Sign Off",
    sortOrder: 4,
    tasks: [{ name: "Confirm month close", closingType: "MONTHLY" }],
  },
];

// Datos tomados del archivo "Entidades y paises.xlsx".
// Algunos códigos combinan dos entidades legales en una sola fila de reporte
// (ej: "2060 & 2090"), y hay más de una entidad para el mismo país
// (Uruguay: 2560, 2590 y 2595) — por eso se muestran siempre como "País (código)".
export const ENTITIES: { code: string; country: string }[] = [
  { code: "2000", country: "Canada" },
  { code: "2010", country: "USA" },
  { code: "2030", country: "Luxembourg" },
  { code: "2060 & 2090", country: "Spain" },
  { code: "2120", country: "Mexico" },
  { code: "2210", country: "Colombia" },
  { code: "2260", country: "Ecuador" },
  { code: "2320", country: "Peru" },
  { code: "2380", country: "Brazil" },
  { code: "2440", country: "Bolivia" },
  { code: "2470 & 2500", country: "Chile" },
  { code: "2530", country: "Paraguay" },
  { code: "2560", country: "Uruguay" },
  { code: "2590", country: "Uruguay" },
  { code: "2595", country: "Uruguay" },
  { code: "2655", country: "Argentina" },
];

export async function seedDatabase(prisma: PrismaClient) {
  for (const s of SECTIONS) {
    const section = await prisma.section.upsert({
      where: { name: s.name },
      update: { sortOrder: s.sortOrder },
      create: { name: s.name, sortOrder: s.sortOrder },
    });

    for (let i = 0; i < s.tasks.length; i++) {
      const t = s.tasks[i];
      await prisma.task.upsert({
        where: { sectionId_name: { sectionId: section.id, name: t.name } },
        update: { closingType: t.closingType, sortOrder: i },
        create: {
          name: t.name,
          closingType: t.closingType,
          sortOrder: i,
          sectionId: section.id,
        },
      });
    }
  }

  for (const e of ENTITIES) {
    await prisma.entity.upsert({
      where: { code: e.code },
      update: { country: e.country, displayName: `${e.country} (${e.code})` },
      create: {
        code: e.code,
        country: e.country,
        displayName: `${e.country} (${e.code})`,
      },
    });
  }
}
