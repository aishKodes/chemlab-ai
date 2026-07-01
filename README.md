# Chemlab

Chemlab is a colourful interactive chemistry learning universe. Phase 1 prepares
the product foundation: chemistry worlds, Chem-Shastri guidance, asset safety,
AI mock mode, gamified learning surfaces, and a reusable cinematic simulation
shell for future high-quality labs.

Phase 3 adds the reusable lab engine foundation used to keep future labs
single-screen, guided, and game-like instead of turning into disconnected pages.

Chem-Shastri is Chemlab's signature mentor character: a warm floating alchemical
science guide who gives hints, lab guidance, safe explanations, and step-by-step
chemistry reasoning without making mistakes feel shameful.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- PixiJS for the reusable animated lab-stage shell
- 3Dmol.js for molecule visualization
- lucide-react icons
- Supabase Free-ready schema and helpers
- Server-side AI API adapter with fetch-based providers
- Vercel Free deployment target

## Current Features

- Colourful homepage with Chem-Shastri, animated atoms, molecule motifs, XP,
  achievements, and cinematic learning sections
- Chemistry Worlds quest map with chapter worlds and dynamic chapter routes
- Story Labs route with Featured, Prototype, and Coming Soon sections
- Hydrocarbon Naming Quest for IUPAC naming through an animated classroom story
  and carbon-family puzzle game
- Daniell Cell Studio flagship lab for Class 12 electrochemistry
- Lab Engine components for single-screen guided experiments
- Lab catalog for Featured, Prototype, and Coming Soon experiences
- Local lab-progress utilities for started/completed labs and badges
- Reusable cinematic simulation shell with story, experiment, challenge, and reward scenes
- `/labs/demo-cinematic-shell` Phase 1 shell demo
- Site-wide Chem-Shastri guide with route-specific student guidance
- Chem-Shastri SVG/CSS character system with quarantined asset tracking
- Neutralization Studio guided lab prototype using clean scene backgrounds and SVG/CSS
  lab glassware
- Real Molecule Explorer using 3Dmol.js with embedded molecule models
- Gamification UI for XP, levels, daily quests, boss battles, and mistake repair
- Colourful Atomic Builder simulation
- Periodic Table Explorer for the first 30 elements with category styling
- Equation Balance Checker simulation/tool styled as a reaction puzzle
- Mole Concept Visualizer with particle-cloud learning flow
- Chemical Bonding Lab playground prototype
- Molecular mass calculator
- Mole calculator
- Chem-Shastri chat UI using `/api/chem-shastri/chat` with `/api/master-alchem/chat`
  compatibility
- Quiz runner with local sample questions
- Teacher live quiz rooms with 6-digit PIN join links
- Public quiz battles and leaderboards
- Smart memory card scheduling with due/weak/mastered summaries
- Resource curation fields for source URL, license, attribution, review status,
  student instructions, and usefulness notes
- Student dashboard shell
- Admin/content/question manager foundations
- Supabase schema and seed data with RLS policies

## Phase 2 Flagship Lab

`/labs/daniell-cell-studio` is the first full Chemlab flagship simulation. It
uses a client-only PixiJS stage for the animated lab bench and React/Framer
Motion overlays for the HUD, Chem-Shastri dialogue, step controls, challenge
questions, and reward state.

The lab teaches:

- Daniell cell / galvanic cell setup
- zinc anode and copper cathode
- oxidation and reduction half-reactions
- electron flow through the external wire
- ion movement through the salt bridge
- approximate 1.10 V cell voltage
- overall reaction and cell notation

The core files live in:

```text
app/labs/daniell-cell-studio/page.tsx
components/labs/daniell-cell/
```

## Phase 3 Lab Engine

The reusable lab engine lives in `components/lab-engine/`:

```text
LabShell.tsx
CinematicIntro.tsx
LabStage.tsx
LabHUD.tsx
StepActionBar.tsx
MasterAlchemLabGuide.tsx
ChallengePanel.tsx
RewardScene.tsx
EquationOverlay.tsx
ParticleLayer.tsx
labTypes.ts
labStateMachine.ts
```

`LabShell` is the main layout primitive for future high-quality labs. It keeps
the top HUD, central stage, Chem-Shastri lab guide, challenge/reward panels,
and bottom action bar in predictable safe zones so controls remain visible.

Daniell Cell Studio now uses this shell for the experiment phase while keeping
its PixiJS animated cell scene.

## Hydrocarbon Naming Quest

`/labs/hydrocarbon-naming-quest` teaches early IUPAC naming through a cinematic
classroom story with Kabir and Aparna ma'am, followed by three game levels:

- Butane: trace four carbons, choose `But`, choose `-ane`, and connect the name
  to a blue LPG flame cutaway.
- 2-Methylpentane: trace the five-carbon main chain, avoid the branch trap,
  number from the correct side, and assemble `2-Methylpentane`.
- But-1-ene: treat the double bond as the VIP guest, give it position 1, and
  assemble `But-1-ene`.

The molecule atoms, bonds, numbering badges, name blocks, slot puzzle, glows,
and reward particles are drawn in code. Character and background artwork is
loaded from processed assets, not raw uploads.

Hydrocarbon Quest files:

```text
app/labs/hydrocarbon-naming-quest/page.tsx
app/dev/hydrocarbon-assets/page.tsx
components/labs/hydrocarbon-quest/
scripts/prepare-hydrocarbon-assets.mjs
```

## Lab Catalog

Labs are listed in `data/labs/labCatalog.ts`. Each entry contains:

- slug and route
- title and student-facing description
- class level and topic
- status: `featured`, `prototype`, or `comingSoon`
- XP, difficulty, estimated time, concepts, and thumbnail type

The `/labs` and `/simulations` pages use this catalog so future labs can be
added one by one without rewriting page layouts.

## Local Lab Progress

`lib/progress/labProgress.ts` stores lightweight local progress in
`localStorage`:

- `markLabStarted(labSlug)`
- `markLabCompleted(labSlug, xp)`
- `getLocalLabProgress()`
- `awardLocalBadge(badgeId)`

This is intentionally client-only and can later sync to Supabase.

## Stage 5 Chem-Shastri Intelligence

Stage 5 makes Chem-Shastri context-aware without making provider keys required
for local development. The new service layer lives in `lib/chem-shastri/` and
adds:

- direct answers for common chemistry doubts before paid AI routing
- page/class/role/language context chips
- Chem-Shastri resource suggestions from Hostinger public resources with local
  fallbacks
- strict chemistry safety handling
- Gemini-first routing through the existing AI router
- OpenAI fallback only when explicitly enabled
- manual-only voice controls
- admin status and retrieval test routes

Useful commands:

```bash
npm run test:chem-shastri-context
npm run lint
npm run build
```

## Stage 7 Teacher Quizzes, Memory, And Resources

Stage 7 connects classroom-ready quiz and review foundations:

- `/teacher/quizzes` lets teacher/admin users create quiz rooms.
- `/teacher/quizzes/[quizId]` starts a live room and generates a 6-digit PIN.
- `/join` and `/join/[pin]` let students join as guests.
- `/quiz-room/[sessionId]` plays the live quiz one question at a time.
- `/public-quizzes` and `/leaderboards` expose public practice battles.
- `/memory-cards` shows due, weak, new, and mastered memory-card counts.
- `/admin/resources` includes source, license, attribution, quality, and
  student guidance fields.

Backend additions are in:

```text
hostinger-backend/migrations/004_stage_7_live_quizzes_memory_resources.sql
hostinger-backend/seeders/008_stage_7_quiz_memory_resource_content.sql
hostinger-backend/src/controllers/LiveQuizController.php
```

Guides:

```text
docs/teacher-live-quiz-guide.md
docs/smart-memory-card-guide.md
docs/resource-curation-and-license-guide.md
docs/stage-7-teacher-quiz-memory-resource-qa.md
```

## Stage 8 Content Factory And Class 11 Unit 1

Stage 8 adds a scalable content production pattern for chapter packs:

```text
Content Factory -> generate/curate chapter pack -> admin review -> publish
```

The first pack is Class 11 Chemistry Unit 1, `Some Basic Concepts of Chemistry`.
It lives in:

```text
lib/content-factory/
data/content-packs/class-11/some-basic-concepts-of-chemistry.ts
app/admin/content-factory/page.tsx
app/roadmap/chemistry/page.tsx
app/admin/roadmap/page.tsx
```

The new flagship Unit 1 lab is:

```text
app/labs/basic-concepts-chemistry-universe/page.tsx
components/labs/basic-concepts-universe/
```

Playable zones:

- Matter World
- Measurement Lab
- Mole Portal
- Stoichiometry Factory

Preview zones:

- Chemical Laws Court
- Formula Detective

Hostinger seeding is handled by:

```text
hostinger-backend/seeders/008_stage_8_class_11_unit_1_content.php
```

It upserts the Class 11 Unit 1 chapter, topics, resources, memory decks/cards,
quick drills/questions, concept map, mistake patterns, and teacher quiz packs
with `quality_status = needs_review`.

## Molecule Explorer

The Molecule Explorer lives at `/simulations/molecule-explorer` and uses 3Dmol.js
with embedded molecule data in:

```text
components/simulations/molecule-explorer/
```

It includes water, methane, carbon dioxide, ammonia, and a sodium chloride ionic
lattice concept model. Students can rotate/zoom, compare molecular geometry,
read bond-angle notes, and complete a short shape challenge.

## Setup

```bash
npm install
npm run process:assets
npm run prepare:hydrocarbon-assets
npm run dev
```

Open `http://localhost:3000`.

`npm run process:assets` is safe to rerun. It copies raw artwork into
`public/_source-assets/`, writes cleaned review outputs into `public/processed/`,
and refreshes `public/processed/asset-manifest.json`.

`npm run prepare:hydrocarbon-assets` prepares the Hydrocarbon Naming Quest
artwork. It scans both `public/assets/hydrocarbon-quest/raw/` and
`assets/hydrocarbon-quest/raw/`, writes safe runtime outputs into
`public/assets/hydrocarbon-quest/web/`, writes processed review outputs into
`public/assets/hydrocarbon-quest/processed/`, and generates:

```text
public/assets/hydrocarbon-quest/asset-manifest.json
components/labs/hydrocarbon-quest/hydrocarbonAssetManifest.ts
```

Use `/dev/hydrocarbon-assets` to preview each Hydrocarbon Quest asset on white,
dark, blue, and gradient backgrounds before using it in the live quest.

## Environment Variables

Create `.env.local` as needed:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_PROVIDER=mock
AI_API_KEY=
AI_MODEL=
AI_BASE_URL=

DEV_UNLIMITED_AI=true
NEXT_PUBLIC_DEV_MODE=true

AI_DAILY_LIMIT_ANONYMOUS=12
AI_DAILY_LIMIT_FREE_USER=40
```

Only `NEXT_PUBLIC_` variables are used in client-accessible code. `AI_API_KEY`
and `SUPABASE_SERVICE_ROLE_KEY` are only read from server route/helper files.

## AI Provider Setup

Chem-Shastri calls `POST /api/ai`. Supported providers:

- `mock`: returns a useful Chem-Shastri chemistry response without external calls.
- `openai-compatible`: posts to `AI_BASE_URL/chat/completions`, or OpenAI's
  default `/v1/chat/completions` endpoint if `AI_BASE_URL` is not set.
- `gemini`: posts to Google Generative Language `generateContent`.

If `AI_API_KEY` is missing, the server automatically falls back to mock mode.

## Development AI Mode

Production daily caps remain in place through `AI_DAILY_LIMIT_ANONYMOUS` and
`AI_DAILY_LIMIT_FREE_USER`. For local testing, Chemlab bypasses mentor limits
when any of these are true:

- `DEV_UNLIMITED_AI=true`
- `NEXT_PUBLIC_DEV_MODE=true`
- the app is running in development mode
- the request host is localhost

This keeps production guardrails intact while allowing long local Chem-Shastri
conversations during development.

## Character and Asset Strategy

Asset validation is documented in `docs/phase-1-audit.md`,
`docs/chemlab-implementation-audit.md`,
`docs/rescue-audit.md`, and `docs/asset-inventory.md`.

Only clean full-scene backgrounds are used at runtime:

```text
assets/chemlab-classroom.png
assets/chemlab-magical-lab-background.png
assets/chemlab-virtual-lab-bench.png
```

Object cutouts with baked checkerboard-looking backgrounds were moved to:

```text
public/_quarantine/bad-assets/
```

The app does not reference quarantined assets in student-facing UI. Master
Alchem and lab props are currently rendered as clean SVG/CSS visuals until
transparent replacement artwork is available. Use `/dev/assets` to inspect the
asset status grid.

### Asset Processing

The local processor uses the free/open-source `sharp` library:

```bash
npm run process:assets
```

It scans:

```text
assets/
public/brand/
public/assets/
public/scenes/
public/labs/
public/characters/
public/_quarantine/bad-assets/
```

The script never overwrites source files destructively. It copies source files to
`public/_source-assets/`, detects checkerboard-risk cutouts, attempts a transparent
cleanup into `public/processed/`, and records the result in
`public/processed/asset-manifest.json`.

Important runtime rule: processed cutouts are review material, not automatic hero
art. Only use a processed character or lab prop after checking it on `/dev/assets`
against white, dark, and coloured backgrounds.

## Simulation Engine Direction

Phase 1 adds a reusable shell in `components/simulation-engine/`:

```text
CinematicLessonShell.tsx
CinematicScene.tsx
DialogPanel.tsx
GameHUD.tsx
StepControls.tsx
LabStage.tsx
simulationTypes.ts
```

The shell supports the intended Chemlab lab rhythm:

1. Story intro with Chem-Shastri.
2. Experiment scene with an animated lab stage.
3. Challenge scene with safe feedback.
4. Reward scene with XP, stars, and badge.

`LabStage.tsx` uses PixiJS in a client-only component so future labs can grow
toward richer 2D/2.5D scenes without exposing implementation details to
students. The demo route is intentionally not a finished chemistry lab.

Reserved public asset folders for future CDN/static serving:

```text
public/brand/
public/characters/master-alchem/
public/scenes/
public/labs/
public/icons/
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed.sql`.
4. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and Vercel.

The app works without Supabase keys by using local data and mock dashboard
records. Server helpers return `null` when Supabase env vars are absent.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the environment variables in Vercel project settings.
4. Deploy on the free plan.

No paid infrastructure is required except user-provided AI API usage.

## Stage 2 Hostinger Backend Connection

The frontend can connect to the Stage 1 Hostinger PHP/MySQL API while keeping
all public simulations available on Vercel.

Required frontend env values:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

Local development can point `NEXT_PUBLIC_BACKEND_URL` to a local backend URL
such as `http://localhost:8000`. If the backend URL is absent or unreachable,
login/signup show readable errors and public class/resource pages use local
fallback data for Redox Transfer Kitchen and Hydrocarbon Naming Quest.

Stage 2 adds:

- Backend API helpers in `lib/api/`
- Local token auth provider and role guards in `components/auth/`
- Student, teacher, and admin dashboard shells
- Public `/classes` and `/resources` pages
- Notification UI foundation
- Chem-Shastri user-facing mentor naming with compact lab-route launcher

See `docs/frontend-backend-integration.md` and
`docs/stage-2-frontend-auth-qa.md` for setup and QA.

## Development Commands

```bash
npm run dev
npm run process:assets
npm run lint
npm run build
```

## Project Structure

```text
app/                 App Router pages and route handlers
assets/             Clean generated scene backgrounds used at runtime
components/          UI, layout, chemistry, simulations, tools, AI, quiz, dashboard, admin
components/master-alchem/
                     Chem-Shastri character, route scripts, provider, and guide
components/labs/     Story labs, Daniell Cell Studio, asset mapping, and prototypes
components/lab-engine/
                     Reusable LabShell, HUD, action bar, guide, challenge, reward
components/simulation-engine/
                     Reusable cinematic story/lab/challenge/reward shell
data/                Periodic table, curriculum modules, sample questions, constants
data/labs/           Lab catalog for featured, prototype, and future labs
docs/                Asset inventory and implementation notes
lib/                 Supabase, AI, chemistry utilities, quiz scoring, rate limiting
lib/progress/        Client-side lab progress helpers
public/              Future public assets plus quarantined bad assets
public/_source-assets/
                     Non-destructive copies of discovered artwork
public/processed/    Processed asset previews and asset-manifest.json
supabase/            SQL schema and seed data
types/               Shared TypeScript types
content/chemistry/   Future markdown/content source
```

## Adding a New Simulation

1. Add shared chemistry logic in `lib/chemistry/` when the rule can be reused.
2. Build the interactive experience as a focused component in
   `components/simulations/` or `components/labs/`. For story-driven labs,
   start from `components/lab-engine/LabShell.tsx`.
3. Add a route under `app/simulations/` or `app/labs/`.
4. Put polished, student-facing copy in the page. Keep implementation details in
   docs, not in the learning surface.
5. Add a `data/labs/labCatalog.ts` entry when it belongs in the lab catalog.
6. Add Chem-Shastri route guidance if the lab needs a dedicated message.
7. Add the new experience to `/labs` or `/simulations` as Featured, Practice,
   Prototype, or Coming Soon.
8. Run `npm run lint` and `npm run build`.

## Roadmap

- Matrix-based automatic chemical equation balancing
- Authenticated student profiles and saved quiz attempts
- Teacher dashboard and classroom cohorts
- Admin CRUD for chapters, lessons, questions, and simulations
- Visual note editor and spaced mistake review
- Regenerate Chem-Shastri and lab props with true transparency
- Deepen Daniell Cell Studio with drag positioning, richer ion choices, and optional sound
- Add the next LabShell-based flagship practical: Titration Studio or Electrolysis Studio
- Acid-base titration and salt-identification story labs with richer assessment
- Expanded periodic table and thermochemistry tools
- Richer simulations with drag-and-drop bonding and stoichiometry labs
