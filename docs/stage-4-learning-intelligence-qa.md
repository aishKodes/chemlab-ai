# Stage 4 Learning Intelligence QA

## Backend

- Run migrations through `hostinger-backend/src/database/migrate.php`.
- Confirm Stage 4 tables exist: `resource_sessions`, `simulation_sessions`, `simulation_step_events`, `mistake_events`, `memory_reviews`, `memory_card_progress`, `quiz_attempts`, `quiz_answers`, `resource_feedback`, `chem_shastri_question_logs`, `student_topic_mastery`, `daily_learning_rollups`, `teacher_classrooms`, `classroom_students`, `teacher_assignments`, `assignment_progress`.
- `GET /api/public/memory-decks` returns published decks.
- `GET /api/public/memory-decks/{slug}/cards` returns published cards.
- `GET /api/public/quick-drills` returns drills.
- `GET /api/public/quick-drills/{slug}/questions` hides correct answers from public fetch.
- `GET /api/public/concept-maps` returns concept maps.
- Resource session start/end endpoints store rows.
- Simulation session start/event/end endpoints store rows.
- Mistake endpoint stores misconception events.
- Memory review endpoint stores review and progress.
- Quick drill attempt start/answer/complete stores attempts and answers.
- Chem-Shastri question log endpoint stores question trends.
- Teacher classroom create/list/detail works for teacher/admin.
- Student classroom join works with a valid join code.
- Admin analytics summary and subpages reject non-admin tokens.
- Rollup runner works through `php hostinger-backend/scripts/run-analytics-rollups.php`.

## Frontend

- `/memory-cards` loads backend decks or local fallback decks.
- `/memory-cards/redox-leo-ger-memory` plays flip-card review.
- `/quick-drills` loads backend drills or local fallback drills.
- `/quick-drills/redox-basics-5-minute-drill` runs one-question-at-a-time practice.
- `/concept-maps` loads concept maps.
- `/concept-maps/redox-transaction-map` renders nodes and connections.
- `/resources/{slug}` starts a resource session and shows feedback.
- `/classes/{classLevel}` still renders resources with backend fallback.
- `/labs/redox-transfer-kitchen` still opens and starts a simulation session.
- `/labs/hydrocarbon-naming-quest` still opens and sends simulation events.
- Student dashboard links to memory cards, quick drills, class resources, labs, and classroom join.
- Teacher dashboard links to analytics, classrooms, and assignments.
- `/teacher/analytics`, `/teacher/classrooms`, `/teacher/classrooms/{id}`, and `/teacher/assignments` are protected.
- Admin analytics subpages render protected snapshots.
- Backend unavailable state does not crash public learning routes.

## Final Checks

- `find hostinger-backend/src hostinger-backend/scripts -name '*.php' -print0 | xargs -0 -n1 php -l`
- `npm run lint`
- `npm run build`
