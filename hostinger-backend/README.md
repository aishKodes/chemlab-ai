# Chemlab Hostinger Backend

Stage 1 PHP + MySQL backend for Chemlab on `api.chemlearning.in`.

The Next.js frontend remains on Vercel at `chemlearning.in`. This backend stores users, roles, resources, settings, email logs, notifications, learning events, and future Chem-Shastri AI usage records.

## Stack

- PHP 8.1+
- MySQL / InnoDB
- PDO prepared statements
- PHPMailer
- Composer autoload
- JSON API responses
- CORS allowlist
- Hashed passwords and hashed bearer tokens

## Install

```bash
cd hostinger-backend
cp .env.example .env
composer install --no-dev
php src/database/migrate.php
php src/database/seed.php
```

Composer is only needed to install PHPMailer. If Composer is unavailable on Hostinger, run Composer locally and upload `vendor/`.

## Required Env Values

Do not commit real values.

```txt
APP_ENV=production
APP_NAME=Chemlab
APP_URL=https://www.chemlearning.in
FRONTEND_URL=https://www.chemlearning.in
API_URL=https://api.chemlearning.in

DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=
DB_CHARSET=utf8mb4

JWT_SECRET=
JWT_EXPIRES_DAYS=30

SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=ssl
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=Chemlab

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=

CORS_ALLOWED_ORIGINS=https://www.chemlearning.in,https://chemlearning.in,http://localhost:3000
```

Generate `JWT_SECRET`:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## API Routes

All responses use:

```json
{ "ok": true, "data": {} }
```

or:

```json
{ "ok": false, "error": { "code": "ERROR_CODE", "message": "Readable message" } }
```

### Public

- `GET /api/health`
- `GET /api/public/settings`
- `GET /api/public/content`
- `GET /api/public/classes`
- `GET /api/public/classes/{classLevel}`
- `GET /api/public/resources`
- `GET /api/public/resources/{slug}`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Signup supports `student` and `teacher`; public admin signup is blocked.

Student:

```json
{
  "role": "student",
  "name": "Aarav",
  "email": "student@example.com",
  "password": "strong-password",
  "class_level": "10",
  "preferred_language": "en"
}
```

Teacher:

```json
{
  "role": "teacher",
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "strong-password",
  "school_or_institute": "School Name",
  "preferred_language": "en"
}
```

Login returns a raw bearer token once. The database stores only its HMAC hash.

### User

- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/notifications`
- `POST /api/user/notifications/{id}/read`

### Analytics

- `POST /api/analytics/event`

Stores learning, simulation, resource, AI, auth, and page events. If a bearer token is present, `user_id` is attached.

### Admin

Admin routes require a bearer token for a user with `role = admin`.

- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `PUT /api/admin/users/{id}/status`
- `GET /api/admin/resources`
- `POST /api/admin/resources`
- `PUT /api/admin/resources/{id}`
- `GET /api/admin/settings`
- `PUT /api/admin/settings/{key}`
- `POST /api/admin/email/test`

## Seeded Resources

The seeder adds:

- Redox Transfer Kitchen → `/labs/redox-transfer-kitchen`, Class 10 Science
- Hydrocarbon Naming Quest → `/labs/hydrocarbon-naming-quest`, Class 11 Chemistry

The database is ready for books, chapters, topics, translations, content blocks, media assets, and future admin editing.

Stage 6 also adds editable draft NCERT skeleton records for Class 9-12. Keep these as draft until the current syllabus mapping is verified in `/admin/resources/structure`.

## Email

`MailService` supports:

- `verify_email`
- `welcome_student`
- `welcome_teacher`
- `password_reset`
- `admin_new_signup`
- `test_email`

Templates are read from `email_templates`; fallback templates are used if a DB template is missing. Every attempt is written to `email_logs`. If SMTP or PHPMailer is unavailable, the send fails gracefully with a clear error and a snapshot in `storage/mail/`.

## Verification

```bash
php scripts/check-backend.php
php scripts/smoke-test.php
find . -name '*.php' -print0 | xargs -0 -n1 php -l
```

Run frontend build from the repository root with `npm run build`.

Test after deployment:

```txt
https://api.chemlearning.in/api/health
```
