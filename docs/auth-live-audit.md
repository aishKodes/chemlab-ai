# Chemlab Auth Live Audit

Date: 2026-08-14

Scope: authentication, user account flows, role protection, token behavior, email verification, password reset, profile updates, and frontend/backend integration. New simulations and unrelated product work are out of scope.

## Current Flow

- Frontend auth pages live at `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/profile`, `/dashboard`, `/student/dashboard`, `/teacher/dashboard`, and `/admin`.
- Frontend auth state is managed by `AuthProvider` with bearer tokens stored in `localStorage` under `chemlab_auth_token`.
- A minimal cached user is stored under `chemlab_auth_user` for fast UI restore. No password is stored.
- Frontend API calls use `NEXT_PUBLIC_BACKEND_URL`, defaulting to `https://api.chemlearning.in`.
- Backend auth APIs are under `/api/auth/*` on the Hostinger PHP backend.
- Signup allows only `student` and `teacher`; public admin signup is not available.
- Backend stores password hashes with `password_hash()` and verifies them with `password_verify()`.
- Login returns a raw bearer token once; the database stores only the HMAC token hash.
- Logout revokes the current token hash.
- `/dashboard` redirects by role: student to `/student/dashboard`, teacher to `/teacher/dashboard`, admin to `/admin`.
- Student and teacher dashboards are client-guarded by role. Admin pages are wrapped by `AdminLayoutFrame` and require admin role.
- Backend admin and teacher APIs enforce server-side role checks.

## Problems Found

- CORS allowed methods did not include `PUT` or `DELETE`, even though profile and admin update APIs use `PUT`.
- Email verification and resend endpoints required a bearer token, but the frontend `/verify-email` form sends email plus code.
- Emails were lowercased but not consistently trimmed on every frontend/backend auth path.
- Verification attempts were counted but not capped during lookup.
- Resending verification did not invalidate older unused verification codes.
- Profile update accepted unsupported class/language values and could set an empty name.
- Auth availability testing did not have a dedicated non-destructive QA route or CLI probe.

## Fixes Applied

- Added `PUT` and `DELETE` to backend CORS allowed methods.
- Normalized auth emails with trim + lowercase in frontend and backend login/signup/forgot/verification flows.
- Updated backend email verification to accept either the current bearer token or email + 6-digit code from the verification page.
- Updated resend verification to accept either current bearer token or email, while returning a generic safe response for unknown/already-verified emails.
- Invalidated previous unused signup verification codes before creating a fresh code.
- Capped verification lookup to codes with fewer than 5 attempts.
- Added backend profile validation for name, preferred language, class level, and phone length.
- Added `/dev/auth-test`, hidden by `notFound()` in production.
- Added `npm run test:auth-endpoints` for safe endpoint probes.

## Remaining Live-Only Dependencies

- Actual student/teacher signup completion depends on live Hostinger DB and SMTP state.
- Email verification success depends on receiving the 6-digit code in a real mailbox.
- Password reset success depends on receiving the reset token/code in a real mailbox.
- Live admin login depends on the seeded production admin credentials, which are not stored in Git.
- Full browser E2E production testing needs controlled test inboxes and permission to create temporary production users.

## Security Notes

- No public admin signup route exists.
- Wrong login returns generic `Email or password is incorrect.`
- Tokens are revoked on logout and rejected when expired or revoked.
- Frontend clears auth storage after 401.
- No password hashes are returned in public/profile/admin user API responses inspected in this pass.
- LocalStorage bearer token storage is retained for this stage and documented as a future httpOnly-cookie improvement.
