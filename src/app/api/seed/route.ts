// Ruta de mantenimiento para cargar los datos iniciales (entidades, secciones
// y tareas) cuando no es posible conectarse directamente a la base desde
// afuera (por ejemplo, si las variables de conexión están marcadas como
// "Sensitive" en Vercel). Se protege con un token para que no cualquiera
// pueda dispararla: hay que pasar ?token=EL_MISMO_VALOR_DE_SEED_SECRET.
// Se puede borrar este archivo una vez que la carga inicial ya se hizo.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seedData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!process.env.SEED_SECRET || token !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    await seedDatabase(prisma);
    return NextResponse.json({ ok: true, message: "Initial data loaded." });
  } catch (err) {
    console.error("Seed route failed", err);
    return NextResponse.json({ ok: false, error: "Failed to load the data." }, { status: 500 });
  }
}
