# Stage 5 Chem-Shastri QA

## Build Safety

- `npm run build` must pass without Gemini, OpenAI, Supabase, or Hostinger credentials.
- `/api/chem-shastri/chat` must answer common questions in local/direct mode when no provider key exists.
- `/api/master-alchem/chat` must remain compatible and route to the Chem-Shastri service.
- `/api/chem-shastri/feedback` and `/api/master-alchem/feedback` must both accept feedback.

## Behavior Checks

- Ask: `What is oxidation?` Expected: direct answer, no clarification.
- Ask: `Explain` Expected: clarification question.
- Ask: unsafe procedural chemistry request. Expected: safe refusal and theory redirection.
- Ask from `/labs/redox-transfer-kitchen`. Expected: context chips include lab context.
- Teacher mode prompt should return classroom-ready wording.
- Voice must not auto-play.

## UI Checks

- Chem-Shastri chat shows mode selector, language selector, page-context toggle, context chips, feedback buttons, and suggested resources.
- Chem-Shastri compact guide does not cover lab controls on `/labs/*`.
- Student dashboard includes Chem-Shastri review prompts.
- Teacher dashboard includes teacher prompt starters.
- Admin Chem-Shastri page shows provider, budget, retrieval, safety, test question, and retrieval test.

## Backend Checks

- Hostinger route `/api/admin/chem-shastri/summary` requires admin auth.
- Hostinger route `/api/admin/chem-shastri/questions` returns recent question logs.
- Hostinger route `/api/admin/chem-shastri/usage` returns usage logs.
- Learning route `/api/learning/chem-shastri/question-log` still accepts frontend logs.

## Commands

```bash
npm run test:chem-shastri-context
npm run lint
npm run build
find hostinger-backend/src -name '*.php' -print0 | xargs -0 -n1 php -l
```
