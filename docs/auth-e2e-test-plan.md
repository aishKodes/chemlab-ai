# Chemlab Auth E2E Test Plan

Use dedicated test inboxes. Do not use personal credentials. Do not commit passwords.

## Student

- A1 Signup: create `student.test+YYYYMMDDHHMM@your-test-domain`.
- A2 Verification: enter the 6-digit code from email.
- A3 Login: log in with email/password.
- A4 Dashboard: confirm redirect to `/student/dashboard`.
- A5 Profile: update name, class, preferred language, board, school, and learning goal.
- A6 Logout: log out and refresh.
- A7 Login again: confirm token persistence after refresh.
- A8 Wrong password: confirm generic error only.
- A9 Forgot password: request reset.
- A10 Reset password: set new password, confirm old password fails and new password works.

## Teacher

- B1 Signup: create `teacher.test+YYYYMMDDHHMM@your-test-domain`.
- B2 Verification: enter email code.
- B3 Login: confirm role is teacher.
- B4 Teacher dashboard: confirm redirect to `/teacher/dashboard`.
- B5 Profile: update school/institute, subject, classes taught, and language.
- B6 Classroom access: open `/teacher/classrooms`.
- B7 Teacher quiz access: open `/teacher/quizzes`.
- B8 Logout.
- B9 Login again.
- B10 Wrong password: confirm generic error only.

## Admin

- C1 Login with seeded admin account.
- C2 Admin dashboard opens.
- C3 User list opens.
- C4 Teacher verification controls are visible.
- C5 Resource admin opens.
- C6 Chem-Shastri admin opens.
- C7 Analytics opens.
- C8 Logout.

## Security

- D1 Student cannot access `/teacher/dashboard`.
- D2 Teacher cannot access `/admin`.
- D3 Student cannot access `/admin`.
- D4 Expired token is rejected.
- D5 Revoked token is rejected after logout.
- D6 Unknown email and wrong password both show a generic login error.
- D7 API keys are not visible in browser source or console.
- D8 Passwords and bearer tokens are not logged.

## Mobile

- E1 Student signup on phone viewport.
- E2 Teacher signup on phone viewport.
- E3 Login on phone viewport.
- E4 Dashboard on phone viewport.
- E5 Verification on phone viewport.

## Safe Automated Probe

Run:

```bash
npm run test:auth-endpoints
```

This checks health, validation behavior, and protected-route status without creating accounts.
