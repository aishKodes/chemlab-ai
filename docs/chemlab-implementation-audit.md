# Chemlab Implementation Audit

Date: 2026-05-20

## 1. Current Routes Found

- `/`
- `/learn`
- `/learn/chemistry`
- `/learn/chemistry/[chapterSlug]`
- `/simulations`
- `/simulations/atomic-builder`
- `/simulations/periodic-table`
- `/simulations/equation-balancer`
- `/simulations/mole-visualizer`
- `/simulations/bonding-lab`
- `/simulations/molecule-explorer`
- `/labs`
- `/labs/neutralization-studio`
- `/labs/cinematic-salt-lab` compatibility route, now rendering Neutralization Studio
- `/ai-tutor`
- `/quiz`
- `/quiz/[chapterSlug]`
- `/dashboard`
- `/dashboard/progress`
- `/dashboard/mistakes`
- `/admin`
- `/admin/content`
- `/admin/questions`
- `/about`
- `/dev/assets` development-only asset preview
- API routes: `/api/ai`, `/api/progress`, `/api/quiz/submit`

## 2. Current Simulations Found

Featured experiences:

- Neutralization Studio: flagship acid-base lab.
- Molecule Explorer: 3Dmol.js molecule viewer.
- Atomic Builder: interactive atom identity/charge/isotope starter lab.

Prototype labs retained:

- Periodic Table Explorer.
- Equation Balance Checker.
- Mole Visualizer.
- Bonding Lab.

## 3. Chem-Shastri Assets Found

These were discovered and moved to quarantine because they are RGB PNGs with no alpha channel and visible checkerboard-looking backgrounds:

- `public/_quarantine/bad-assets/master-alchem-avatar.png`
- `public/_quarantine/bad-assets/master-alchem-celebrating.png`
- `public/_quarantine/bad-assets/master-alchem-hero.png`
- `public/_quarantine/bad-assets/master-alchem-idle.png`
- `public/_quarantine/bad-assets/master-alchem-lab-guide.png`
- `public/_quarantine/bad-assets/master-alchem-pointing.png`
- `public/_quarantine/bad-assets/master-alchem-reference.png`
- `public/_quarantine/bad-assets/master-alchem-thinking.png`
- `public/_quarantine/bad-assets/master-alchem-warning.png`

Runtime decision: use `components/master-alchem/MasterAlchem.tsx`, a clean SVG/CSS mentor that always fits its container.

## 4. Student Character Assets Found

These were quarantined for the same checkerboard/no-alpha issue:

- `public/_quarantine/bad-assets/student-girl-reference.png`
- `public/_quarantine/bad-assets/student-girl-curious.png`
- `public/_quarantine/bad-assets/student-girl-worried.png`
- `public/_quarantine/bad-assets/student-girl-celebrating.png`

Runtime decision: do not use student cutouts until clean transparent versions exist.

## 5. Lab Assets Found

Quarantined lab cutout assets:

- `public/_quarantine/bad-assets/acid-beaker.png`
- `public/_quarantine/bad-assets/base-beaker.png`
- `public/_quarantine/bad-assets/mixing-beaker-empty.png`
- `public/_quarantine/bad-assets/indicator-bottle.png`
- `public/_quarantine/bad-assets/ph-meter.png`
- `public/_quarantine/bad-assets/evaporation-dish-heating-plate.png`
- `public/_quarantine/bad-assets/salt-crystals.png`

Runtime decision: Neutralization Studio draws clean beakers, indicator, pH panel, evaporation dish, and crystals with SVG/CSS.

## 6. Scene / Background Assets Found

Safe to use as rectangular backgrounds:

- `assets/chemlab-classroom.png`
- `assets/chemlab-magical-lab-background.png`
- `assets/chemlab-virtual-lab-bench.png`

## 7. Assets With Checkerboard-Looking Backgrounds

All object/character cutout PNGs in `public/_quarantine/bad-assets/` are treated as checkerboard-risk assets and are not referenced by student-facing runtime components.

The asset processor also records status in:

- `public/processed/asset-manifest.json`

Current processor summary:

- total assets: 23
- clean: 3
- checkerboard detected: 20
- processed: 20
- failed: 0
- used by site: 3

## 8. Assets Safe To Use

Only the three scene backgrounds are currently used by the public site.

Processed object cutouts may be inspected on `/dev/assets`, but they are not used as primary UI art until manually approved.

## 9. Assets That Should Be Quarantined

The following groups remain quarantined:

- Chem-Shastri PNG cutouts.
- Student PNG cutouts.
- Lab prop PNG cutouts.

They can be regenerated later as true transparent PNG/WebP assets and added back through `masterAlchemAssets.ts` or lab asset mapping.

## 10. Components That Need Replacing / Upgrading

Already upgraded:

- `components/master-alchem/MasterAlchem.tsx`: fit-safe SVG/CSS mentor.
- `components/master-alchem/MasterAlchemGuide.tsx`: site-wide guide.
- `components/labs/NeutralizationStudio.tsx`: flagship lab.
- `components/simulations/RealMoleculeExplorer.tsx`: real molecule viewer using 3Dmol.js.
- `app/simulations/page.tsx`: featured/prototype structure.
- `app/dev/assets/page.tsx`: manifest-driven asset preview.

Still good future candidates:

- Periodic Table Explorer can become a richer trend lab.
- Equation Balancer can become a puzzle scene with visual atom inventories.
- Bonding Lab can become a drag-and-connect molecule builder.
- Mole Visualizer can become a scale/particle simulation.

