# Chemlab Database Migration And Seeding

This guide is for the Hostinger PHP/MySQL backend in `hostinger-backend/`.

## Files

- Migrations: `hostinger-backend/migrations/`
- Seeders: `hostinger-backend/seeders/`
- Migration runner: `hostinger-backend/src/database/migrate.php`
- Seeder runner: `hostinger-backend/src/database/seed.php`
- Readiness check: `hostinger-backend/scripts/check-backend.php`
- Smoke test: `hostinger-backend/scripts/smoke-test.php`

## Before Running

Copy the production environment template on the server:

```bash
cd hostinger-backend
cp .env.production.example .env
```

Fill:

```txt
DB_HOST
DB_NAME
DB_USER
DB_PASS
JWT_SECRET
SMTP_HOST
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM_EMAIL
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
```

Generate a strong JWT secret:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## Install Dependencies

```bash
cd hostinger-backend
composer install --no-dev
```

If Composer is not available on Hostinger, run Composer locally and upload the generated `vendor/` directory.

## Run Migrations

```bash
php src/database/migrate.php
```

The runner records applied SQL migrations in `schema_migrations`. Re-running the command is safe because already-applied migrations are skipped.

## Run Seeders

```bash
php src/database/seed.php
```

Seeders create or update:

- Class 9 Science
- Class 10 Science
- Class 11 Chemistry
- Class 12 Chemistry
- First admin user from `ADMIN_*`
- Site settings, including `site_name = Chemlab` and `ai_name = Chem-Shastri`
- Email templates
- Existing simulations as resources
- Stage 3 learning tools
- Stage 6 NCERT skeleton placeholders

## Stage 6 NCERT Skeleton

`hostinger-backend/seeders/007_stage_6_ncert_skeleton.sql` adds editable draft structure for Classes 9-12.

It intentionally creates draft placeholders, not final published syllabus content. Admins must verify the current syllabus mapping before publishing chapters or topics.

The seeder maps:

- `redox-transfer-kitchen` to Class 10 Science, Chemical Reactions and Equations, Oxidation and reduction
- `hydrocarbon-naming-quest` to Class 11 Chemistry, Hydrocarbons, IUPAC nomenclature

## Post-Run Checks

Run:

```bash
php scripts/check-backend.php
php scripts/smoke-test.php
```

Then verify in a browser:

```txt
https://api.chemlearning.in/api/health
https://api.chemlearning.in/api/public/classes
https://api.chemlearning.in/api/public/resources
```

## Admin Verification

After login as the seeded admin:

- Open `/admin/resources/structure`
- Confirm classes, subjects, books, chapters, and topics are visible
- Keep seeded NCERT skeleton rows as draft until verified
- Open `/admin/resources`
- Confirm Redox Transfer Kitchen and Hydrocarbon Naming Quest have class/topic mappings

## Rollback Notes

For production data, take a MySQL export before running new migrations or seeders.

The Stage 6 seeder uses draft rows and update statements. If you need to remove it manually, archive or delete the draft books/chapters/topics created for NCERT skeletons, then clear the `ncert_skeleton_note` site setting.
