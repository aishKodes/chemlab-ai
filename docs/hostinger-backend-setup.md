# Chemlab Hostinger Backend Setup

## 1. Create Subdomain

Create:

```txt
api.chemlearning.in
```

Point it to the same Hostinger hosting account where the PHP backend will live.

## 2. Set Document Root

Preferred document root:

```txt
hostinger-backend/public
```

If Hostinger cannot point the subdomain directly to that folder, upload the whole `hostinger-backend` folder outside direct public access when possible and map the subdomain to its `public` folder. Keep `src`, `migrations`, `seeders`, `storage`, and `.env` non-public. The included `.htaccess` files deny direct browsing as an extra guard.

## 3. Create MySQL Database

In Hostinger hPanel:

1. Create a MySQL database.
2. Create a MySQL user.
3. Grant that user access to the database.
4. Copy host, database name, username, and password.

## 4. Fill `.env`

Copy:

```bash
cp .env.example .env
```

Set:

```txt
DB_HOST
DB_NAME
DB_USER
DB_PASS
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM_EMAIL
JWT_SECRET
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
```

Use:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

for `JWT_SECRET`.

## 5. Upload Files

Upload `hostinger-backend/` to Hostinger. Do not upload real credentials into Git. The live `.env` should exist only on the server.

## 6. Install Composer Dependencies

On a Composer-capable machine:

```bash
cd hostinger-backend
composer install --no-dev
```

If Hostinger does not provide Composer, run this locally and upload the generated `vendor/` directory.

## 7. Run Migrations

```bash
php src/database/migrate.php
```

This creates Stage 1 tables.

Optional readiness check before seeding:

```bash
php scripts/check-backend.php
```

## 8. Run Seeders

```bash
php src/database/seed.php
```

This creates:

- Class 9 Science
- Class 10 Science
- Class 11 Chemistry
- Class 12 Chemistry
- Site settings
- Email templates
- First admin from `ADMIN_*`
- Redox Transfer Kitchen resource
- Hydrocarbon Naming Quest resource
- Draft Class 9-12 NCERT skeletons for admin verification

Run the smoke test:

```bash
php scripts/smoke-test.php
```

## 9. Test Health

Open:

```txt
https://api.chemlearning.in/api/health
```

Expected JSON:

```json
{ "ok": true, "data": { "status": "ok" } }
```

## 10. Test Signup and Login

Student signup:

```http
POST https://api.chemlearning.in/api/auth/signup
```

Teacher signup:

```http
POST https://api.chemlearning.in/api/auth/signup
```

Login:

```http
POST https://api.chemlearning.in/api/auth/login
```

Then test:

```http
GET https://api.chemlearning.in/api/auth/me
Authorization: Bearer TOKEN
```

## 11. Test SMTP

Login as the seeded admin, then:

```http
POST https://api.chemlearning.in/api/admin/email/test
Authorization: Bearer ADMIN_TOKEN
```

If SMTP is not configured, the API should fail gracefully and log to `email_logs`.

## 12. Set Vercel Env

In Vercel:

```txt
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

No backend secrets should be placed in `NEXT_PUBLIC_*`.
