// Todas las lecturas de datos (consultas a la base) viven acá.
// Las páginas (Server Components) llaman directamente a estas funciones.
import { TaskClosingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPeriodClosingType, getVisibleTaskClosingTypes } from "@/lib/period";

// Nota sobre el "as TaskClosingType[]": lib/period.ts no depende de Prisma
// a propósito (es lógica pura, fácil de leer y de testear). Prisma genera
// su propio enum con los mismos valores ("MONTHLY" / "QUARTERLY"), así que
// convertimos el tipo acá, en el único lugar donde se usa Prisma.
function visibleTypes(period: string): TaskClosingType[] {
  return getVisibleTaskClosingTypes(period) as TaskClosingType[];
}

export type EntitySummary = {
  id: string;
  code: string;
  country: string;
  displayName: string;
};

/** Lista de entidades para el selector de la pantalla de inicio. */
export async function getEntities(): Promise<EntitySummary[]> {
  return prisma.entity.findMany({
    orderBy: { displayName: "asc" },
    select: { id: true, code: true, country: true, displayName: true },
  });
}

export async function getEntityById(entityId: string): Promise<EntitySummary | null> {
  return prisma.entity.findUnique({
    where: { id: entityId },
    select: { id: true, code: true, country: true, displayName: true },
  });
}

export type EntityClosingTask = {
  id: string;
  name: string;
  closingType: TaskClosingType;
  completed: boolean;
  completedAt: string | null;
};

export type EntityClosingSection = {
  id: string;
  name: string;
  tasks: EntityClosingTask[];
};

export type EntityClosingData = {
  period: string;
  periodClosingType: ReturnType<typeof getPeriodClosingType>;
  sections: EntityClosingSection[];
};

/** Todo lo que necesita la pantalla de una entidad para un período dado. */
export async function getEntityClosingData(
  entityId: string,
  period: string
): Promise<EntityClosingData> {
  const types = visibleTypes(period);

  const [sections, completions] = await Promise.all([
    prisma.section.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        tasks: {
          where: { closingType: { in: types } },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.taskCompletion.findMany({
      where: { entityId, period },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Nos quedamos con la fila más reciente por tarea (estado actual).
  const latestByTask = new Map<string, { completed: boolean; at: Date }>();
  for (const c of completions) {
    if (!latestByTask.has(c.taskId)) {
      latestByTask.set(c.taskId, { completed: c.completed, at: c.createdAt });
    }
  }

  return {
    period,
    periodClosingType: getPeriodClosingType(period),
    sections: sections
      .filter((s) => s.tasks.length > 0)
      .map((s) => ({
        id: s.id,
        name: s.name,
        tasks: s.tasks.map((t) => {
          const latest = latestByTask.get(t.id);
          return {
            id: t.id,
            name: t.name,
            closingType: t.closingType,
            completed: latest?.completed ?? false,
            completedAt: latest?.completed ? latest.at.toISOString() : null,
          };
        }),
      })),
  };
}

export type CorporateEntityRow = {
  entityId: string;
  displayName: string;
  country: string;
  completed: number;
  total: number;
  percent: number;
};

export type CorporateSectionRow = {
  sectionId: string;
  name: string;
  completed: number;
  total: number;
  percent: number;
};

export type CorporateSummary = {
  period: string;
  periodClosingType: ReturnType<typeof getPeriodClosingType>;
  totals: { completed: number; total: number; percent: number };
  byEntity: CorporateEntityRow[];
  bySection: CorporateSectionRow[];
};

/** Resumen para la vista "Corporate team": avance total, por entidad y por sección. */
export async function getCorporateSummary(period: string): Promise<CorporateSummary> {
  const types = visibleTypes(period);

  const [entities, tasks, completions] = await Promise.all([
    prisma.entity.findMany({ orderBy: { displayName: "asc" } }),
    prisma.task.findMany({
      where: { closingType: { in: types } },
      include: { section: true },
      orderBy: [{ section: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.taskCompletion.findMany({
      where: { period, task: { closingType: { in: types } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Estado actual (true/false) por combinación entidad+tarea.
  const latest = new Map<string, boolean>();
  for (const c of completions) {
    const key = `${c.entityId}:${c.taskId}`;
    if (!latest.has(key)) latest.set(key, c.completed);
  }

  const totalPerEntity = tasks.length;
  let completedCount = 0;

  const byEntity: CorporateEntityRow[] = entities.map((e) => {
    let completed = 0;
    for (const t of tasks) {
      if (latest.get(`${e.id}:${t.id}`)) completed++;
    }
    completedCount += completed;
    return {
      entityId: e.id,
      displayName: e.displayName,
      country: e.country,
      completed,
      total: totalPerEntity,
      percent: totalPerEntity ? Math.round((completed / totalPerEntity) * 100) : 0,
    };
  });

  const sectionMap = new Map<string, CorporateSectionRow>();
  for (const t of tasks) {
    const row =
      sectionMap.get(t.sectionId) ??
      ({ sectionId: t.sectionId, name: t.section.name, completed: 0, total: 0, percent: 0 } as CorporateSectionRow);
    row.total += entities.length;
    for (const e of entities) {
      if (latest.get(`${e.id}:${t.id}`)) row.completed++;
    }
    sectionMap.set(t.sectionId, row);
  }
  const bySection = Array.from(sectionMap.values()).map((s) => ({
    ...s,
    percent: s.total ? Math.round((s.completed / s.total) * 100) : 0,
  }));

  const total = entities.length * totalPerEntity;

  return {
    period,
    periodClosingType: getPeriodClosingType(period),
    totals: {
      completed: completedCount,
      total,
      percent: total ? Math.round((completedCount / total) * 100) : 0,
    },
    byEntity,
    bySection,
  };
}

export type TaskHistoryEvent = { completed: boolean; at: string };

/** Historial completo (todas las marcas/desmarcas) de una tarea puntual. */
export async function getTaskHistoryEvents(
  entityId: string,
  taskId: string,
  period: string
): Promise<TaskHistoryEvent[]> {
  const rows = await prisma.taskCompletion.findMany({
    where: { entityId, taskId, period },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({ completed: r.completed, at: r.createdAt.toISOString() }));
}

export type SectionOption = { id: string; name: string };

/** Lista de secciones para el formulario de "agregar tarea nueva". */
export async function getSections(): Promise<SectionOption[]> {
  return prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
}
