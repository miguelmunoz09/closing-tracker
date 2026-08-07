# Monthly Accounting Close — Tracker

An app to track the monthly accounting close for reporting entities. Each person signs in, picks "Corporate team" or an entity (country + code), picks the month, and checks off the closing tasks. The corporate team sees overall progress across all entities. Everything is stored in a shared database, with a full history of when each task was checked and unchecked.

This document has the exact steps to get the app running, written for someone with no prior programming experience. Copy and paste the commands as-is, in order, into a terminal (on Windows: PowerShell) inside this folder.

## What each piece is (quick summary)

- **Next.js**: the framework the app is built with (pages + logic).
- **Tailwind**: how the app looks (styling).
- **Prisma**: the tool that connects the app to the database.
- **Vercel**: where the app is hosted, live on the internet.
- **GitHub**: where the code is stored; Vercel reads from there to publish the app.
- **Vercel Postgres (Neon)**: the database where entities, tasks, and the closing history are stored.

## 0. Requirements

- Have **Node.js** installed (it includes `npm`). Check with:

```bash
node --version
npm --version
```

If that errors out, install it from https://nodejs.org (the "LTS" version).

- Have an account at https://github.com and one at https://vercel.com (you can sign into Vercel directly with your GitHub account).

## 1. Install the project's dependencies

From inside this folder (`Reporting app`):

```bash
npm install
```

This downloads everything the app needs to run (Next.js, Tailwind, Prisma, etc.). It can take a minute or two.

## 2. Push the code to GitHub

1. Go to https://github.com/new and create a new repository (it can be private). Don't check any of the "Add a README file", "Add .gitignore", or "Choose a license" boxes — we already have those.
2. Copy the repo URL GitHub shows you (something like `https://github.com/your-username/closing-tracker.git`).
3. In the terminal:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin PASTE_YOUR_REPO_URL_HERE
git push -u origin main
```

## 3. Create the Vercel project and connect the database

1. Go to https://vercel.com/new, choose "Import Git Repository", and select the repo you just pushed.
2. Before clicking "Deploy", you don't need to touch anything else — Vercel detects it's a Next.js project on its own. Go ahead and click "Deploy" (it will fail the first time because the database and environment variables don't exist yet — that's expected, we'll fix it next).
3. Inside the newly created Vercel project, go to the **Storage** tab → **Create Database** → choose **Postgres** (Neon) → follow the steps to create it and connect it to this project. Vercel will generate the connection variables on its own.
4. Go to **Settings → Environment Variables** for the project and check which variables were created (they'll be named something like `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, depending on the integration version). Make sure these two variables exist (if they don't exist under these exact names, create them by copying the **value** from whichever one Vercel did generate):
   - `DATABASE_URL` → use the "pooled" connection value (`POSTGRES_PRISMA_URL`, or `DATABASE_URL` if it already exists).
   - `DATABASE_URL_UNPOOLED` → use the direct connection value (`POSTGRES_URL_NON_POOLING`).

> **Heads up:** some Vercel database integrations mark these variables as "Sensitive," which means their real value can't be read from the CLI or the dashboard — including by `vercel env pull` in step 4 below. If that happens, `prisma migrate dev` and `prisma db seed` won't work from a computer, since they need the real value. The workaround: generate the initial migration **offline** (no DB connection needed) with `npx prisma migrate diff --from-empty --to-schema-datamodel=prisma/schema.prisma --script`, save that output as `prisma/migrations/<a timestamp>_init/migration.sql` plus a `prisma/migrations/migration_lock.toml` with `provider = "postgresql"`, commit and push it — Vercel's own build step (`prisma migrate deploy`, already wired into `npm run build`) will apply it using its own runtime access to the variables. For the initial data load, temporarily add a non-sensitive `SEED_SECRET` environment variable, redeploy so the build picks it up, then visit `https://your-app.vercel.app/api/seed?token=THAT_VALUE` once to run the seed — then remove the `SEED_SECRET` variable again.

## 4. Set up the database on your computer (to create the tables)

1. Install the Vercel command-line tool and link this folder to the project you created:

```bash
npm install -g vercel
vercel link
```

(It will ask which Vercel project to link this folder to — pick the one you created in step 3.)

2. Pull the real environment variables into this folder:

```bash
vercel env pull .env
```

This creates a `.env` file (not pushed to GitHub, it's only for your computer) with the real database credentials.

3. Create the database tables from the project's schema:

```bash
npx prisma migrate dev --name init
```

This generates a `prisma/migrations` folder — it's important to push it to GitHub (step 6).

4. Load the initial data (the entities and tasks from the Excel files):

```bash
npx prisma db seed
```

If you see the message `Done: sections, tasks, and entities loaded.`, it worked.

## 5. Try the app on your computer (optional)

```bash
npm run dev
```

Then open http://localhost:3000 in your browser. `Ctrl + C` in the terminal to stop it.

## 6. Push the migration and republish

```bash
git add .
git commit -m "Add initial database migration"
git push
```

Pushing automatically republishes the app on Vercel (now with the database connected), and this time it should actually work. You can follow along in the **Deployments** tab of the Vercel project.

## Day-to-day use (once published)

- Share the URL Vercel gives you (something like `https://closing-tracker.vercel.app`) with the accounting team.
- No username or password needed: each person picks "Corporate team" or their entity, picks the month, and checks off tasks.
- If a month is March, June, September, or December, every task shows up (Monthly + Quarterly). Every other month, only the Monthly ones.
- Only the Corporate team view can add new tasks — once added, they become available to every entity from then on.

## If something breaks

Copy the full error message from the terminal (or from the "Deployments" tab in Vercel, inside the log of the failed deploy) and send it over — we'll work through it step by step from there.
