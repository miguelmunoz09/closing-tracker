// Carga inicial de datos: secciones, tareas y entidades.
// Se puede ejecutar varias veces sin duplicar nada (usa upsert).
// Se ejecuta con: npx prisma db seed
// (Requiere poder conectarse directamente a la base de datos. Si tu base
// tiene las variables marcadas como "Sensitive" en Vercel, usá en cambio
// la ruta /api/seed — ver src/app/api/seed/route.ts.)

import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seedData";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .then(() => {
    console.log("Listo: secciones, tareas y entidades cargadas.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
