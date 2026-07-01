# Chemlab Launch Master Guide

This is the single launch checklist for deploying Chemlab with:

- Frontend: Vercel, `https://www.chemlearning.in`
- Backend: Hostinger PHP/MySQL, `https://api.chemlearning.in`
- Database: Hostinger MySQL
- Email: Hostinger SMTP

## 1. Prepare Frontend Env

In Vercel, set:

```txt
NEXT_PUBLIC_SITE_URL=https://www.chemlearning.in
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

Optional AI values:

```txt
GEMINI_API_KEY=
OPENAI_API_KEY=
CHEM_SHASTRI_ENABLED=true
CHEM_SHASTRI_DEFAULT_PROVIDER=gemini
CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED=false
CHEM_SHASTRI_DAILY_BUDGET_INR=50
DEV_UNLIMITED_AI=false
```

Use `.env.production.example` as the source template.

## 2. Create Hostinger Subdomain

Create:

```txt
api.chemlearning.in
```

Point the subdomain to the Hostinger hosting plan.

Preferred document root:

```txt
hostinger-backend/public
```

If Hostinger cannot point directly to that folder, upload the backend so only `public/` is web-accessible. Keep `.env`, `src/`, `migrations/`, `seeders/`, and `storage/` outside direct public browsing whenever possible.

## 3. Create MySQL Database

In Hostinger hPanel:

1. Create a database.
2. Create a database user.
3. Grant the user access.
4. Copy DB host, name, user, and password.

## 4. Configure Backend Env

On Hostinger:

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
SMTP_PORT
SMTP_SECURE
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM_EMAIL
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
CORS_ALLOWED_ORIGINS
```

Generate `JWT_SECRET`:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## 5. Install Backend Dependencies

```bash
cd hostinger-backend
composer install --no-dev
```

If Composer is unavailable on Hostinger, run the command locally and upload `vendor/`.

## 6. Run Backend Readiness Check

```bash
php scripts/check-backend.php
```

Fix hard failures before continuing. Warnings for SMTP are acceptable only before email setup is complete.

## 7. Run Migrations And Seeders

```bash
php src/database/migrate.php
php src/database/seed.php
```

Then:

```bash
php scripts/smoke-test.php
```

Expected seeded content:

- Class 9 Science
- Class 10 Science
- Class 11 Chemistry
- Class 12 Chemistry
- First admin user
- Email templates
- Redox Transfer Kitchen
- Hydrocarbon Naming Quest
- Draft NCERT skeleton structure

## 8. Verify Public API

Open:

```txt
https://api.chemlearning.in/api/health
https://api.chemlearning.in/api/public/classes
https://api.chemlearning.in/api/public/resources
```

Expected response format:

```json
{ "ok": true, "data": {} }
```

## 9. Verify Auth

Test:

1. Student signup
2. Teacher signup
3. Login
4. `/api/auth/me`
5. Logout
6. Forgot password
7. Email verification or graceful email failure logging

## 10. Verify Admin

1. Login as seeded admin.
2. Open `/admin`.
3. Open `/admin/resources/structure`.
4. Confirm seeded NCERT skeletons are draft.
5. Open `/admin/resources`.
6. Confirm the Redox and Hydrocarbon resources are mapped.
7. Test `/admin/email` or the backend email test route after SMTP is configured.

## 11. Verify Frontend

Open:

```txt
https://www.chemlearning.in
https://www.chemlearning.in/classes
https://www.chemlearning.in/resources
https://www.chemlearning.in/labs/redox-transfer-kitchen
https://www.chemlearning.in/labs/hydrocarbon-naming-quest
https://www.chemlearning.in/ai-tutor
```

Check:

- Public resources render.
- Login/signup links appear when logged out.
- Dashboard route redirects by role.
- Chem-Shastri is the visible mentor name.
- Chem-Shastri compact icon does not block lab controls.
- Simulations still open without backend or AI keys.

## 12. Production Safety Rules

- Do not put backend secrets in `NEXT_PUBLIC_*`.
- Do not commit `.env`.
- Keep `DEV_UNLIMITED_AI=false` in production.
- Keep paid voice generation disabled until explicitly enabled.
- Keep NCERT skeleton rows draft until verified.
- Do not publish generated assets with visible checkerboard backgrounds.

## 13. Post-Launch Monitoring

Check daily for the first week:

- Signup/login errors
- SMTP failures in `email_logs`
- Analytics event inserts
- AI budget or provider failures
- Simulation page errors
- Admin route authorization

## 14. Stage 7 Suggestions

- Full admin CMS editing workflow
- Verified NCERT chapter/topic publishing
- Better media upload moderation
- User progress storage from simulations
- Teacher classroom dashboards
- Real Chem-Shastri conversation persistence on Hostinger
