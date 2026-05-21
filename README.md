# Chemlab

Chemlab is a colourful interactive chemistry learning universe. Phase 1 prepares
the product foundation: chemistry worlds, Master Alchem guidance, asset safety,
AI mock mode, gamified learning surfaces, and a reusable cinematic simulation
shell for future high-quality labs.

Master Alchem is Chemlab's signature mentor character: a warm floating alchemical
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

- Colourful homepage with Master Alchem, animated atoms, molecule motifs, XP,
  achievements, and cinematic learning sections
- Chemistry Worlds quest map with chapter worlds and dynamic chapter routes
- Story Labs route with Featured, Prototype, and Coming Soon sections
- Reusable cinematic simulation shell with story, experiment, challenge, and reward scenes
- `/labs/demo-cinematic-shell` Phase 1 shell demo
- Site-wide Master Alchem guide with route-specific student guidance
- Master Alchem SVG/CSS character system with quarantined asset tracking
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
- Master Alchem chat UI using `/api/ai`
- Quiz runner with local sample questions
- Student dashboard shell
- Admin/content/question manager foundations
- Supabase schema and seed data with RLS policies

## Setup

```bash
npm install
npm run process:assets
npm run dev
```

Open `http://localhost:3000`.

`npm run process:assets` is safe to rerun. It copies raw artwork into
`public/_source-assets/`, writes cleaned review outputs into `public/processed/`,
and refreshes `public/processed/asset-manifest.json`.

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

Master Alchem calls `POST /api/ai`. Supported providers:

- `mock`: returns a useful Master Alchem chemistry response without external calls.
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

This keeps production guardrails intact while allowing long local Master Alchem
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

1. Story intro with Master Alchem.
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
                     Master Alchem character, route scripts, provider, and guide
components/labs/     Story-lab preview, asset mapping, and Neutralization Studio
components/simulation-engine/
                     Reusable cinematic story/lab/challenge/reward shell
data/                Periodic table, curriculum modules, sample questions, constants
docs/                Asset inventory and implementation notes
lib/                 Supabase, AI, chemistry utilities, quiz scoring, rate limiting
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
   start from `components/simulation-engine/`.
3. Add a route under `app/simulations/` or `app/labs/`.
4. Put polished, student-facing copy in the page. Keep implementation details in
   docs, not in the learning surface.
5. Add Master Alchem route guidance if the lab needs a dedicated message.
6. Add the new experience to `/labs` or `/simulations` as Featured, Practice,
   Prototype, or Coming Soon.
7. Run `npm run lint` and `npm run build`.

## Roadmap

- Matrix-based automatic chemical equation balancing
- Authenticated student profiles and saved quiz attempts
- Teacher dashboard and classroom cohorts
- Admin CRUD for chapters, lessons, questions, and simulations
- Visual note editor and spaced mistake review
- Regenerate Master Alchem and lab props with true transparency
- Build Daniell Cell Studio on top of the cinematic shell
- Acid-base titration and salt-identification story labs with richer assessment
- Expanded periodic table and thermochemistry tools
- Richer simulations with drag-and-drop bonding and stoichiometry labs
