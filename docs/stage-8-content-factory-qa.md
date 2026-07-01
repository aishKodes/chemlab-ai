# Stage 8 Content Factory QA

## Frontend

- [ ] `/admin/content-factory` opens for admins.
- [ ] Content coverage grid appears.
- [ ] Class 11 Unit 1 appears.
- [ ] Topic counts, card counts, drill counts, and mistake counts render.
- [ ] `/roadmap/chemistry` opens.
- [ ] `/admin/roadmap` opens for admins.
- [ ] `/classes/11` links to Some Basic Concepts of Chemistry and Chemistry Scale Universe.
- [ ] `/resources/some-basic-concepts-of-chemistry` opens.
- [ ] Resource page shows chapter overview, topics, Chemistry Scale Universe, memory deck plan, quick drill plan, concept map, teacher quiz packs, and Chem-Shastri CTA.
- [ ] `/labs/basic-concepts-chemistry-universe` opens.
- [ ] Matter World works: state buttons, temperature slider, classification game, checkpoints, completion badge.
- [ ] Measurement Lab works: scientific notation zoom, significant figures judge, precision/accuracy target, unit bridge, checkpoints.
- [ ] Mole Portal works: substance selector, molar mass builder, mass-to-mole-to-particles converter, checkpoints.
- [ ] Stoichiometry Factory works: balanced equation recipe, limiting reagent model, product and leftover display, checkpoints.
- [ ] Chemical Laws Court is visible as preview/locked.
- [ ] Formula Detective is visible as preview/locked.
- [ ] Analytics events do not block UI when backend is unavailable.
- [ ] Existing Redox and Hydrocarbon labs still open.

## Backend Seeder

- [ ] `008_stage_8_class_11_unit_1_content.php` runs without SQL syntax errors.
- [ ] Class 11 Chemistry subject exists.
- [ ] NCERT Class 11 Chemistry Part 1 book exists.
- [ ] Chapter `some-basic-concepts-of-chemistry` exists.
- [ ] 19 topics are seeded.
- [ ] Overview resource is seeded.
- [ ] Chemistry Scale Universe resource is seeded.
- [ ] Concept map resource and concept map are seeded.
- [ ] Memory decks are seeded:
  - Scientific Notation & Significant Figures
  - Mole Concept Starter
  - Stoichiometry Starter
  - Laws of Chemical Combination
- [ ] Quick drills are seeded:
  - SI Units and Scientific Notation Drill
  - Significant Figures Drill
  - Mole Concept Drill
  - Stoichiometry Drill
- [ ] Teacher quiz packs are seeded:
  - Class 11 Unit 1 - Measurement and SI Units
  - Class 11 Unit 1 - Mole Concept
  - Class 11 Unit 1 - Stoichiometry Basics
- [ ] Mistake patterns exist for every topic.
- [ ] Seeded resources use `quality_status = needs_review`.
- [ ] External resources cannot publish without license and attribution fields.

## Commands

- [ ] `npm run lint` passes or only documents existing non-critical warnings.
- [ ] `npm run build` passes.
- [ ] PHP syntax check passes.
