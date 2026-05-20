# Chemlab

Chemlab is a colourful interactive chemistry learning universe. The MVP
combines PhET-style simulations, Duolingo-style motivation, Master Alchem AI
mentoring, boss quizzes, mistake repair, story labs, and serious chemistry tools in a
production-oriented Next.js codebase.

Master Alchem is Chemlab's signature mentor character: a warm floating alchemical
science guide who gives hints, lab guidance, safe explanations, and step-by-step
chemistry reasoning without making mistakes feel shameful.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- 3Dmol.js for molecule visualization
- lucide-react icons
- Supabase Free-ready schema and helpers
- Server-side AI API adapter with fetch-based providers
- Vercel Free deployment target

## Current Features

- Colourful homepage with Master Alchem, animated atoms, molecule motifs, XP,
  achievements, and cinematic learning sections
- Chemistry Worlds quest map with chapter worlds and dynamic chapter routes
- Story Labs route with scene-based practicals
- Site-wide Master Alchem guide with route-specific student guidance
- Master Alchem SVG/CSS character system with quarantined asset tracking
- Neutralization Studio flagship lab using clean scene backgrounds and SVG/CSS
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
npm run dev
```

Open `http://localhost:3000`.

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

Asset validation is documented in `docs/rescue-audit.md` and
`docs/asset-inventory.md`.

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
data/                Periodic table, curriculum modules, sample questions, constants
docs/                Asset inventory and implementation notes
lib/                 Supabase, AI, chemistry utilities, quiz scoring, rate limiting
public/              Future public assets plus quarantined bad assets
supabase/            SQL schema and seed data
types/               Shared TypeScript types
content/chemistry/   Future markdown/content source
```

## Roadmap

- Matrix-based automatic chemical equation balancing
- Authenticated student profiles and saved quiz attempts
- Teacher dashboard and classroom cohorts
- Admin CRUD for chapters, lessons, questions, and simulations
- Visual note editor and spaced mistake review
- Regenerate Master Alchem and lab props with true transparency
- Acid-base titration and salt-identification story labs with richer assessment
- Expanded periodic table and thermochemistry tools
- Richer simulations with drag-and-drop bonding and stoichiometry labs
