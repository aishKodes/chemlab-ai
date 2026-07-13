# Simulation Final QA

Date: July 13, 2026

## Redox Transfer Kitchen

Status: pass

- Opens at `/labs/redox-transfer-kitchen`.
- Learning flow is transaction-first: murukku transfer, electron transfer, oxidation/reduction gates, spectator cleanup, simultaneous redox, and agents challenge.
- Default gameplay does not depend on free 3D orbit rotation.
- Explore/3D mode is optional.
- Chem-Shastri launcher uses compact simulation mode from the site-wide guide system.
- Sounds are optional/manual-safe; no autoplay requirement.

Demo note: Use this first when explaining the Chemlab story-driven learning style.

## Hydrocarbon Naming Quest

Status: beta/pass

- Opens at `/labs/hydrocarbon-naming-quest`.
- Molecules and name-building interactions are available.
- Treat as beta if the current generated story assets feel less polished than Redox or Molecule Shapes.
- Chem-Shastri launcher remains compact on lab routes.

Demo note: Use after Redox if you want to show IUPAC game direction. If time is short, show Molecule Shapes instead.

## Chemistry Scale Universe

Status: pass

- Opens at `/labs/basic-concepts-chemistry-universe`.
- Playable zones: Matter World, Measurement Lab, Mole Portal, Stoichiometry Factory basic mode.
- Preview/locked zones are clearly marked.
- Analytics hooks are present for zone interactions.

Demo note: Best for showing Class 11 Unit 1 chapter depth.

## Molecule Shapes 3D

Status: pass

- Opens at `/labs/molecule-shapes-3d`.
- Includes H2O, CO2, CH4, NH3, BF3, C2H4, C2H2, and benzene.
- Shows geometry, bond-angle notes, VSEPR explanation, labels, rotate toggle, reset control, and Chem-Shastri CTA.
- Text clearly says school-level molecular geometry visualization.

Demo note: Reliable visual fallback if voice, backend, or another simulation has live-demo friction.

## Teacher Live Quiz

Status: beta/pass

- `/teacher/quizzes` opens and shows fallback quiz examples if backend is unavailable.
- `/teacher/live` now exists as a protected lobby and points teachers to quiz creation/opening.
- Dynamic live room pages include PIN display, refresh, results table, and end-room action.
- Full live polling requires backend availability.

Demo note: Use only after confirming backend is reachable, or show the lobby and explain the workflow.

## Smart Memory Cards

Status: beta/pass

- `/memory-cards` opens.
- Fallback decks are available.
- Review persistence depends on backend/local storage mode.

Demo note: Use as a quick retrieval-practice proof point; avoid overclaiming advanced spaced repetition until backend data is confirmed live.
