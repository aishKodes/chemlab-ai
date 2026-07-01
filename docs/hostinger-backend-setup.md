# Chemlab Hostinger Backend Setup

This project now uses the user's normal Hostinger workflow: upload a prepared PHP package directly into `public_html`, fill `config.php`, and run `install.php` in the browser.

## 1. Build The public_html Package

From the project root:

```bash
php scripts/build-hostinger-publichtml-package.php
```

This creates:

```txt
dist/chemlab-hostinger-publichtml/
dist/chemlab-hostinger-publichtml.zip
```

## 2. Create Subdomain

Create:

```txt
api.chemlearning.in
```

Hostinger will provide a folder like:

```txt
api.chemlearning.in/public_html/
```

## 3. Create MySQL Database

In Hostinger hPanel:

1. Create a MySQL database.
2. Create a MySQL user.
3. Grant that user access to the database.
4. Copy DB host, database name, username, and password.

## 4. Upload Files

Upload the contents of:

```txt
dist/chemlab-hostinger-publichtml/
```

directly into:

```txt
api.chemlearning.in/public_html/
```

Do not upload the folder itself. Upload the files inside it.

## 5. Create config.php

On Hostinger, rename:

```txt
config.example.php
```

to:

```txt
config.php
```

Fill:

```txt
database.host
database.name
database.user
database.pass
security.jwt_secret
mail.host
mail.port
mail.username
mail.password
mail.from_email
admin.name
admin.email
admin.password
```

Generate a JWT secret:

```bash
php -r 'echo bin2hex(random_bytes(32)).PHP_EOL;'
```

## 6. Run Browser Installer

Open:

```txt
https://api.chemlearning.in/install.php
```

Click:

1. Check requirements
2. Run full install

The installer runs:

- `database/schema.sql`
- `database/seed.sql`
- first admin creation with `password_hash()`
- `storage/install.lock`

## 7. Manual phpMyAdmin Option

If you prefer manual SQL import:

1. Import `database/schema.sql`
2. Import `database/seed.sql`
3. Open:

```txt
https://api.chemlearning.in/install.php?action=create-admin
```

This creates the admin safely because password hashing must happen in PHP.

## 8. Test API

Open:

```txt
https://api.chemlearning.in/health.php
https://api.chemlearning.in/api/health
https://api.chemlearning.in/api/public/classes
https://api.chemlearning.in/api/public/resources
```

## 9. Set Vercel Env

In Vercel:

```txt
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

## 10. Composer / PHPMailer

If the package does not include `vendor/`, Chemlab uses the built-in SMTP sender with your Hostinger SMTP settings.

PHPMailer is optional. To include it:

```bash
cd hostinger-backend
composer install --no-dev
cd ..
php scripts/build-hostinger-publichtml-package.php
```

Then upload the package again.

## 11. After Install

Keep `storage/install.lock` in place. For extra safety after launch, delete `install.php`.

The older CLI migration flow still exists for advanced deployments, but the public_html package is the primary workflow.
