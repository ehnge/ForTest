# Horizon Agent Guide

Horizon is a research demo health companion for space travelers. It uses synthetic data only and is not a medical device.

## 🗺️ Project Status & Context Trackers

### 🟢 Currently Built

- **Frontend foundation:** React + Vite + TypeScript scaffold is created.
- **Supabase dependency:** `@supabase/supabase-js` is installed.
- **Supabase client:** Browser client exists in `src/lib/supabase.ts`.
- **Environment setup:** `.env.example` is committed and `.env.local` is ignored.
- **Connection test page:** `src/App.tsx` checks Supabase configuration and queries `sample_people`.
- **Safety disclaimer:** The placeholder page displays: `Simulated data. Not medical advice. Not diagnostic.`
- **Build verification:** `npm run build` passes.
- **Git:** Initial local commit exists and `origin` points to the HEXARA GitHub repository.
- **Agent guidance:** Supabase, Postgres best practices, and security best practices are installed.

### 🟡 Active Focus

> **AGENT NOTE:** Do not begin final Horizon UI work until the minimal backend foundation is available, unless the user explicitly changes direction.

- **Immediate task:** Create the minimal Supabase schema and seed synthetic data.
- **Required tables:** `sample_people`, `health_observations`, and `demo_events`.
- **Required seed:** Four synthetic travelers with 180 days of observations.
- **Security requirement:** Enable RLS on every exposed table and allow only the intended synthetic-data reads.
- **Current blocker:** Supabase management access currently returns a permission error for the configured project.

### 🔴 Left to Build

- [ ] Create Supabase migrations.
- [ ] Seed four synthetic sample people.
- [ ] Seed 180 days of synthetic observations per person.
- [ ] Add injected radiation, illness-like, and sleep-disruption demo events.
- [ ] Add a typed Supabase repository/data-access layer.
- [ ] Add deterministic seed control and event replay.
- [ ] Centralize alert rules in one documented module.
- [ ] Build the life-stage selector and Home screen.
- [ ] Build Trends charts and alert explanations.
- [ ] Build Check-in with LocalStorage persistence.
- [ ] Build First-timer, Exercise, Mental Health, Radiation, and About screens.
- [ ] Add NASA DONKI fallback handling.
- [ ] Add unit and UI tests.
- [ ] Add responsive dark space-themed styling.
- [ ] Verify all screens remain clearly synthetic and non-diagnostic.

## 🧱 Technical Rules

- Use React, TypeScript, Vite, Tailwind CSS, Recharts, and Supabase.
- Use only the Supabase publishable key in browser code.
- Never expose or commit a Supabase service-role or secret key.
- Keep user check-ins and personal interactions in LocalStorage unless cloud persistence is explicitly requested.
- Use synthetic data only.
- Keep all alert logic in one small, well-commented module.
- Every alert must include a plain-language reason.
- Do not present diagnoses or clinical conclusions.
- Preserve the persistent disclaimer: `Simulated data. Not medical advice. Not diagnostic.`

## 🤖 Agent Workflow Rules

1. At the start of every task, read this file and inspect the current repository state.
2. Treat the Active Focus section as the immediate default task.
3. Do not expand scope without explicit user direction.
4. Before changing Supabase tables, migrations, RLS, indexes, or database functions, read the Supabase and Postgres best-practice instructions.
5. After each successful implementation task, move completed work into Currently Built, update Active Focus, check off completed backlog items, and record new blockers.
6. Never claim a task is complete without running the relevant build, test, or verification command.
7. Preserve existing user changes and do not overwrite unrelated work.
8. Keep this roadmap concise and factual; never record secrets or private data.
