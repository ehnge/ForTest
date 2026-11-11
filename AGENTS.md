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
- **Backend foundation:** Verified schema, RLS, four synthetic travelers, 180 days of six daily metrics, three event kinds, typed repository with deterministic fallback, eight backend tests, and live parity checks. See `docs/backend-contract.md`.
- **Backend simulation contract:** Repository reads now accept optional replay/scenario controls and report `ready`, `stale-data`, `missing-data`, `offline`, or `insufficient-baseline` quality states; 9 backend tests pass.
- **Workflow definition:** The active-astronaut workflow and the three-stage product flow have been analyzed and converted into the phased roadmap below.

### 🟡 Active Focus

> **AGENT NOTE:** Do not begin final Horizon UI work until the minimal backend foundation is available, unless the user explicitly changes direction.

- **Immediate backend task:** Add the optional NASA DONKI solar-event adapter with caching, rate-limit handling, and a labeled synthetic fallback.
- **Required tables:** `sample_people`, `health_observations`, and `demo_events`.
- **Required seed:** Four synthetic travelers with 180 days of observations.
- **Security requirement:** Enable RLS on every exposed table and allow only the intended synthetic-data reads.
- **Current blocker (2026-11-11):** None for backend foundation. Authenticated management access and publishable-key reads are verified. Shared contract review and frontend integration are pending.

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

- [x] Confirm access to the configured Supabase project.
- [x] Create migrations for `sample_people`, `health_observations`, and `demo_events`.
- [x] Enable RLS on every exposed table.
- [x] Add read-only policies for public synthetic demo data.
- [x] Seed four traveler profiles.
- [x] Generate 180 days of deterministic observations per traveler.
- [x] Add the 3-day radiation spike, 5-day illness-like episode, and 5-day sleep disruption.
- [x] Add seed control and replay-event behavior to the repository contract.
- [x] Verify row counts, metric units, dates, and RLS behavior.

**Exit check:** The browser can load synthetic profiles and observations from Supabase, and the app has a deterministic local fallback.

### Phase 2 — Monitoring engine and data quality

- [x] Add typed domain types and a Supabase repository layer.
- [x] Implement the rolling 30-day personal baseline on the frontend integration branch.
- [x] Implement and test the `>3 SD` single-reading alert rule on the frontend integration branch.
- [x] Implement and test the `>2 SD on 3 of the last 5 days` sustained-shift rule on the frontend integration branch.
- [x] Include a plain-language reason with every alert on the frontend integration branch.
- [x] Add usual, recovery-concern, and sensor-disconnected scenarios across the branches.
- [x] Add insufficient-baseline, stale-data, missing-data, and offline repository states.
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

- **Highest priority:** Rolling personal baseline and explainable alert engine with domain tests.
- **Next:** Simulation/replay and data-quality states; frontend-owner review of the repository contract.
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

## 👥 Team Task Delegation

The user is Agent 1 and owns frontend work. The teammate is Agent 2 and owns backend/data work. This section is documentation only until each agent receives a specific task prompt.

### Agent 1 — Frontend and UX Owner

Owns:

- app shell and navigation;
- dark responsive design system;
- Active Home screen;
- Trends screen;
- Wellbeing screen;
- Profile and simulation controls;
- LocalStorage state;
- accessibility and UI tests.

Agent 1 must use mocked or typed placeholder data until Agent 2's contract is available, avoid changing Supabase schema or alert thresholds, keep UI components independent from direct Supabase queries, update this file after completed frontend milestones, and run `npm run build` before reporting completion.

Suggested prompt:

```text
Read AGENTS.md first. You are Agent 1, the frontend owner.

Implement only the current frontend task from the Agent 1 section:
[insert one specific frontend task]

Do not modify Supabase schema, RLS, seed data, or alert thresholds.
Use typed mock data when backend data is not ready.
Run npm run build and relevant tests.
Update AGENTS.md with completed work, remaining work, and the next frontend task.
```

### Agent 2 — Backend and Data Owner

Owns:

- Supabase migrations;
- RLS policies;
- synthetic data generation;
- seeded sample profiles and observations;
- typed repository functions;
- baseline and alert logic;
- simulation scenarios;
- NASA DONKI integration and fallback;
- backend and data tests.

Agent 2 must read the Supabase and Postgres best-practice skills before schema work, keep all data synthetic, never expose service-role credentials, define shared TypeScript types before frontend integration, document schema and query contracts, run database checks and `npm run build`, and update this file with completed work, remaining work, blockers, and the next backend task.

Suggested prompt:

```text
Read AGENTS.md first. You are Agent 2, the backend and data owner.

Implement only the current backend task from the Agent 2 section:
[insert one specific backend task]

Do not redesign the frontend.
Use synthetic data only.
Read the Supabase and Postgres best-practice instructions before database changes.
Run verification queries, tests, and npm run build.
Update AGENTS.md with completed work, remaining work, blockers, and the next backend task.
```

### Shared Contracts

- Shared types live in one agreed location and must be reviewed by both agents.
- Frontend components do not query Supabase directly.
- Backend exposes typed repository functions.
- Alert thresholds belong to backend/domain logic, not UI logic.
- Schema changes require a migration and RLS verification.
- Changes to shared types require coordination and a build check.

Initial shared types:

- `LifeStage`
- `MetricName`
- `Observation`
- `Alert`
- `SimulationScenario`
- `DataQualityState`

### Step-by-Step Integration Workflow

1. Agent 2 creates the schema, seed data, domain types, repository, and alert module.
2. Agent 2 verifies the database, tests, and build.
3. Agent 2 pushes backend work to a dedicated branch and opens a pull request.
4. Agent 1 continues UI work using the shared types or temporary mock data.
5. Agent 1 pulls or merges the backend branch after the contract is stable.
6. Agent 1 replaces mock repository calls with the typed backend repository.
7. Both agents run `npm install`, `npm run build`, unit tests, database/RLS checks, and a manual active-flow smoke test.
8. Database and data conflicts are resolved by Agent 2, layout and interaction conflicts by Agent 1, and shared-type conflicts together.
9. Both agents update this file with the integrated status.
10. Merge the verified pull request into `main`.

### Branch Ownership

- Agent 1 branch: `codex/frontend-flow`
- Agent 2 branch: `codex/backend-data`
- Optional integration branch: `codex/integration`
- `main` remains the stable branch.
- Neither agent pushes unfinished work directly to `main`.

## 📋 Team Progress Checklists

### Agent 1 — Frontend Checklist

- [ ] Build the app shell and responsive navigation.
- [ ] Add the dark, high-contrast Horizon design system.
- [ ] Build Active Home with mocked typed data.
- [ ] Build Trends with baseline and alert placeholders.
- [ ] Build Wellbeing and LocalStorage check-ins.
- [ ] Build Profile and simulation controls.
- [ ] Add Future and Retired preview states.
- [ ] Add accessibility and UI tests.
- [ ] Integrate Agent 2's repository contract.
- [ ] Verify the complete Active Astronaut flow.

### Agent 2 — Backend Checklist

- [x] Confirm access to the configured Supabase project.
- [x] Create migrations for `sample_people`, `health_observations`, and `demo_events`.
- [x] Enable RLS and verify read-only synthetic-data policies.
- [x] Seed four profiles and 180 days of observations.
- [x] Add the radiation, illness-like, and sleep-disruption events.
- [x] Add typed domain models and repository functions.
- [ ] Implement baseline and explainable alert rules.
- [x] Add simulation scenarios and deterministic replay.
- [ ] Add NASA DONKI caching and mock fallback.
- [x] Add backend/data tests and integration documentation.

### Shared Integration Checklist

- [ ] Agree on the shared TypeScript types.
- [ ] Confirm repository function names and return shapes.
- [ ] Confirm alert severity and explanation fields.
- [ ] Merge backend contract into the frontend branch.
- [ ] Replace frontend mocks with repository calls.
- [ ] Run build, unit tests, RLS checks, and active-flow smoke test.
- [ ] Review synthetic-data labels and safety copy.
- [ ] Merge the verified integration pull request into `main`.

### Current Blockers

- Backend foundation has no active access blockers. Supabase management and publishable-key reads work for `chfvsmbsgdwauqbwnamv`.
- NASA DONKI integration and combined branch verification remain pending; the frontend branch now uses repository adapters instead of direct component queries.

### Next Coordination Point

After the NASA adapter is published, both agents review the shared alert/data-quality fields and run the combined integration checklist before merging into `main`.

## 📈 Delegated Progress Rules

- Each agent updates only its owned checklist after verified work.
- Completed tasks move into Currently Built when the behavior is verified.
- Incomplete tasks stay unchecked.
- Every blocker must include the exact error or missing dependency.
- No feature implementation starts from this section alone; each agent should receive one specific task prompt.

## Backend foundation verification - 2026-11-11

- Authenticated project-scoped MCP query succeeded; public schema was empty before implementation. `.env.local` matches the project and `git check-ignore .env.local` passes. No credentials were committed.
- Applied `horizon_foundation`; remote migration version `20261111153200` matches the local SQL file. All three tables have RLS and synthetic-only SELECT policies for `anon` and `authenticated`; client write privileges are revoked. No views or privileged functions were added.
- Seeded 4 travelers, 4,320 readings, and 12 events. Every traveler has 1,080 readings across 180 days (2026-01-01 through 2026-06-29), with 6 unit-validated metrics per day. Events have inclusive durations 3/5/5 days. Re-running the deterministic seed leaves results unchanged.
- `npm run test:db` passed using only the publishable key: all cloud profiles, observations, and events exactly match local fixtures; pagination and date filters work without fallback. `supabase/verify.sql` passed: RLS flags, both client roles' read grants, absence of writes, and denied mutation probes (rolled back). Security and performance advisors returned no findings.
- `npm test` passed (8 backend tests); `npm run build` passed; `git diff --check` passed. Node tests and Vite needed permission to spawn workers/esbuild after sandbox `spawn EPERM`. CLI v3 failed to resolve its Windows binary; pinned CLI 2.81.3 generated the migration, then the filename was aligned with remote migration history. No local Docker database was available; remote and Data API checks were used.
- Shared contracts and integration notes: `src/domain/types.ts`, `src/data/repository.ts`, `docs/backend-contract.md`. No frontend files, layout, navigation, or alert thresholds changed.
- Remaining backend work: NASA DONKI caching/fallback and combined integration verification. Baseline/alert, replay, and data-quality milestones are implemented and verified across the two branches.
