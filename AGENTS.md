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
- **Workflow definition:** The active-astronaut workflow and the three-stage product flow have been analyzed and converted into the phased roadmap below.

### 🟡 Active Focus

> **AGENT NOTE:** Do not begin final Horizon UI work until the minimal backend foundation is available, unless the user explicitly changes direction.

- **Immediate task:** Resolve Supabase management access, then create the minimal schema and seed synthetic data.
- **Required tables:** `sample_people`, `health_observations`, and `demo_events`.
- **Required seed:** Four synthetic travelers with 180 days of observations.
- **Security requirement:** Enable RLS on every exposed table and allow only the intended synthetic-data reads.
- **Current blocker:** Supabase management access currently returns a permission error for the configured project.

## 🧭 Implementation Roadmap

Complete phases in order. Do not mark a phase complete until its verification checks pass.

### Phase 0 — Foundation and project safety

- [x] Create the React/Vite/TypeScript project.
- [x] Configure the Supabase browser client.
- [x] Add environment-variable examples and ignore local secrets.
- [x] Add the persistent synthetic-data disclaimer.
- [x] Add the living `AGENTS.md` roadmap.
- [x] Verify the production build.
- [x] Verify the initial scaffold is pushed to the shared GitHub repository.

**Exit check:** A teammate can clone the repository, install dependencies, configure `.env.local`, and run the app.

### Phase 1 — Synthetic data and Supabase foundation

- [ ] Confirm access to the configured Supabase project.
- [ ] Create migrations for `sample_people`, `health_observations`, and `demo_events`.
- [ ] Enable RLS on every exposed table.
- [ ] Add read-only policies for public synthetic demo data.
- [ ] Seed four traveler profiles.
- [ ] Generate 180 days of deterministic observations per traveler.
- [ ] Add the 3-day radiation spike, 5-day illness-like episode, and 5-day sleep disruption.
- [ ] Add seed control and replay-event behavior.
- [ ] Verify row counts, metric units, dates, and RLS behavior.

**Exit check:** The browser can load synthetic profiles and observations from Supabase, and the app has a deterministic local fallback.

### Phase 2 — Monitoring engine and data quality

- [ ] Add typed domain types and a Supabase repository layer.
- [ ] Implement the rolling 30-day personal baseline.
- [ ] Implement the `>3 SD` single-reading alert rule.
- [ ] Implement the `>2 SD on 3 of the last 5 days` sustained-shift rule.
- [ ] Include a plain-language reason with every alert.
- [ ] Add usual, recovery-concern, and sensor-disconnected scenarios.
- [ ] Add insufficient-baseline, stale-data, missing-data, and offline states.
- [ ] Ensure exercise-related heart-rate changes do not trigger recovery alerts by themselves.

**Exit check:** Alert decisions are deterministic, explainable, unit-tested, and independent from the UI.

### Phase 3 — Active astronaut flow

- [ ] Add profile selection and Active stage setup.
- [ ] Add simulated data controls.
- [ ] Build the Home dashboard with current signals and next action.
- [ ] Build Trends with personal baseline overlays and alert markers.
- [ ] Build the optional wellbeing check-in.
- [ ] Build next-action guidance with data limitations.
- [ ] Build the follow-up timeline.

**Exit check:** The complete active flow works from simulated data through alert explanation, check-in, action, and follow-up.

### Phase 4 — Candidate / trainee preview

- [ ] Add Future/Trainee stage content.
- [ ] Add one short metric or sensor lesson.
- [ ] Add one practice scenario with feedback.
- [ ] Store learning progress locally.
- [ ] Explicitly avoid presenting learning progress as flight clearance or certification.

**Exit check:** One trainee lesson is demonstrable without expanding into a separate game product.

### Phase 5 — Post-mission / retired preview

- [ ] Add Retired/Post-mission stage content.
- [ ] Add long-term trend preview.
- [ ] Add mood, stress, sleep, and journal check-in preview.
- [ ] Add reminder UI without medical claims.
- [ ] Add a clinician-summary preview with selectable fields only.

**Exit check:** Retired users can review trends and prepare a non-diagnostic summary without requiring historical mission data.

### Phase 6 — Radiation and public NASA context

- [ ] Add radiation dose versus personal synthetic baseline.
- [ ] Add Safe/Caution/High display with a clear explanation.
- [ ] Add optional NASA DONKI solar-event lookup.
- [ ] Cache DONKI responses and handle rate limits.
- [ ] Fall back to labeled mock events when DONKI is unavailable.
- [ ] Link NASA OSDR and NTRS references from About and Limits.

**Exit check:** NASA services enrich the demo but are never required for core monitoring or alert behavior.

### Phase 7 — Quality, privacy, and presentation

- [ ] Add responsive dark space-themed styling.
- [ ] Add LocalStorage persistence for check-ins, preferences, replay state, and seed.
- [ ] Add per-category privacy controls.
- [ ] Add unit tests for alert logic and synthetic-data generation.
- [ ] Add UI tests for stage switching, fallback states, and persistence.
- [ ] Test offline operation and refresh behavior.
- [ ] Audit all copy for diagnosis, clinical certainty, and medical-device implications.
- [ ] Run the production build and smoke-test the complete demo flow.

**Exit check:** The demo is stable, responsive, clearly synthetic, and safe to present to judges.

## 🔴 Current Backlog Summary

- **Highest priority:** Supabase project access, schema, RLS, and synthetic seed data.
- **Next:** Typed repository, baseline calculations, alert engine, and data-quality states.
- **Then:** Complete Active Astronaut flow.
- **After core demo:** Trainee and Retired previews, NASA context, styling, privacy, and tests.

## 📌 Progress Update Rules

- Keep the roadmap as the single source of truth for implementation status.
- After every completed task, update the checkbox and move the item into Currently Built when appropriate.
- Update Active Focus to the next smallest task, not an entire phase.
- Record the exact blocker when progress stops.
- Record verification performed, such as `npm run build`, unit tests, RLS checks, or a browser smoke test.
- Never mark work complete because files were created alone; verify the behavior.

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
