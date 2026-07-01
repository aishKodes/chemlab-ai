# Chemlab Learning Intelligence System Guide

Stage 4 adds a lightweight learning intelligence layer without changing the core simulations.

## What Is Tracked

- Resource sessions: when a student opens and leaves a resource.
- Simulation sessions: when a lab is opened and which steps fire events.
- Mistakes: misconception keys, student answer, correct answer, and feedback shown.
- Memory reviews: card rating and next review date.
- Quick drill attempts: answer checks, score, and completion.
- Chem-Shastri questions: question text hash, mode, context, and helpfulness.
- Feedback: resource enjoyment or confusion signals.

## Public Learning Tools

- `/memory-cards` and `/memory-cards/[deckSlug]`
- `/quick-drills` and `/quick-drills/[drillSlug]`
- `/concept-maps` and `/concept-maps/[mapSlug]`

These pages call Hostinger APIs when available and use local Chemlab fallback content when the backend is offline.

## Adding A New Memory Deck

1. Create a published `memory_decks` row.
2. Add published `memory_cards` rows with `deck_id`.
3. Cards appear at `/memory-cards`.
4. Reviews are posted to `/api/learning/memory/review`.

## Adding A New Quick Drill

1. Create a published `quick_drills` row.
2. Add `quiz_questions` rows with `options_json` and `correct_answer_json`.
3. Public question fetches omit correct answers.
4. Answer validation happens through backend attempt endpoints.

## Adding A New Concept Map

1. Create a published `concept_maps` row.
2. Put map data in `map_json`:

```json
{
  "nodes": ["Idea A", "Idea B"],
  "edges": [{ "from": "Idea A", "to": "Idea B", "label": "connects to" }]
}
```

## Simulation Instrumentation

Use `useSimulationSession(slug)` for full session start/end tracking. Use `trackSimulationEventClient(slug, eventName, metadata)` for lightweight step events.

## Resource Instrumentation

Use `useResourceSession({ resourceSlug, resourceId, resourceType })` on resource-like pages. Add `ResourceFeedback` for enjoyment signals.

## Teacher Workflows

Teachers can create classrooms, share join codes, create assignments, and view early analytics. This is intentionally foundational; exports and deep classroom dashboards are future work.

## Admin Analytics

Admin analytics subpages show raw snapshots first:

- Resources
- Simulations
- Mistakes
- Chem-Shastri
- Students
- Teachers
- Rollups

Stage 5 can add filtering, charts, exports, and privacy-safe aggregates.
