// Carga inicial de datos: secciones, tareas y entidades.
// Se puede ejecutar varias veces sin duplicar nada (usa upsert).
// Se ejecuta con: npx prisma db seed

import { PrismaClient, TaskClosingType } from "@prisma/client";

const prisma = new PrismaClient();

// Datos tomados del archivo "Tareas.xlsx".
const SECTIONS: {
  name: string;
  sortOrder: number;
  tasks: { name: string; closingType: TaskClosingType }[];
}[] = [
  {
    name: "Revenue",
    sortOrder: 0,
    tasks: [
      { name: "Gross revenue closed?", closingType: TaskClosingType.MONTHLY },
      { name: "Revenue cut-off revised?", closingType: TaskClosingType.QUARTERLY },
      { name: "GTN adjustment performed?", closingType: TaskClosingType.MONTHLY },
    ],
  },
  {
    name: "BS & P&L",
    sortOrder: 1,
    tasks: [
      { name: "Inventory Provision", closingType: TaskClosingType.MONTHLY },
      { name: "Bad debt Allowance", closingType: TaskClosingType.MONTHLY },
      { name: "Return allowance", closingType: TaskClosingType.QUARTERLY },
      { name: "Amortization", closingType: TaskClosingType.MONTHLY },
      { name: "IFRS 16 adjustments", closingType: TaskClosingType.MONTHLY },
      { name: "Long term recla", closingType: TaskClosingType.MONTHLY },
    ],
  },
  {
    name: "Income tax",
    sortOrder: 2,
    tasks: [
      { name: "Current income tax", closingType: TaskClosingType.QUARTERLY },
      { name: "Deferred income tax", closingType: TaskClosingType.QUARTERLY },
      { name: "Tax balance clasification", closingType: TaskClosingType.QUARTERLY },
    ],
  },
  {
    name: "Reporting",
    sortOrder: 3,
    tasks: [
      { name: "Sales units", closingType: TaskClosingType.MONTHLY },
      { name: "AR", closingType: TaskClosingType.MONTHLY },
      { name: "Units", closingType: TaskClosingType.MONTHLY },
      { name: "Tax template", closingType: TaskClosingType.QUARTERLY },
    ],
  },
];

// Datos tomados del archivo "Entidades y paises.xlsx".
// Algunos códigos combinan dos entidades legales en una sola fila de reporte
// (ej: "2060 & 2090"), y hay más de una entidad para el mismo país
// (Uruguay: 2560, 2590 y 2595) — por eso se muestran siempre como "País (código)".
const ENTITIES: { code: string; country: string }[] = [
  { code: "2000", country: "Canada" },
  { code: "2010", country: "USA" },
  { code: "2030", country: "Luxemburgo" },
  { code: "2060 & 2090", country: "España" },
  { code: "2120", country: "México" },
  { code: "2210", country: "Colombia" },
  { code: "2260", country: "Ecuador" },
  { code: "2320", country: "Perú" },
  { code: "2380", country: "Brasil" },
  { code: "2440", country: "Bolivia" },
  { code: "2470 & 2500", country: "Chile" },
  { code: "2530", country: "Paraguay" },
  { code: "2560", country: "Uruguay" },
  { code: "2590", country: "Uruguay" },
  { code: "2595", country: "Uruguay" },
  { code: "2655", country: "Argentina" },
];

async function main() {
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

  console.log("Listo: secciones, tareas y entidades cargadas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
