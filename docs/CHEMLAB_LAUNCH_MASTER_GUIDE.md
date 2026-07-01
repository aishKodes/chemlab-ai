# Chemlab Launch Master Guide

This is the primary launch flow for Chemlab.

- Frontend: Vercel, `https://www.chemlearning.in`
- Backend: Hostinger public_html, `https://api.chemlearning.in`
- Database: Hostinger MySQL
- Email: Hostinger SMTP

## 1. Build The Hostinger public_html Package

From the project root:

```bash
php scripts/build-hostinger-publichtml-package.php
```

This creates:

```txt
dist/chemlab-hostinger-publichtml/
dist/chemlab-hostinger-publichtml.zip
```

Upload the contents of `dist/chemlab-hostinger-publichtml/`, not the folder itself.

## 2. Create The Hostinger Subdomain

In Hostinger hPanel, create:

```txt
api.chemlearning.in
```

Use the normal Hostinger folder:

```txt
api.chemlearning.in/public_html/
```

## 3. Create The MySQL Database

In Hostinger hPanel:

1. Create a MySQL database.
2. Create a MySQL user.
3. Grant the user access.
4. Copy:

```txt
DB_HOST
DB_NAME
DB_USER
DB_PASS
```

## 4. Upload The Backend

Upload the package contents into:

```txt
api.chemlearning.in/public_html/
```

The folder should look like:

```txt
public_html/
├── index.php
├── health.php
├── install.php
├── config.example.php
├── .htaccess
├── src/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── storage/
│   └── logs/
└── uploads/
```

If `vendor/` is present, upload it too. If not, auth, APIs, and Hostinger SMTP can still work because Chemlab includes a built-in SMTP sender. `vendor/` is now optional and only needed if you specifically want PHPMailer.

## 5. Create config.php

In `public_html`, rename:

```txt
config.example.php
```

to:

```txt
config.php
```

Fill:

- database host/name/user/password
- mail host/port/user/password/from email
- admin name/email/password
- JWT secret
- frontend URL
- API URL

Generate a JWT secret locally:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## 6. Open The Browser Installer

Open:

```txt
https://api.chemlearning.in/install.php
```

Click:

1. Check requirements
2. Run full install

Full install runs:

- `database/schema.sql`
- `database/seed.sql`
- first admin creation with `password_hash()`
- `storage/install.lock`

After install, delete `install.php` or keep `storage/install.lock` active.

## 7. Manual phpMyAdmin Option

If you prefer manual import:

1. Import `database/schema.sql`
2. Import `database/seed.sql`
3. Open:

```txt
https://api.chemlearning.in/install.php?action=create-admin
```

This creates or updates the admin user safely with a hashed password from `config.php`.

## 8. Test The API

Open:

```txt
https://api.chemlearning.in/health.php
https://api.chemlearning.in/api/health
https://api.chemlearning.in/api/public/classes
https://api.chemlearning.in/api/public/resources
```

Expected response format:

```json
{ "ok": true, "data": {} }
```

## 9. Set Vercel Environment

In Vercel set:

```txt
NEXT_PUBLIC_SITE_URL=https://www.chemlearning.in
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

Optional Chem-Shastri values:

```txt
GEMINI_API_KEY=
OPENAI_API_KEY=
CHEM_SHASTRI_ENABLED=true
CHEM_SHASTRI_DEFAULT_PROVIDER=gemini
CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED=false
CHEM_SHASTRI_DAILY_BUDGET_INR=50
DEV_UNLIMITED_AI=false
```

## 10. Login As Admin

Open:

```txt
https://www.chemlearning.in/login
```

Use the admin email/password from `config.php`.

Then verify:

- `/admin`
- `/admin/resources/structure`
- `/admin/resources`
- `/classes`
- `/resources`
- `/labs/redox-transfer-kitchen`
- `/labs/hydrocarbon-naming-quest`

## 11. Production Safety Rules

- Do not upload real secrets to Git.
- Do not expose `config.php`.
- Do not put backend secrets in `NEXT_PUBLIC_*`.
- Keep `DEV_UNLIMITED_AI=false` in production.
- Keep paid voice generation disabled until explicitly enabled.
- Keep NCERT skeleton rows draft until verified.
- Do not publish generated assets with visible checkerboard backgrounds.

## Optional Advanced Method

The older Composer/SSH style workflow still works for developers who want it:

```bash
cd hostinger-backend
composer install --no-dev
php src/database/migrate.php
php src/database/seed.php
php scripts/check-backend.php
php scripts/smoke-test.php
```

But the primary recommended Hostinger workflow is the public_html package plus browser installer.
