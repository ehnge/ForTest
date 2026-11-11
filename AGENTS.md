# Horizon Agent Guide

Horizon is a research demo health companion for space travelers. It uses synthetic data only and is not a medical device.

## 🗺️ Project Status & Context Trackers

### 🟢 Currently Built

- **Frontend foundation:** React + Vite + TypeScript scaffold is created.
- **Supabase dependency:** `@supabase/supabase-js` is installed.
- **Supabase client:** Browser client exists in `src/lib/supabase.ts`.
- **Environment setup:** `.env.example` is committed and `.env.local` is ignored.
- **Supabase boundary:** `src/lib/supabase.ts` keeps the browser client available; UI components use repository adapters and retain a deterministic local fallback when cloud configuration is unavailable.
- **Safety disclaimer:** The placeholder page displays: `Simulated data. Not medical advice. Not diagnostic.`
- **Build verification:** `npm run build` passes.
- **Git:** Initial local commit exists and `origin` points to the HEXARA GitHub repository.
- **Agent guidance:** Supabase, Postgres best practices, and security best practices are installed.
- **Workflow definition:** The active-astronaut workflow and the three-stage product flow have been analyzed and converted into the phased roadmap below.
- **Frontend shell:** Responsive navigation, stage selection, dark visual foundation, and the persistent disclaimer are wired into the app.
- **Frontend mock flow:** Active Home, Trends, Wellbeing, Guidance, and Profile views are connected to typed mock data and LocalStorage state.
- **Frontend data-quality states:** Stale, disconnected, and offline simulation scenarios have distinct Home/Trends messaging and next-step guidance.
- **Stage-aware previews:** Home copy now changes for Future, Active, and Retired stages while the Active flow remains primary.
- **Frontend loading boundary:** Scenario changes show an accessible loading state before the selected simulated signals render.
- **Frontend repository boundary:** UI state reads typed profiles and snapshots through repository adapters; components do not query Supabase directly.
- **Wellbeing support action:** The “Talk to a person” panel opens local crew, mission-support, and family-contact options without sending data.
- **Accessible stage shell:** Workspace labels follow the selected stage, and mobile navigation exposes the active page through `aria-current`.
- **Trend alert explanations:** Trends exposes an expandable plain-language reason for the active mock alert.
- **Simulation replay controls:** Profile persists a local seed and replay count, with an accessible replay action for the mock run.
- **Simulation contract:** `DashboardRepository` accepts typed seed and replay controls so a backend adapter can reproduce the same UI contract.
- **Backend contract import:** Agent 1's verified `src/domain/types.ts`, `src/data/repository.ts`, `src/data/synthetic.ts`, and `docs/backend-contract.md` are now present on the frontend branch for adapter integration.
- **Backend-to-dashboard adapter:** `src/lib/backendDashboardRepository.ts` maps backend records into UI metrics/profiles and preserves repository source/warning metadata; alert decisions remain outside the adapter.
- **Active-flow verification:** A cohesive UI test covers Active Home, recovery alert explanation, Trends, and a local wellbeing check-in.
- **Disconnected fallback verification:** The UI test suite verifies the “Data unavailable” label and reason when the simulated source disconnects.
- **Privacy persistence verification:** The UI test suite verifies that a per-category wellbeing privacy toggle persists locally.
- **Offline fallback verification:** The UI test suite verifies that offline Trends show a recovery path instead of stale charts.
- **Frontend verification:** Browser smoke checks confirmed stage switching and Trends navigation; 16 tests, `npm run build`, and `git diff --check` pass after repository integration and alert-engine coverage.
- **Backend adapter wiring:** The usual-day app flow now loads profiles and observations through the typed `HorizonRepository`; explicit demo scenarios remain local fixtures, and Home shows the data source and fallback warning.
- **Explainable alert engine:** `src/domain/alertEngine.ts` now evaluates personal 30-day baselines, single-reading and sustained-shift rules, emits plain-language reasons, and ignores exercise heart-rate readings; 16 tests pass.
- **NASA radiation context:** `src/lib/nasaDonki.ts` fetches optional DONKI CME events with browser caching and a labeled mock fallback; Home displays a non-diagnostic Safe/Caution/High radiation context card.

### 🟡 Active Focus

> **AGENT NOTE:** The user explicitly authorized frontend work with typed mock data while the backend contract is pending. Do not connect live Supabase data until Agent 1 publishes the shared repository contract.

- **Immediate task:** Integrate Agent 1's replay/data-quality contract into the frontend adapter, then run combined cloud/RLS and active-flow smoke verification.
- **Required tables:** `sample_people`, `health_observations`, and `demo_events`.
- **Required seed:** Four synthetic travelers with 180 days of observations.
- **Security requirement:** Enable RLS on every exposed table and allow only the intended synthetic-data reads.
- **Current blocker:** The backend replay/data-quality contract is now published on `codex/backend-data`, but it still needs to be reviewed and imported into this frontend branch; cloud smoke coverage requires a configured `.env.local`.

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
- [x] Add seed control and replay-event behavior in the frontend simulation controls; backend replay contract remains pending.
- [x] Verify row counts, metric units, dates, and RLS behavior.

**Exit check:** The browser can load synthetic profiles and observations from Supabase, and the app has a deterministic local fallback.

### Phase 2 — Monitoring engine and data quality

- [x] Add typed domain types and a Supabase repository layer.
- [x] Implement the rolling 30-day personal baseline in the frontend domain adapter.
- [x] Implement the `>3 SD` single-reading alert rule with tests.
- [x] Implement the `>2 SD on 3 of the last 5 days` sustained-shift rule with tests.
- [x] Include a plain-language reason with every generated alert.
- [x] Add usual, recovery-concern, and sensor-disconnected scenarios in the frontend flow.
- [x] Add stale-data and offline UI states; backend insufficient-baseline and missing-data contracts remain pending.
- [x] Ensure exercise-related heart-rate changes do not trigger recovery alerts by themselves.

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

- [x] Add radiation dose versus personal synthetic baseline.
- [x] Add Safe/Caution/High display with a clear explanation.
- [x] Add optional NASA DONKI solar-event lookup.
- [x] Cache DONKI responses and handle rate limits.
- [x] Fall back to labeled mock events when DONKI is unavailable.
- [ ] Link NASA OSDR and NTRS references from About and Limits.

**Exit check:** NASA services enrich the demo but are never required for core monitoring or alert behavior.

### Phase 7 — Quality, privacy, and presentation

- [x] Add responsive dark space-themed styling.
- [x] Add LocalStorage persistence for check-ins, preferences, replay state, and seed.
- [x] Add per-category privacy controls.
- [x] Add unit tests for alert logic; backend synthetic-data tests are on Agent 1's branch.
- [x] Add UI tests for stage switching, fallback states, and persistence.
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

## 👥 Team Task Delegation

Device Agent 2 owns frontend and UX work. Device Agent 1 owns backend and data work. This section is documentation only until each agent receives a specific task prompt.

### Agent 2 — Frontend and UX Owner

Owns:

- app shell and navigation;
- dark responsive design system;
- Active Home screen;
- Trends screen;
- Wellbeing screen;
- Profile and simulation controls;
- LocalStorage state;
- accessibility and UI tests.

Agent 2 must use mocked or typed placeholder data until Agent 1's contract is available, avoid changing Supabase schema or alert thresholds, keep UI components independent from direct Supabase queries, update this file after completed frontend milestones, and run `npm run build` before reporting completion.

Suggested prompt:

```text
Read AGENTS.md first. You are Device Agent 2, the frontend owner.

Implement only the current frontend task from the Agent 2 section:
[insert one specific frontend task]

Do not modify Supabase schema, RLS, seed data, or alert thresholds.
Use typed mock data when backend data is not ready.
Run npm run build and relevant tests.
Update AGENTS.md with completed work, remaining work, and the next frontend task.
```

### Agent 1 — Backend and Data Owner

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

Agent 1 must read the Supabase and Postgres best-practice skills before schema work, keep all data synthetic, never expose service-role credentials, define shared TypeScript types before frontend integration, document schema and query contracts, run database checks and `npm run build`, and update this file with completed work, remaining work, blockers, and the next backend task.

Suggested prompt:

```text
Read AGENTS.md first. You are Device Agent 1, the backend and data owner.

Implement only the current backend task from the Agent 1 section:
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

1. Agent 1 creates the schema, seed data, domain types, repository, and alert module.
2. Agent 1 verifies the database, tests, and build.
3. Agent 1 pushes backend work to a dedicated branch and opens a pull request.
4. Agent 2 continues UI work using the shared types or temporary mock data.
5. Agent 2 pulls or merges the backend branch after the contract is stable.
6. Agent 2 replaces mock repository calls with the typed backend repository.
7. Both agents run `npm install`, `npm run build`, unit tests, database/RLS checks, and a manual active-flow smoke test.
8. Database and data conflicts are resolved by Agent 1, layout and interaction conflicts by Agent 2, and shared-type conflicts together.
9. Both agents update this file with the integrated status.
10. Merge the verified pull request into `main`.

### Branch Ownership

- Agent 1 branch: `codex/backend-data`
- Agent 2 branch: `codex/frontend-flow`
- Optional integration branch: `codex/integration`
- `main` remains the stable branch.
- Neither agent pushes unfinished work directly to `main`.

## 📋 Team Progress Checklists

### Agent 2 — Frontend Checklist

- [x] Build the app shell and responsive navigation.
- [x] Add the dark, high-contrast Horizon design system.
- [x] Build Active Home with mocked typed data.
- [x] Build Trends with baseline and alert placeholders.
- [x] Build Wellbeing and LocalStorage check-ins.
- [x] Build Profile and simulation controls.
- [x] Add Future and Retired preview states.
- [x] Add initial accessibility and UI smoke tests.
- [x] Add stale, disconnected, and offline frontend state messaging.
- [x] Add UI coverage for recovery alerts, stale-data messaging, navigation, and LocalStorage check-ins.
- [x] Add accessible loading feedback for simulated scenario changes.
- [x] Isolate UI data access behind a typed mock repository adapter.
- [x] Make the local “Talk to a person” support action functional.
- [x] Make shell labels and mobile active navigation stage-aware and accessible.
- [x] Add an expandable plain-language explanation for trend alert markers.
- [x] Add LocalStorage-backed simulation seed and replay controls.
- [x] Pass typed seed and replay controls through the frontend repository boundary.
- [x] Import Agent 1's verified shared domain and repository contract files.
- [x] Add the typed backend-to-dashboard mapping adapter and source/warning preservation.
- [x] Verify the complete mock Active Astronaut flow from alert to local check-in.
- [x] Verify the disconnected-source fallback and “Data unavailable” copy.
- [x] Verify wellbeing privacy choices persist in LocalStorage.
- [x] Verify offline Trends fallback and recovery guidance.
- [x] Integrate Agent 1's repository contract for the usual-day flow, with deterministic local fallback.
- [ ] Import Agent 1's replay/data-quality contract and map its quality warnings into the UI.

### Agent 1 — Backend Checklist

- [x] Confirm access to the configured Supabase project.
- [x] Create migrations for `sample_people`, `health_observations`, and `demo_events`.
- [x] Enable RLS and verify read-only synthetic-data policies.
- [x] Seed four profiles and 180 days of observations.
- [x] Add the radiation, illness-like, and sleep-disruption events.
- [x] Add typed domain models and repository functions.
- [x] Implement baseline and explainable alert rules.
- [ ] Add simulation scenarios and deterministic replay.
- [ ] Add NASA DONKI caching and mock fallback.
- [x] Add backend/data tests and integration documentation.

### Shared Integration Checklist

- [x] Agree on the shared TypeScript types.
- [x] Confirm repository function names and return shapes.
- [x] Confirm alert severity and explanation fields for the current frontend adapter.
- [x] Import the verified backend contract into the frontend branch.
- [x] Replace the usual-day frontend mock with repository calls and retain local fallback.
- [ ] Run the combined build, unit tests, RLS checks, and active-flow smoke test after branch integration.
- [x] Review synthetic-data labels and safety copy for the frontend flow.
- [ ] Merge the verified integration pull request into `main`.

### Current Blockers

- Agent 1's replay/data-quality contract is published on `codex/backend-data` but not yet imported into this frontend branch; the frontend preserves local scenario fixtures until review.
- Live cloud smoke testing still needs a verified `.env.local` at runtime; deterministic local fallback is verified without it.

### Next Coordination Point

NASA context is implemented and verified on the frontend branch. Next coordination point: import backend commit `9294452`, map its quality metadata, then run the integration checklist before merging into `main`.

## 📈 Delegated Progress Rules

- Each agent updates only its owned checklist after verified work.
- Completed tasks move into Currently Built when the behavior is verified.
- Incomplete tasks stay unchecked.
- Every blocker must include the exact error or missing dependency.
- No feature implementation starts from this section alone; each agent should receive one specific task prompt.
