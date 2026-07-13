# Final Route Audit

Date: July 13, 2026

Method:
- Ran `npm run build`; Next generated 116 routes successfully.
- Started production server with `npm run start`.
- Probed the important route list on `http://localhost:3000`.
- Posted smoke requests to `/api/chem-shastri/chat`, `/api/master-alchem/chat`, `/api/chem-shastri/feedback`, and `/api/master-alchem/feedback`.

## Public Routes

| Route | Status | Notes |
|---|---|---|
| `/` | pass | HTTP 200. Real homepage remains live. |
| `/showcase` | fixed/pass | HTTP 200. Shows real product experiences; no separate presentation route. |
| `/classes` | pass | HTTP 200 with backend fallback support. |
| `/classes/9` | pass | HTTP 200. |
| `/classes/10` | pass | HTTP 200. |
| `/classes/11` | pass | HTTP 200. |
| `/classes/12` | pass | HTTP 200. |
| `/resources` | pass | HTTP 200. Includes open visualizations link. |
| `/resources/open-visualizations` | pass | HTTP 200. Public page hides unreviewed external candidates. |
| `/roadmap/chemistry` | pass | HTTP 200. Public roadmap available. |
| `/memory-cards` | beta/pass | HTTP 200. Works with fallback decks; backend persistence needs live backend. |
| `/quick-drills` | pass | HTTP 200. |
| `/concept-maps` | pass | HTTP 200. |

## Auth And Profile Routes

| Route | Status | Notes |
|---|---|---|
| `/login` | pass | HTTP 200. Backend unavailable states handled by auth client. |
| `/signup` | pass | HTTP 200. |
| `/forgot-password` | pass | HTTP 200. |
| `/reset-password` | pass | HTTP 200. |
| `/verify-email` | pass | HTTP 200. |
| `/profile` | needs live backend | HTTP 200. Protected; real edit/save requires backend auth. |

## Student And Teacher Routes

| Route | Status | Notes |
|---|---|---|
| `/student/dashboard` | needs live backend | HTTP 200. Protected; uses fallback/resource UI where possible. |
| `/teacher/dashboard` | needs live backend | HTTP 200. Protected. |
| `/teacher/quizzes` | beta/pass | HTTP 200. Fallback quiz list exists; live rooms require backend. |
| `/teacher/live` | fixed/pass | Added safe teacher live lobby. HTTP 200. |
| `/teacher/analytics` | beta/pass | HTTP 200. |
| `/teacher/classrooms` | beta/pass | HTTP 200. |
| `/teacher/assignments` | beta/pass | HTTP 200. |

## Admin Routes

| Route | Status | Notes |
|---|---|---|
| `/admin` | needs live backend | HTTP 200. Protected admin shell. |
| `/admin/users` | needs live backend | HTTP 200. |
| `/admin/resources` | needs live backend | HTTP 200. |
| `/admin/resources/structure` | needs live backend | HTTP 200. |
| `/admin/open-resources` | pass | HTTP 200. Review queue is visible behind admin guard. |
| `/admin/roadmap` | pass | HTTP 200. Roadmap/coverage view present. |
| `/admin/memory-cards` | needs live backend | HTTP 200. |
| `/admin/quick-drills` | needs live backend | HTTP 200. |
| `/admin/concept-maps` | needs live backend | HTTP 200. |
| `/admin/mistake-patterns` | needs live backend | HTTP 200. |
| `/admin/content` | needs live backend | HTTP 200. |
| `/admin/translations` | needs live backend | HTTP 200. |
| `/admin/media` | needs live backend | HTTP 200. |
| `/admin/email` | needs live backend | HTTP 200. |
| `/admin/notifications` | needs live backend | HTTP 200. |
| `/admin/settings` | needs live backend | HTTP 200. |
| `/admin/analytics` | needs live backend | HTTP 200. |
| `/admin/chem-shastri` | needs live backend | HTTP 200. |

## Lab Routes

| Route | Status | Notes |
|---|---|---|
| `/labs/redox-transfer-kitchen` | pass | HTTP 200. Default flow is 2.5D transaction-first; 3D explore is optional. |
| `/labs/hydrocarbon-naming-quest` | beta/pass | HTTP 200. Feature remains available; treat as beta in demos if assets/gameplay feel inconsistent. |
| `/labs/basic-concepts-chemistry-universe` | pass | HTTP 200. Matter, measurement, mole, and stoichiometry zones available. |
| `/labs/molecule-shapes-3d` | pass | HTTP 200. Stable school-level 3D molecular geometry demo. |

## API Routes

| Route | Status | Notes |
|---|---|---|
| `/api/chem-shastri/chat` | pass | HTTP 200. Local curated answer returned without paid AI requirement. |
| `/api/master-alchem/chat` | pass | HTTP 200. Compatibility route still works. |
| `/api/chem-shastri/feedback` | pass | HTTP 200. Local fallback success. |
| `/api/master-alchem/feedback` | pass | HTTP 200. Compatibility feedback route still works. |

## Notes

- No `/presentation` route exists.
- Lint has 9 non-blocking `<img>` warnings in Redox debug/story components.
- Next warns about multiple lockfiles because `/Users/aishwaryam/package-lock.json` exists above the project.
