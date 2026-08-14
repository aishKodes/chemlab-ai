# Final Demo Quality QA

## Chem-Shastri

- [x] Provider order is Gemini, then Groq, then curated fallback.
- [x] Gemini-only, Groq-only, both-key, and no-key routing are covered by `test:chem-shastri-providers`.
- [x] Gemini uses the installed `@google/genai` SDK; Groq uses its OpenAI-compatible chat endpoint.
- [x] `GEMINI_MODEL` and `GROQ_MODEL` override defaults without code changes.
- [x] No API keys are exposed through `NEXT_PUBLIC_*` variables.
- [x] Student chat shows `Testing Mode`, not provider, model, token, budget, or money details.
- [x] English, Hindi, and Bengali direct-answer paths are covered.
- [x] Normal questions get direct answers; unclear references such as "Explain this" request clarification.
- [x] NCERT-only mode uses retrieved approved content or curated answers and gives a clear unsupported-material response.
- [x] One global floating launcher is rendered; `/labs/*` uses the same launcher's compact layout.

## SI Units Battle

- [x] All seven SI base quantities, units, and symbols match the Unit 1 table.
- [x] The battle includes Command Centre, Unit Attack, Conversion Bridge, Precision Shield, Significant Figures Boss, and Final Boss scenes.
- [x] Questions store source reference, exact/adapted status, explanation, and mistake key.
- [x] Source-backed examples include `34.216`, `10.4107`, `0.04597`, `2808`, `12.11 + 18.0 + 1.012`, and `2.5 × 1.25`.
- [x] Adapted exercise concepts include kilometre-to-millimetre/picometre, milligram-to-kilogram, and millilitre-to-litre conversions.
- [x] Precision versus accuracy uses the NCERT Student A/C measurement pattern.
- [x] Soft procedural sound, mute, streak, XP, feedback, and responsive layouts are present.
- [x] The related quick drill uses the same source-backed dataset in offline fallback and an idempotent Hostinger seeder.

Source backbone: NCERT Class 11 Chemistry, Unit 1, *Some Basic Concepts of Chemistry*: SI base units table, measurement and significant-figure examples, precision/accuracy example, and Unit 1 exercises.

## Molecule Explorer

- [x] Canonical public route is `/labs/molecule-shapes-3d`.
- [x] `/simulations/molecule-explorer` redirects to the canonical route and is absent from the lab catalog.
- [x] The local library contains 45 models; the required 20 Class 10-12 structures are covered.
- [x] Every model has local coordinates, coordinate-source metadata, accuracy level, topic mapping, and review notes.
- [x] Idealized VSEPR and simplified school-level models are labeled honestly.
- [x] Search, filters, labels, lone pairs, bond angles, reset, and Chem-Shastri context are available.

## Branding And Forms

- [x] Student-facing Next.js source uses `chemlearning` and `Chem-Shastri`.
- [x] Public backend seed/email strings use `chemlearning`; legacy PHP namespaces and storage keys remain unchanged for compatibility.
- [x] Demo name fields use `Aishwaryam` only as placeholder text.

## Automated Results

- [x] `npm run test:chem-shastri-context`
- [x] `npm run test:chem-shastri-providers`
- [x] `npm run test:chem-shastri-page-context`
- [x] `npm run test:chem-shastri-live`
- [x] `npm run test:si-units-battle`
- [x] `npm run test:molecule-library`
- [x] `npm run build`
- [x] PHP syntax check for all `hostinger-backend/*.php`
- [x] Hostinger package SQL/package sanity checker

`npm run lint` passes with existing non-blocking `next/image` warnings in Redox asset/debug components. These warnings are unrelated to the focused demo changes and do not affect compilation.
