# Redox Transfer Kitchen QA

Use this checklist before calling the Redox lab ready.

- [ ] Story can be skipped.
- [ ] Level 1 instruction is clear.
- [ ] Murukku transfer is visually obvious.
- [ ] Paati loses counter updates.
- [ ] Karthik gains counter updates.
- [ ] Level 2 starts properly.
- [ ] Two electrons move from Zn to Cu²⁺.
- [ ] Zn becomes Zn²⁺.
- [ ] Cu²⁺ becomes Cu.
- [ ] Level 3 oxidation answer works.
- [ ] Level 4 reduction answer works.
- [ ] Level 5 spectator ion works.
- [ ] Level 6 simultaneous redox works.
- [ ] Level 7 agents challenge works.
- [ ] No 3D rotation in default game mode.
- [ ] Explore 3D mode works separately.
- [ ] Master Alchem icon does not block gameplay.
- [ ] Text does not block visuals.
- [ ] Sounds are soft or no-op safely.
- [ ] Mobile is playable.
- [ ] `npm run build` passes.

## Repair Notes

- Default learning mode is a 2.5D transaction table, not a rotating 3D scene.
- 3D is available only through Explore 3D Mode.
- Level 2 no longer depends on orbit controls or clicking 3D atoms.
- Spectator ion cleanup comes after the electron-transfer concept.
- The transaction ledger updates as the learner proves each concept.
