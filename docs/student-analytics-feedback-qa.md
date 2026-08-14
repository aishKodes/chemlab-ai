# Student Analytics and Feedback QA

## Signup recovery

- Submit a new student signup with valid details.
- Confirm the account opens the student dashboard automatically.
- Confirm an SMTP failure after account creation no longer produces a false signup failure.
- Confirm invalid fields still show validation feedback and do not attempt login.
- Confirm an existing email with the wrong password still reports the original signup error.

## Student feedback

- Open `/student/dashboard` as a student.
- Complete all four required feedback choices and an optional note.
- Confirm the submit button is disabled until the required answers are chosen.
- Confirm success appears only after `/api/analytics/event` accepts the event.
- Confirm the stored event is `student_feedback_submitted` and is attached to the signed-in user.
- Confirm comments are limited to 800 characters and no password is requested.

## Admin student intelligence

- Open `/admin/analytics/students` as an admin.
- Search by student name, email, and user ID.
- Open a student and verify account status, activity, lab sessions, time, mistakes, feedback, and questions.
- Confirm `/admin/analytics/students/{id}` rejects non-admin users through the role guard.
- Confirm feedback metadata renders as readable labels.
- Confirm missing profile/activity data produces a useful empty state.

## Chem-Shastri questions

- Ask a unique question while signed in as a student.
- Open `/admin/analytics/chem-shastri` and search for the exact words.
- Confirm the authenticated student is shown with time, mode, intent, lab context, and helpfulness when available.
- Confirm paired browser/server log entries are shown once, preferring the authenticated record.
- Confirm the student link opens the matching learner detail.

## Regression

- Run `npm run lint`.
- Run `npm run build`.
- Confirm no Hostinger backend files changed in this release.
- Confirm `/signup`, `/student/dashboard`, `/admin/analytics`, `/admin/analytics/students`, and `/admin/analytics/chem-shastri` return successfully.
