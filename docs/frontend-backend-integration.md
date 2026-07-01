# Chemlab Frontend + Hostinger Backend Integration

Stage 2 connects the Vercel Next.js frontend to the Hostinger PHP/MySQL backend at `api.chemlearning.in`.

## Required Vercel Environment Values

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.chemlearning.in
BACKEND_INTERNAL_API_URL=https://api.chemlearning.in
```

For local development, use the backend URL you are running:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_INTERNAL_API_URL=http://localhost:8000
```

If `NEXT_PUBLIC_BACKEND_URL` is missing, public pages use local fallback resources and auth pages show a clear configuration message.

## Auth Token Storage

Stage 2 stores the bearer token in browser `localStorage` under:

- `chemlab_auth_token`
- `chemlab_auth_user`

Passwords are never stored. A later stage can move auth to httpOnly cookies if domain and backend deployment settings support it.

## Role Redirects

`/dashboard` redirects by backend role:

- `student` -> `/student/dashboard`
- `teacher` -> `/teacher/dashboard`
- `admin` -> `/admin`

Protected pages use `AuthGuard` and `RoleGuard`.

## How To Test Signup/Login

1. Set `NEXT_PUBLIC_BACKEND_URL`.
2. Open `/signup`.
3. Create a student account with name, email, password, optional class, and language.
4. Create a teacher account with name, email, password, optional institute, and language.
5. Open `/login` and sign in.
6. Confirm `/dashboard` sends you to the correct role dashboard.
7. Use Logout and confirm the token is cleared.

## How To Test Dashboards

- Student: `/student/dashboard`
- Teacher: `/teacher/dashboard`
- Admin: `/admin`

If the backend is offline, dashboards still render the local Redox and Hydrocarbon simulation recommendations.

## How To Test Chem-Shastri Compact Icon

Open:

- `/labs/redox-transfer-kitchen`
- `/labs/hydrocarbon-naming-quest`
- any other `/labs/*` route

The Chem-Shastri launcher should be a small icon near the right edge, above the bottom action area. It should not cover the lab controls.

## Public Classes And Resources

Test:

- `/classes`
- `/classes/9`
- `/classes/10`
- `/classes/11`
- `/classes/12`
- `/resources`

If backend classes/resources are unavailable, local fallback data shows:

- Redox Transfer Kitchen
- Hydrocarbon Naming Quest

## Known Limitations

- Admin pages are protected shells only; full CMS, media management, analytics, and email tools come later.
- Profile fields depend on the backend profile payload shape.
- Notifications use polling on page load only.
- Chem-Shastri conversation persistence remains in the existing AI route layer; backend conversation storage can be connected in a later stage.
