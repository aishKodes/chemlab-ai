# Chemlab Database Install And Seeding

Chemlab now supports the simple Hostinger `public_html` workflow.

## Primary Files

After running:

```bash
php scripts/build-hostinger-publichtml-package.php
```

the package contains:

- `database/schema.sql`
- `database/seed.sql`
- `install.php`
- `config.example.php`

## Browser Installer Flow

1. Upload `dist/chemlab-hostinger-publichtml/` contents into `api.chemlearning.in/public_html/`.
2. Rename `config.example.php` to `config.php`.
3. Fill database, mail, admin, and JWT values.
4. Open:

```txt
https://api.chemlearning.in/install.php
```

5. Click `Check requirements`.
6. Click `Run full install`.

The full installer:

- checks PHP and PDO MySQL
- checks `config.php`
- checks database connection
- runs `database/schema.sql`
- runs `database/seed.sql`
- creates or updates the first admin with `password_hash()`
- creates `storage/install.lock`

## Manual phpMyAdmin Flow

If you want to use phpMyAdmin:

1. Import `database/schema.sql`
2. Import `database/seed.sql`
3. Open:

```txt
https://api.chemlearning.in/install.php?action=create-admin
```

Admin creation stays in PHP because the password must be hashed safely.

## What schema.sql Contains

`schema.sql` combines:

- Stage 1 base tables
- Stage 3 learning tools
- Stage 4 learning intelligence

It is generated from:

- `hostinger-backend/migrations/001_create_stage_1_tables.sql`
- `hostinger-backend/migrations/002_stage_3_learning_tools.sql`
- `hostinger-backend/migrations/003_stage_4_learning_intelligence.sql`

## What seed.sql Contains

`seed.sql` combines SQL seeders only. The PHP admin seeder is intentionally excluded.

It creates or updates:

- Class 9 Science
- Class 10 Science
- Class 11 Chemistry
- Class 12 Chemistry
- Site settings, including `site_name = Chemlab` and `ai_name = Chem-Shastri`
- Email templates
- Existing simulations as resources
- Stage 3 learning tools
- Stage 6 NCERT skeleton placeholders

## Stage 6 NCERT Skeleton

The NCERT skeleton is a draft scaffold, not final published textbook content.

Mapped resources:

- `redox-transfer-kitchen` -> Class 10 Science, Chemical Reactions and Equations, Oxidation and reduction
- `hydrocarbon-naming-quest` -> Class 11 Chemistry, Hydrocarbons, IUPAC nomenclature

Admins should verify the syllabus mapping in `/admin/resources/structure` before publishing.

## Legacy CLI Flow

For advanced environments, the existing migration/seeder runners still exist:

```bash
cd hostinger-backend
php src/database/migrate.php
php src/database/seed.php
```

For the user's normal Hostinger workflow, prefer `install.php`.
