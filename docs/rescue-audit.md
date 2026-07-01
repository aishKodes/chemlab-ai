# Chemlab Rescue Audit

Date: 2026-05-20

## Asset Discovery

### Clean scene backgrounds kept in `assets/`

These are full rectangular backgrounds and do not need transparency.

- `assets/chemlab-classroom.png`
- `assets/chemlab-magical-lab-background.png`
- `assets/chemlab-virtual-lab-bench.png`

### Chem-Shastri assets discovered

The Chem-Shastri generated PNGs existed, but all were RGB PNGs with no alpha channel and visible checkerboard-looking backgrounds. They are quarantined and not used in student UI.

- `public/_quarantine/bad-assets/master-alchem-avatar.png`
- `public/_quarantine/bad-assets/master-alchem-celebrating.png`
- `public/_quarantine/bad-assets/master-alchem-hero.png`
- `public/_quarantine/bad-assets/master-alchem-idle.png`
- `public/_quarantine/bad-assets/master-alchem-lab-guide.png`
- `public/_quarantine/bad-assets/master-alchem-pointing.png`
- `public/_quarantine/bad-assets/master-alchem-reference.png`
- `public/_quarantine/bad-assets/master-alchem-thinking.png`
- `public/_quarantine/bad-assets/master-alchem-warning.png`

Decision: replace runtime usage with the clean SVG/CSS Chem-Shastri component until transparent assets are regenerated.

### Student assets discovered

These also had no alpha channel and baked checkerboard-looking backgrounds, so they were quarantined.

- `public/_quarantine/bad-assets/student-girl-reference.png`
- `public/_quarantine/bad-assets/student-girl-curious.png`
- `public/_quarantine/bad-assets/student-girl-worried.png`
- `public/_quarantine/bad-assets/student-girl-celebrating.png`

Decision: do not use student character PNGs in student pages until clean transparent versions exist.

### Lab prop assets discovered

These were object cutouts with no alpha channel and baked checkerboard-looking backgrounds, so they were quarantined.

- `public/_quarantine/bad-assets/acid-beaker.png`
- `public/_quarantine/bad-assets/base-beaker.png`
- `public/_quarantine/bad-assets/mixing-beaker-empty.png`
- `public/_quarantine/bad-assets/indicator-bottle.png`
- `public/_quarantine/bad-assets/ph-meter.png`
- `public/_quarantine/bad-assets/evaporation-dish-heating-plate.png`
- `public/_quarantine/bad-assets/salt-crystals.png`

Decision: replace lab props with clean SVG/CSS beakers, pH meter, indicator bottle, evaporation dish, and crystals.

## Asset Preview

Created `/dev/assets` to show every discovered asset with:

- filename
- path
- used/unused status
- preview on white background
- preview on coloured background
- checkerboard warning

## Current Simulation Routes

### Featured

- `/labs/neutralization-studio`: flagship acid-base neutralization lab.
- `/simulations/molecule-explorer`: real 3D molecular viewer using `3dmol`.
- `/simulations/atomic-builder`: interactive atom builder retained as a starter lab.

### Prototype Labs

These remain accessible but are not presented as the flagship experience.

- `/simulations/periodic-table`
- `/simulations/equation-balancer`
- `/simulations/mole-visualizer`
- `/simulations/bonding-lab`
- `/labs/cinematic-salt-lab` remains as a compatibility route that now renders Neutralization Studio.

## What Needed Replacement

- Checkerboard-background character art.
- Checkerboard-background lab prop art.
- Lab pages that felt like UI cards rather than experiments.
- Student-facing copy that mentioned backend/API/development details.
- Simulations page that presented every prototype as equally polished.
- Lack of persistent Chem-Shastri guidance across routes.

## What Was Kept

- Chemlab brand and colourful visual direction.
- Clean full-scene lab backgrounds.
- Existing chemistry utilities, tools, quizzes, and old simulation routes.
- AI backend route and mock mode.
- Gamification components for XP, badges, mistake practice, and daily quests.

