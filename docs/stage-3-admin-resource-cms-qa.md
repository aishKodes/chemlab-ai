# Chemlab Stage 3 Admin Resource CMS QA

Stage 3 connects the Next.js admin UI to the Hostinger PHP backend for real resource management. Use this checklist after migrations and seeders run on Hostinger.

## Backend

- [ ] Run `php src/database/migrate.php` from `hostinger-backend`.
- [ ] Confirm `002_stage_3_learning_tools.sql` appears in `schema_migrations`.
- [ ] Run `php src/database/seed.php`.
- [ ] Confirm memory decks exist for Redox and IUPAC.
- [ ] Confirm quick drills exist for Redox and IUPAC.
- [ ] Confirm concept map and mistake pattern seed rows exist.
- [ ] Confirm admin token can call `/api/admin/classes`.
- [ ] Confirm non-admin token is rejected by `/api/admin/classes`.
- [ ] Confirm `/api/public/resources/{slug}` still returns seeded simulations.
- [ ] Confirm `/api/public/classes/10` returns attached resources.

## Admin UI

- [ ] `/admin` shows the Stage 3 admin control room.
- [ ] `/admin/users` lists users and can update status.
- [ ] `/admin/users` can change a user role when needed.
- [ ] `/admin/users` can verify a teacher.
- [ ] `/admin/resources/structure` can manage classes, subjects, books, chapters, and topics.
- [ ] `/admin/resources` can create, edit, publish, and archive resources.
- [ ] Existing simulations can be attached by setting `route_url`.
- [ ] `/admin/memory-cards` can create a deck.
- [ ] `/admin/memory-cards/[deckId]` can create, edit, and delete cards.
- [ ] `/admin/quick-drills` can create a drill.
- [ ] `/admin/quick-drills/[drillId]` can create, edit, and delete questions.
- [ ] `/admin/concept-maps` can edit map JSON.
- [ ] `/admin/mistake-patterns` can manage remediation records.
- [ ] `/admin/content` can create and edit content block keys.
- [ ] `/admin/translations` can edit existing translation records.
- [ ] `/admin/media` uploads allowed images and archives assets.
- [ ] `/admin/email` sends a test email or shows a clear SMTP error.
- [ ] `/admin/email` lists template records and recent logs.
- [ ] `/admin/notifications` can send an announcement to all users or a role.
- [ ] `/admin/settings` can update site settings.
- [ ] `/admin/chem-shastri` shows related settings and AI events.
- [ ] `/admin/analytics` shows summary counts and recent learning events.

## Public Frontend

- [ ] `/resources` still lists fallback resources when backend is offline.
- [ ] `/resources/redox-transfer-kitchen` opens a detail page.
- [ ] `/resources/hydrocarbon-naming-quest` opens a detail page.
- [ ] Resource detail page links to the existing lab route when `route_url` exists.
- [ ] `/profile` can save student board and learning goal.
- [ ] `/profile` can save teacher subject and classes taught.

## Verification Commands

- [ ] `find hostinger-backend/src -name '*.php' -print -exec php -l {} \;`
- [ ] `php -l hostinger-backend/seeders/005_first_admin.php`
- [ ] `npm run lint`
- [ ] `npm run build`

Known Stage 3 limitation: the admin UI is intentionally CRUD-focused. Rich chapter editors, analytics intelligence, public memory-card players, and full learning dashboards are later stages.
