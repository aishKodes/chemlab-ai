# Live Demo Runbook

This runbook uses the real Chemlab site. There is no presentation-only route.

## Best Demo Order

1. Open `/showcase`.
   - Say: “These are live product experiences, not slides.”
2. Open Chem-Shastri from `/ai-tutor`.
   - Ask: “What is oxidation?”
   - Ask: “Why do oxidation and reduction happen together?”
3. If the selected browser voice is good, click Speak.
   - If it sounds robotic, say browser voice quality depends on the device and skip voice.
4. Open `/labs/redox-transfer-kitchen`.
   - Show Paati’s murukku transaction.
   - Show electron transaction.
   - Emphasize: one transfer creates both oxidation and reduction.
5. Open `/labs/molecule-shapes-3d`.
   - Select H2O, CO2, CH4, NH3.
   - Ask: “Why is water bent?”
6. Open `/labs/basic-concepts-chemistry-universe`.
   - Show Matter World or Mole Portal.
7. Open `/teacher/live`.
   - Show teacher live quiz lobby.
   - If backend is ready, open `/teacher/quizzes` and start a room.
8. Open `/memory-cards`.
   - Show retrieval practice and deck structure.
9. Open `/admin/roadmap`.
   - Show class-wise roadmap and build-next priorities.

## Emergency Fallbacks

| Problem | Fallback |
|---|---|
| AI provider fails | Chem-Shastri uses curated local fallback answers. Continue demo. |
| Backend is unavailable | Use `/showcase`, labs, Molecule Shapes, and local fallback resources. |
| Voice sounds robotic | Turn voice off. Browser speech is manual and optional. |
| Redox lab behaves unexpectedly | Jump to Molecule Shapes 3D, then Basic Concepts Universe. |
| Teacher live quiz backend is down | Show `/teacher/live` lobby and explain the PIN flow; do not force a live room. |
| External resource question comes up | Explain candidates are held in review until license and attribution are verified. |

## Safe Demo Questions

- What is oxidation?
- What is reduction?
- Why do oxidation and reduction happen together?
- What is mole concept?
- What are significant figures?
- What is IUPAC nomenclature?
- Why is water bent?
- What is stoichiometry?

## Do Not Demo As Finished

- Unreviewed external resources.
- Hydrocarbon advanced/future levels as final production polish.
- Teacher live room without confirming backend availability.
- Browser voice as neural-quality speech.

## Final Pre-Demo Commands

```bash
npm run test:chem-shastri-context
npm run test:chem-shastri-live
npm run test:chem-shastri-page-context
npm run lint
npm run build
php scripts/check-hostinger-publichtml-package.php
```
