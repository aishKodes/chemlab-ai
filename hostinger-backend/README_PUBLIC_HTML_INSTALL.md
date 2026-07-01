# Chemlab Hostinger public_html Install

This is the simple Hostinger workflow for `api.chemlearning.in`.

## Step 1: Create The Subdomain

In Hostinger hPanel, create:

```txt
api.chemlearning.in
```

Use the normal Hostinger subdomain folder:

```txt
api.chemlearning.in/public_html/
```

## Step 2: Create The MySQL Database

In Hostinger hPanel, create a MySQL database and copy:

```txt
DB_HOST
DB_NAME
DB_USER
DB_PASS
```

## Step 3: Upload Files

Build the package locally:

```bash
php scripts/build-hostinger-publichtml-package.php
```

Upload the contents of:

```txt
dist/chemlab-hostinger-publichtml/
```

directly into:

```txt
api.chemlearning.in/public_html/
```

Do not upload the folder itself. Upload its contents.

## Step 4: Create config.php

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
- mail SMTP values
- admin name/email/password
- JWT secret
- frontend URL
- API URL

Generate a JWT secret locally:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## Step 5: Run Installer

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

## Step 6: Test API

Open:

```txt
https://api.chemlearning.in/health.php
https://api.chemlearning.in/api/health
https://api.chemlearning.in/api/public/classes
https://api.chemlearning.in/api/public/resources
```

## Step 7: Set Vercel Environment

In Vercel set:

```txt
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

## Step 8: Login As Admin

Open:

```txt
https://www.chemlearning.in/login
```

Use the admin email/password from `config.php`.

## Manual phpMyAdmin Option

If you prefer manual import:

1. Import `database/schema.sql`
2. Import `database/seed.sql`
3. Open:

```txt
https://api.chemlearning.in/install.php?action=create-admin
```

This creates or updates the admin user safely with a hashed password.

## Composer / PHPMailer

If `vendor/` is missing:

- Auth and normal APIs can still work.
- Hostinger SMTP can still work through Chemlab's built-in SMTP sender.

PHPMailer is optional. To use PHPMailer instead of the built-in sender:

```bash
cd hostinger-backend
composer install --no-dev
php scripts/build-hostinger-publichtml-package.php
```

Then upload the package again, including `vendor/`.

## After Install

Keep `storage/install.lock` in place.

For extra safety, delete `install.php` from `public_html` after launch. If you keep it, the lock file prevents normal re-runs.
