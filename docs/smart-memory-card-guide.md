# Smart Memory Card Guide

Chemlab memory cards now use a lightweight spaced-review schedule.

## Ratings

- **Forgot**: returns quickly and increases lapse count.
- **Hard**: returns sooner and slightly lowers ease.
- **Good**: schedules a normal review interval.
- **Easy**: schedules farther out and increases ease.

## Backend Tables

`memory_card_progress` now stores:

- `ease_score`
- `interval_days`
- `review_count`
- `forgot_count`
- `hard_count`
- `lapse_count`
- `last_rating`
- `next_review_at`
- `mastered`
- `due_status`

## APIs

- `POST /api/learning/memory/review`
- `GET /api/learning/memory/due`
- `GET /api/learning/memory/decks/{deckId}/study-plan`
- `GET /api/learning/memory/progress`

## Frontend

`/memory-cards` shows:

- due cards
- weak cards
- new cards
- mastered cards

Deck review pages display the next review time when the backend returns it.

## Stage 7 Limits

This is a practical SM-2-style starter, not a full research-grade adaptive scheduler yet.
