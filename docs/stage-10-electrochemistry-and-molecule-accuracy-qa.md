# Stage 10 Electrochemistry And Molecule Accuracy QA

## Electrochemistry Power Grid Studio

- `/labs/electrochemistry-power-grid` opens.
- The intro starts with a student-facing Class 12 electrochemistry mission.
- Level 1 builds the Daniell cell with zinc half-cell, copper half-cell, wire, and salt bridge.
- Zinc is identified as anode and oxidation side.
- Copper is identified as cathode and reduction side.
- Electrons visibly flow externally from zinc to copper.
- The salt bridge explanation says ions move through the bridge, not electrons.
- Ion direction answer accepts anions to anode and cations to cathode.
- Cell notation shows `Zn | Zn²⁺ || Cu²⁺ | Cu`.
- Half reactions show `Zn -> Zn²⁺ + 2e⁻` and `Cu²⁺ + 2e⁻ -> Cu`.
- Nernst Lab sliders change voltage using `E = 1.10 - (0.0591 / 2) log([Zn²⁺] / [Cu²⁺])`.
- Standard-state voltage is about `1.10 V`.
- Higher `Cu²⁺` raises cell voltage.
- Higher `Zn²⁺` lowers cell voltage.
- Completion unlocks the Electrochemistry Grid Master badge.
- Chem-Shastri answers zinc anode, electron flow, salt bridge, Nernst equation, cell notation, and `E°cell` questions with page context.

## Molecule Shapes 3D

- `/labs/molecule-shapes-3d` opens.
- Class filters for all, Class 10, Class 11, and Class 12 work.
- Search works for names, formulas, topics, and chapters.
- Category filters work for VSEPR, hydrocarbons, organic molecules, functional groups, inorganic, coordination, and ionic models.
- Required Class 10 molecules appear, including water, carbon dioxide, methane, oxygen, nitrogen, chlorine, hydrogen, HCl, NaCl concept lattice, hydrocarbons, ethanol, ethanoic acid, and functional group examples.
- Required Class 11 molecules appear, including H₂O, CO₂, CH₄, NH₃, BF₃, BeCl₂, PCl₅, SF₆, XeF₂, XeF₄, O₃, SO₂, SO₃, CO, NO, NO₂, benzene, hydrocarbons, and mole/reaction examples.
- Required Class 12 molecules appear, including ammonia, water, ethanol, methanol, ethanoic acid, propanone, phenol, glucose simplified, and coordination examples.
- Every molecule has coordinate source, accuracy level, notes, and review date.
- No molecule validation errors appear in `npm run test:molecule-library`.

## Open Resource Safety

- PhET Battery Voltage and Circuit Construction Kit are candidates only.
- PhET resources remain `link_only`, `draft`, `licenseReviewed: false`, and `accuracyReviewStatus: needs_review` until admin review.
- No PhET assets, screenshots, or simulation files are copied into Chemlab.
- External resources are not embedded unless license and accuracy review are complete.

## Commands

- `npm run test:electrochemistry-calculations`
- `npm run test:molecule-library`
- `npm run test:chem-shastri-electrochemistry-context`
- `npm run lint`
- `npm run build`

