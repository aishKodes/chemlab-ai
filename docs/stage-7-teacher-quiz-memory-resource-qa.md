# Stage 7 QA: Teacher Quizzes, Smart Memory, Resource Curation

Use this checklist after running migrations, seeders, and deploying the latest frontend.

## Backend

- `004_stage_7_live_quizzes_memory_resources.sql` runs without SQL ambiguity errors.
- `008_stage_7_quiz_memory_resource_content.sql` runs repeatedly without duplicating memory cards.
- Public quiz routes return JSON:
  - `GET /api/public/quizzes`
  - `GET /api/public/quizzes/{slug}`
  - `POST /api/public/quizzes/{slug}/attempt`
  - `GET /api/public/quizzes/{slug}/leaderboard`
- Teacher quiz routes require teacher/admin token.
- `/api/learning/memory/due` returns due-card summary for logged-in or anonymous users.
- `/api/learning/memory/decks/{deckId}/study-plan` returns deck summary and scheduling fields.
- Resource publishing rejects external resources missing source URL, license, or attribution.

## Frontend

- `/teacher/quizzes` loads for teacher/admin and rejects students.
- `/teacher/quizzes/create` can create a quiz shell.
- Starting a live quiz shows a 6-digit PIN and join link.
- `/join` accepts a PIN.
- `/join/{pin}` loads room information and asks for student name.
- `/quiz-room/{sessionId}` lets a guest answer all questions and finish.
- `/public-quizzes` lists backend public quizzes or safe fallback examples.
- `/public-quizzes/{slug}` can submit answers and show score.
- `/leaderboards/{quizSlug}` shows backend leaderboard or fallback practice rows.
- `/memory-cards` shows Due, Weak, New, and Mastered counts when backend is available.
- `/resources/{slug}` shows source, license, attribution, student instructions, and quality status when present.
- Chem-Shastri compact launcher still does not block `/labs/*` simulations.

## Build

- PHP lint passes for `hostinger-backend`.
- Hostinger public package is regenerated.
- Hostinger package sanity check passes.
- `npm run lint` passes or only reports documented non-critical warnings.
- `npm run build` passes without requiring a live backend.
