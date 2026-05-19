# ChemLab AI

ChemLab AI is a chemistry-first interactive academic platform. The MVP combines
PhET-style simulations, Duolingo-style mastery signals, ChatGPT-style tutoring,
and serious chemistry tools in a production-oriented Next.js codebase.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- lucide-react icons
- Supabase Free-ready schema and helpers
- Server-side AI API adapter with fetch-based providers
- Vercel Free deployment target

## Current Features

- Premium dark academic landing page
- Chemistry curriculum pages with dynamic chapter routes
- Atomic Builder simulation
- Periodic Table Explorer for the first 30 elements
- Equation Balance Checker simulation/tool
- Mole Concept Visualizer
- Chemical Bonding Lab prototype
- Molecular mass calculator
- Mole calculator
- AI tutor chat UI using `/api/ai`
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

AI_DAILY_LIMIT_ANONYMOUS=12
AI_DAILY_LIMIT_FREE_USER=40
```

Only `NEXT_PUBLIC_` variables are used in client-accessible code. `AI_API_KEY`
and `SUPABASE_SERVICE_ROLE_KEY` are only read from server route/helper files.

## AI Provider Setup

The AI tutor calls `POST /api/ai`. Supported providers:

- `mock`: returns a useful chemistry tutor response without external calls.
- `openai-compatible`: posts to `AI_BASE_URL/chat/completions`, or OpenAI's
  default `/v1/chat/completions` endpoint if `AI_BASE_URL` is not set.
- `gemini`: posts to Google Generative Language `generateContent`.

If `AI_API_KEY` is missing, the server automatically falls back to mock mode.

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
components/          UI, layout, chemistry, simulations, tools, AI, quiz, dashboard, admin
data/                Periodic table, curriculum modules, sample questions, constants
lib/                 Supabase, AI, chemistry utilities, quiz scoring, rate limiting
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
- Expanded periodic table and thermochemistry tools
- Richer simulations with drag-and-drop bonding and stoichiometry labs
