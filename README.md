# Cierre contable mensual — panel de seguimiento

App para hacer seguimiento del cierre contable mensual de las entidades que reportan. Cada persona entra, elige "Corporate team" o una entidad (país + código), elige el mes, y va tildando las tareas del cierre. El equipo corporativo ve el avance total de todas las entidades. Todo queda guardado en una base de datos compartida, con historial completo de cuándo se marcó y desmarcó cada tarea.

Este documento tiene los pasos exactos para dejar la app funcionando, pensados para alguien sin experiencia previa en programación. Copiá y pegá los comandos tal cual, en orden, en una terminal (en Windows: PowerShell) dentro de esta carpeta.

## Qué es cada cosa (resumen rápido)

- **Next.js**: el framework con el que está hecha la app (páginas + lógica).
- **Tailwind**: cómo se ve la app (estilos).
- **Prisma**: la herramienta que conecta la app con la base de datos.
- **Vercel**: dónde queda "prendida" la app en internet (hosting).
- **GitHub**: donde queda guardado el código; Vercel lo lee de ahí para publicar la app.
- **Vercel Postgres (Neon)**: la base de datos donde se guardan las entidades, tareas y el historial de cierre.

## 0. Requisitos

- Tener instalado **Node.js** (incluye `npm`). Se puede verificar así:

```bash
node --version
npm --version
```

Si da error, instalar desde https://nodejs.org (versión "LTS").

- Tener una cuenta en https://github.com y otra en https://vercel.com (podés entrar a Vercel directamente con tu cuenta de GitHub).

## 1. Instalar las dependencias del proyecto

Parado en esta carpeta (`Reporting app`):

```bash
npm install
```

Esto descarga todo lo que la app necesita para funcionar (Next.js, Tailwind, Prisma, etc.). Puede tardar uno o dos minutos.

## 2. Subir el código a GitHub

1. Entrá a https://github.com/new y creá un repositorio nuevo (puede ser privado). No marques ninguna casilla de "agregar README" ni ".gitignore" — ya los tenemos.
2. Copiá la URL del repo que te muestra GitHub (algo como `https://github.com/tu-usuario/closing-tracker.git`).
3. En la terminal:

```bash
git init
git add .
git commit -m "Version inicial"
git branch -M main
git remote add origin PEGA_AQUI_LA_URL_DE_TU_REPO
git push -u origin main
```

## 3. Crear el proyecto en Vercel y conectar la base de datos

1. Entrá a https://vercel.com/new, elegí "Import Git Repository" y seleccioná el repo que acabás de subir.
2. Antes de hacer clic en "Deploy", no hace falta tocar nada más — Vercel detecta que es un proyecto Next.js solo. Podés darle "Deploy" (va a fallar la primera vez porque todavía no existe la base de datos ni las variables de entorno — es esperado, seguimos).
3. Dentro del proyecto ya creado en Vercel, ir a la pestaña **Storage** → **Create Database** → elegir **Postgres** (Neon) → seguí los pasos para crearla y conectarla a este proyecto. Vercel va a generar solo las variables de conexión.
4. Ir a **Settings → Environment Variables** del proyecto y revisar qué variables quedaron creadas (van a tener nombres como `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, según la versión de la integración). Asegurate de que existan estas dos variables (si no existen con ese nombre exacto, creálas copiando el **valor** desde la que sí generó Vercel):
   - `DATABASE_URL` → usá el valor de la conexión "pooled" (`POSTGRES_PRISMA_URL` o `DATABASE_URL` si ya existe).
   - `DATABASE_URL_UNPOOLED` → usá el valor de la conexión directa (`POSTGRES_URL_NON_POOLING`).

## 4. Configurar la base de datos en tu computadora (para poder crear las tablas)

1. Instalá la herramienta de línea de comandos de Vercel y conectá esta carpeta con el proyecto que creaste:

```bash
npm install -g vercel
vercel link
```

(Te va a preguntar a qué proyecto de Vercel conectar esta carpeta — elegí el que creaste en el paso 3.)

2. Traé las variables de entorno reales a esta carpeta:

```bash
vercel env pull .env
```

Esto crea un archivo `.env` (no se sube a GitHub, es solo para tu computadora) con las credenciales reales de la base.

3. Creá las tablas en la base de datos a partir del esquema del proyecto:

```bash
npx prisma migrate dev --name init
```

Esto genera una carpeta `prisma/migrations` — es importante subirla a GitHub (paso 6).

4. Cargá los datos iniciales (las entidades y las tareas de los archivos Excel):

```bash
npx prisma db seed
```

Si ves el mensaje `Listo: secciones, tareas y entidades cargadas.`, funcionó.

## 5. Probar la app en tu computadora (opcional)

```bash
npm run dev
```

Y abrí http://localhost:3000 en el navegador. `Ctrl + C` en la terminal para apagarla.

## 6. Subir la migración y volver a publicar

```bash
git add .
git commit -m "Agregar migracion inicial de la base de datos"
git push
```

Al hacer `push`, Vercel vuelve a publicar la app automáticamente (ya con la base conectada), y esta vez sí debería funcionar. Podés seguir el progreso en la pestaña **Deployments** del proyecto en Vercel.

## Uso diario (una vez publicada)

- Compartí la URL que te da Vercel (algo como `https://closing-tracker.vercel.app`) con el equipo contable.
- No hace falta usuario ni contraseña: cada persona elige "Corporate team" o su entidad, elige el mes, y tilda las tareas.
- Si un mes es marzo, junio, setiembre o diciembre, aparecen todas las tareas (Monthly + Quarterly). Los demás meses, solo las Monthly.
- Cualquiera puede agregar una tarea nueva desde la pantalla de una entidad — queda disponible para todas las entidades a partir de ese momento.

## Si algo falla

Copiá el mensaje de error completo de la terminal (o de la pestaña "Deployments" en Vercel, dentro del log del deploy que falló) y pegámelo — seguimos el paso a paso desde ahí.
