# Final Deployment Steps

Use this checklist for the live Chemlab deployment.

## 1. Local Final Checks

Run from `/Users/aishwaryam/Desktop/chemlab-ai`:

```bash
npm run test:chem-shastri-context
npm run test:chem-shastri-live
npm run test:chem-shastri-page-context
npm run lint
npm run build
php scripts/build-hostinger-publichtml-package.php
php scripts/check-hostinger-publichtml-package.php
find hostinger-backend -name '*.php' -print0 | xargs -0 -n1 php -l
find dist/chemlab-hostinger-publichtml -name '*.php' -print0 | xargs -0 -n1 php -l
```

Before committing:

```bash
git status --short
```

Confirm no real secret files are staged:

- `.env`
- `.env.local`
- `hostinger-backend/config.php`
- any SMTP, DB, AI, or admin password file

## 2. Push To GitHub

```bash
git add .
git status --short
git commit -m "Finalize Chemlab demo readiness"
git push origin main
```

Review the staged file list before committing. Do not stage real `config.php` or secret env files.

## 3. Vercel Frontend

Required env values:

```txt
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

Then:

1. Wait for Vercel deployment to finish.
2. Open `/showcase`.
3. Open `/labs/redox-transfer-kitchen`.
4. Open `/labs/molecule-shapes-3d`.
5. Open `/ai-tutor`.
6. Confirm login/signup pages render.

## 4. Hostinger Backend

Build package:

```bash
php scripts/build-hostinger-publichtml-package.php
```

Upload either:

- contents of `dist/chemlab-hostinger-publichtml/`, or
- `dist/chemlab-hostinger-publichtml.zip`

to the Hostinger `public_html` for `api.chemlearning.in`.

Important:

- Do not overwrite a working `config.php` unless intentionally changing credentials.
- If first install, copy `config.example.php` to `config.php` on Hostinger and fill DB/SMTP/admin values there.
- Keep `install.lock` after successful install/update.
- `vendor/` is optional for this package; the backend includes a built-in SMTP fallback for Hostinger SMTP if Composer vendor files are absent.

Test:

```txt
https://api.chemlearning.in/api/health
```

Then test:

- student signup
- login
- `/api/auth/me`
- SMTP test from admin
- public classes/resources

## 5. Admin Checks

After login as admin:

1. Open `/admin`.
2. Open `/admin/resources`.
3. Open `/admin/open-resources`.
4. Confirm external resource candidates are not public unless license-reviewed.
5. Open `/admin/roadmap`.
6. Open `/admin/analytics`.
7. Open `/admin/chem-shastri`.
8. Run email test if SMTP config is ready.

## 6. Live Demo Smoke Test

1. `/showcase`
2. Ask Chem-Shastri: “What is oxidation?”
3. Voice preview only if a good browser voice is selected.
4. `/labs/redox-transfer-kitchen`
5. `/labs/molecule-shapes-3d`
6. `/teacher/quizzes` or `/teacher/live`
7. `/memory-cards`
8. `/admin/roadmap`

## Known Non-Blocking Warnings

- `npm run lint` reports 9 `<img>` warnings in Redox debug/story components. They do not block build.
- Next reports a multiple-lockfile root warning because `/Users/aishwaryam/package-lock.json` exists above this project. It does not block build.
