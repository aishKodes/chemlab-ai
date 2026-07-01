# Learning Analytics Privacy

Chemlab Stage 4 stores learning signals to improve practice and teacher support. The goal is education, not surveillance.

## Stored Signals

- Page and resource activity.
- Simulation step events.
- Mistake keys and feedback shown.
- Memory card ratings.
- Quick drill attempts and answer correctness.
- Chem-Shastri question logs for trend analysis.

## Not Stored

- Passwords.
- Raw auth tokens.
- Payment data.
- Secret API keys.

## Anonymous Use

Anonymous visitors receive a local anonymous ID in browser storage. If they log in later, future backend events can attach to their account through bearer auth.

## Teacher Visibility

Teachers should only see students who joined their classroom. Stage 4 creates the classroom boundary. Future stages should keep exports and dashboards scoped to that boundary.

## Admin Visibility

Admins can see raw operational analytics for debugging and content quality. Future dashboards should prefer aggregates and avoid unnecessary display of full question text.

## Retention Recommendation

For production, add a retention policy in a later backend stage:

- Keep aggregate rollups longer.
- Keep raw anonymous events for a shorter period.
- Allow student account deletion workflows to remove or anonymize personal rows.
