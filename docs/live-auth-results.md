# Live Auth Results

Date: 2026-08-14

Backend under test: `https://api.chemlearning.in`
Frontend under test: `https://www.chemlearning.in`

## Non-Destructive Live Checks

| Check | Status | Result |
|---|---|---|
| Backend health | PASS | `https://api.chemlearning.in/api/health` returned `ok: true`, status `ok`, database `ok`. |
| Signup page reachable | PASS | `https://www.chemlearning.in/signup` returned HTTP 200 from Vercel. |
| Login page reachable | PASS | `https://www.chemlearning.in/login` returned HTTP 200 from Vercel. |
| Auth protected routes reject missing token | PASS | `npm run test:auth-endpoints` confirmed `/api/auth/me`, `/api/user/profile`, and `/api/admin/users` reject missing token. |
| Validation endpoints respond safely | PASS | `npm run test:auth-endpoints` confirmed signup/login/forgot/reset validation responses. |
| Deployed verify-email behavior | BLOCKED | Live backend still returns old `401` without bearer token. Source/package now supports email + code; upload updated Hostinger package to make this live. |

## Account-Creating Live Checks

| Check | Status | Reason |
|---|---|---|
| Student signup with real test inbox | BLOCKED | Needs a controlled mailbox and approval to create a production test user. |
| Teacher signup with real test inbox | BLOCKED | Needs a controlled mailbox and approval to create a production test user. |
| Email verification | BLOCKED | Needs access to the verification email inbox. |
| Password reset | BLOCKED | Needs access to the reset email inbox. |
| Admin login | BLOCKED | Needs seeded production admin credentials; credentials are not stored in Git. |

## Manual Result Template

Fill this after controlled production testing:

| Flow | Status | Notes |
|---|---|---|
| Student signup |  |  |
| Student verification |  |  |
| Student login |  |  |
| Student dashboard |  |  |
| Student profile update |  |  |
| Student logout |  |  |
| Teacher signup |  |  |
| Teacher verification |  |  |
| Teacher login |  |  |
| Teacher dashboard |  |  |
| Teacher profile update |  |  |
| Teacher logout |  |  |
| Admin login |  |  |
| Admin dashboard |  |  |
| Password reset |  |  |
