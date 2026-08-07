"use server";

// Server Actions: funciones que corren en el servidor pero se llaman
// directamente desde componentes de cliente, como si fueran funciones
// normales (Next.js se encarga de la comunicación por debajo).

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getTaskHistoryEvents, type TaskHistoryEvent } from "@/lib/data";

type ToggleInput = {
  entityId: string;
  taskId: string;
  period: string;
  completed: boolean;
};

type ToggleResult =
  | { ok: true; completedAt: string | null }
  | { ok: false; error: string };

/**
 * Marca o desmarca una tarea. Nunca se pisa una fila existente: se agrega
 * una fila nueva al historial con el estado resultante. Así queda guardado
 * para siempre cuándo se marcó y cuándo se desmarcó cada tarea.
 */
export async function toggleTaskCompletion(input: ToggleInput): Promise<ToggleResult> {
  try {
    const row = await prisma.taskCompletion.create({
      data: {
        entityId: input.entityId,
        taskId: input.taskId,
        period: input.period,
        completed: input.completed,
      },
    });

    revalidatePath(`/entity/${input.entityId}`);
    revalidatePath("/corporate");

    return { ok: true, completedAt: row.completed ? row.createdAt.toISOString() : null };
  } catch (err) {
    console.error("toggleTaskCompletion failed", err);
    return { ok: false, error: "No se pudo guardar el cambio. Probá de nuevo." };
  }
}

// Se usa un tipo propio ("MONTHLY" | "QUARTERLY") en vez de importar el enum
// de Prisma acá: este archivo lo llaman componentes de cliente, y conviene
// que el "contrato" de la función no dependa de los tipos generados por Prisma.
type AddTaskInput = {
  sectionId: string;
  name: string;
  closingType: "MONTHLY" | "QUARTERLY";
  // Solo se usa para refrescar la pantalla desde la que se agregó la tarea.
  entityId?: string;
};

type AddTaskResult =
  | { ok: true; task: { id: string; name: string; closingType: string; sectionId: string } }
  | { ok: false; error: string };

/**
 * Crea una tarea nueva. Es global: al no estar asociada a ninguna entidad
 * en particular, aparece automáticamente para todas las entidades a partir
 * de este momento (en los meses en que corresponda según su tipo).
 */
export async function addTask(input: AddTaskInput): Promise<AddTaskResult> {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "El nombre de la tarea no puede estar vacío." };
  }

  try {
    const last = await prisma.task.findFirst({
      where: { sectionId: input.sectionId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const task = await prisma.task.create({
      data: {
        sectionId: input.sectionId,
        name,
        closingType: input.closingType,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    if (input.entityId) revalidatePath(`/entity/${input.entityId}`);
    revalidatePath("/corporate");

    return {
      ok: true,
      task: { id: task.id, name: task.name, closingType: task.closingType, sectionId: task.sectionId },
    };
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return { ok: false, error: "Ya existe una tarea con ese nombre en esa sección." };
    }
    console.error("addTask failed", err);
    return { ok: false, error: "No se pudo crear la tarea." };
  }
}

type HistoryInput = { entityId: string; taskId: string; period: string };
type HistoryResult = { ok: true; events: TaskHistoryEvent[] } | { ok: false; error: string };

/** Devuelve el historial completo de marcas/desmarcas de una tarea. */
export async function getTaskHistory(input: HistoryInput): Promise<HistoryResult> {
  try {
    const events = await getTaskHistoryEvents(input.entityId, input.taskId, input.period);
    return { ok: true, events };
  } catch (err) {
    console.error("getTaskHistory failed", err);
    return { ok: false, error: "No se pudo cargar el historial." };
  }
}
