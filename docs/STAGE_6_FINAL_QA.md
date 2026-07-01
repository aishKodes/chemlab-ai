# Stage 6 Final QA

Date: 2026-07-01

## Required Command Checks

Run from the project root:

```bash
npm run test:chem-shastri-context
npm run lint
npm run build
find hostinger-backend -name '*.php' -print0 | xargs -0 -n1 php -l
cd hostinger-backend && composer validate
```

## Local Command Results

Run on 2026-07-01:

- `npm run test:chem-shastri-context`: passed.
- `npm run lint`: passed with 9 documented Redox `<img>` warnings.
- `npm run build`: passed. Next.js warned about multiple lockfiles and inferred `/Users/aishwaryam/package-lock.json` as workspace root.
- `find hostinger-backend -path 'hostinger-backend/vendor' -prune -o -name '*.php' -print0 | xargs -0 -n1 php -l`: passed.
- `composer validate`: not run locally because Composer is not installed in this shell.
- `php scripts/check-backend.php`: passed without hard failures; warned that `.env`, DB, CORS, and SMTP are not configured locally.
- `php scripts/smoke-test.php`: exited safely with env/DB warnings because local Hostinger credentials are not present.

Backend deployment checks:

```bash
cd hostinger-backend
php scripts/check-backend.php
php scripts/smoke-test.php
```

## Frontend QA

- [ ] Homepage loads.
- [ ] `/classes` shows Class 9-12.
- [ ] `/classes/10` shows Redox Transfer Kitchen or fallback if backend is unavailable.
- [ ] `/classes/11` shows Hydrocarbon Naming Quest or fallback if backend is unavailable.
- [ ] `/resources` shows public resources.
- [ ] `/resources/redox-transfer-kitchen` opens a resource detail page.
- [ ] `/resources/hydrocarbon-naming-quest` opens a resource detail page.
- [ ] Resource detail "Ask Chem-Shastri" opens `/ai-tutor` with a useful prompt.
- [ ] `/login` handles backend unavailable state gracefully.
- [ ] `/signup` supports student and teacher signup.
- [ ] `/dashboard` redirects by role when logged in.
- [ ] `/profile` is protected.

## Simulation QA

- [ ] `/labs/redox-transfer-kitchen` opens.
- [ ] `/labs/hydrocarbon-naming-quest` opens.
- [ ] Chem-Shastri compact guide is small on `/labs/*`.
- [ ] Chem-Shastri compact guide does not cover the bottom action area.
- [ ] Simulations work without AI keys.
- [ ] No visible checkerboard assets appear.

## Chem-Shastri QA

- [ ] `/ai-tutor` loads without provider keys.
- [ ] Practice/mock response path works.
- [ ] Page/resource context can be sent.
- [ ] `/api/chem-shastri/chat` works.
- [ ] `/api/master-alchem/chat` remains compatible.
- [ ] Voice does not auto-play.
- [ ] Paid voice is disabled by default.

## Backend QA

- [ ] `https://api.chemlearning.in/api/health` returns ok.
- [ ] Public classes endpoint returns Class 9-12.
- [ ] Public resources endpoint returns seeded simulations.
- [ ] Migrations run once and record in `schema_migrations`.
- [ ] Seeders run without duplicate-breaking errors.
- [ ] First admin exists.
- [ ] Student signup works.
- [ ] Teacher signup works.
- [ ] Login returns a bearer token.
- [ ] `/api/auth/me` returns the current user.
- [ ] Admin routes reject non-admin tokens.
- [ ] Admin routes accept admin tokens.
- [ ] SMTP test sends or fails gracefully with an email log.
- [ ] Analytics event endpoint stores an event.

## Data QA

- [ ] Redox Transfer Kitchen is mapped to Class 10 Science.
- [ ] Hydrocarbon Naming Quest is mapped to Class 11 Chemistry.
- [ ] NCERT skeleton books/chapters/topics are draft.
- [ ] Admin warning about verifying syllabus appears on `/admin/resources/structure`.

## Accepted Warnings

- Redox generated-story `<img>` lint warnings may remain. They are documented in `docs/simulation-known-issues.md` and should be optimized in a later visual QA pass.

## Sign-Off

Stage 6 is ready when:

- `npm run build` passes.
- PHP syntax checks pass.
- Hostinger env is configured.
- Backend smoke test passes on Hostinger.
- Vercel production env points to `https://api.chemlearning.in`.
