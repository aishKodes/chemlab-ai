# Chemlab Phase 1 Audit

Date: 2026-05-21

## 1. Current Route List

- `/`
- `/about`
- `/admin`
- `/admin/content`
- `/admin/questions`
- `/ai-tutor`
- `/dashboard`
- `/dashboard/mistakes`
- `/dashboard/progress`
- `/dev/assets`
- `/labs`
- `/labs/cinematic-salt-lab`
- `/labs/demo-cinematic-shell`
- `/labs/neutralization-studio`
- `/learn`
- `/learn/chemistry`
- `/learn/chemistry/[chapterSlug]`
- `/mistake-lab`
- `/quiz`
- `/quiz/[chapterSlug]`
- `/simulations`
- `/simulations/atomic-builder`
- `/simulations/bonding-lab`
- `/simulations/equation-balancer`
- `/simulations/mole-visualizer`
- `/simulations/molecule-explorer`
- `/simulations/periodic-table`
- `/tools`
- `/tools/equation-balancer`
- `/tools/mole-calculator`
- `/tools/molecular-mass-calculator`

API routes:

- `/api/ai`
- `/api/progress`
- `/api/quiz/submit`

## 2. Current Simulation / Lab List

Featured or high-priority experiences:

- `/labs/demo-cinematic-shell`: Phase 1 reusable cinematic lab shell demo.
- `/labs/neutralization-studio`: existing guided acid-base lab prototype.
- `/simulations/molecule-explorer`: 3D molecule viewer.
- `/simulations/atomic-builder`: interactive atom builder.

Prototype / practice experiences:

- `/labs/cinematic-salt-lab`
- `/simulations/periodic-table`
- `/simulations/equation-balancer`
- `/simulations/mole-visualizer`
- `/simulations/bonding-lab`

Phase 2 candidates:

- Daniell Cell Studio.
- Acid-base titration studio.
- Qualitative analysis quest.
- Richer equation-balancing puzzle scene.

## 3. Current Chem-Shastri Asset Paths

Raw Chem-Shastri PNGs are quarantined:

- `public/_quarantine/bad-assets/master-alchem-avatar.png`
- `public/_quarantine/bad-assets/master-alchem-celebrating.png`
- `public/_quarantine/bad-assets/master-alchem-hero.png`
- `public/_quarantine/bad-assets/master-alchem-idle.png`
- `public/_quarantine/bad-assets/master-alchem-lab-guide.png`
- `public/_quarantine/bad-assets/master-alchem-pointing.png`
- `public/_quarantine/bad-assets/master-alchem-reference.png`
- `public/_quarantine/bad-assets/master-alchem-thinking.png`
- `public/_quarantine/bad-assets/master-alchem-warning.png`

Processed review outputs are in:

- `public/processed/master-alchem/`
- `public/processed/master-alchem/manifest.json`

Runtime decision: no processed Chem-Shastri image is approved for live use yet. The live app uses the CSS/SVG fallback from `components/master-alchem/MasterAlchem.tsx`.

## 4. Student / Lab / Background Asset Paths

Student assets quarantined:

- `public/_quarantine/bad-assets/student-girl-reference.png`
- `public/_quarantine/bad-assets/student-girl-curious.png`
- `public/_quarantine/bad-assets/student-girl-worried.png`
- `public/_quarantine/bad-assets/student-girl-celebrating.png`

Lab prop assets quarantined:

- `public/_quarantine/bad-assets/acid-beaker.png`
- `public/_quarantine/bad-assets/base-beaker.png`
- `public/_quarantine/bad-assets/mixing-beaker-empty.png`
- `public/_quarantine/bad-assets/indicator-bottle.png`
- `public/_quarantine/bad-assets/ph-meter.png`
- `public/_quarantine/bad-assets/evaporation-dish-heating-plate.png`
- `public/_quarantine/bad-assets/salt-crystals.png`

Safe background assets:

- `assets/chemlab-classroom.png`
- `assets/chemlab-magical-lab-background.png`
- `assets/chemlab-virtual-lab-bench.png`

## 5. Checkerboard Background Findings

`npm run process:assets` generated this summary:

- total assets scanned: 23
- clean: 3
- checkerboard-risk: 20
- unsafe: 20
- failed: 0
- used by live site: 3

All unsafe assets are currently unused by live student-facing pages.

## 6. Assets Safe To Use

Only the three scene backgrounds are marked safe and used by the live site.

Processed character and prop cutouts are review-only until manually approved on `/dev/assets`.

## 7. Pages / Components Needing Refactor

Phase 1 completed or in progress:

- Chem-Shastri system and guide.
- Asset processing and preview page.
- Homepage student-facing language.
- Chemistry worlds quest map.
- Labs / simulations section separation.
- Dashboard and mistake lab game-like framing.
- Reusable cinematic simulation shell.

Future refactor targets:

- Old prototype simulations need richer 2D/2.5D scenes.
- Neutralization Studio can be rebuilt on the cinematic shell.
- Chapter pages can gain mission timelines and challenge states.
- Admin pages should stay plain and functional while student pages stay playful.

## 8. Old Simulations Treated As Prototypes

- Periodic Table Explorer.
- Equation Balance Checker.
- Mole Visualizer.
- Bonding Lab.
- Cinematic Salt Lab compatibility route.

These remain accessible, but they should not be marketed as final flagship labs.
