# Chemlab Asset Inventory

The current runtime uses only clean full-scene background assets from `assets/`.
Object cutouts with baked checkerboard-looking backgrounds were moved to
`public/_quarantine/bad-assets/` and are not referenced by student-facing pages.

See `docs/rescue-audit.md` for the full rescue decision log.

## Runtime Assets

| File | Status | Use |
| --- | --- | --- |
| `assets/chemlab-classroom.png` | Clean | Story Lab preview and dev preview |
| `assets/chemlab-magical-lab-background.png` | Clean | Homepage hero and Neutralization Studio intro |
| `assets/chemlab-virtual-lab-bench.png` | Clean | Neutralization Studio lab stage and Story Lab preview |

## Quarantined Assets

The following files are available for inspection on `/dev/assets` but are not used
in the app experience until regenerated with real transparency.

- `public/_quarantine/bad-assets/master-alchem-*.png`
- `public/_quarantine/bad-assets/student-girl-*.png`
- `public/_quarantine/bad-assets/acid-beaker.png`
- `public/_quarantine/bad-assets/base-beaker.png`
- `public/_quarantine/bad-assets/mixing-beaker-empty.png`
- `public/_quarantine/bad-assets/indicator-bottle.png`
- `public/_quarantine/bad-assets/ph-meter.png`
- `public/_quarantine/bad-assets/evaporation-dish-heating-plate.png`
- `public/_quarantine/bad-assets/salt-crystals.png`

## Current Runtime Replacements

| Need | Replacement |
| --- | --- |
| Chem-Shastri | Original SVG/CSS mentor in `components/master-alchem/MasterAlchem.tsx` |
| Acid/base beakers | SVG/CSS vessels in `components/labs/NeutralizationStudio.tsx` |
| Mixing beaker | SVG/CSS pH-responsive beaker in `NeutralizationStudio` |
| pH meter | UI evidence panel plus SVG lab scene |
| Evaporation dish and crystals | SVG/CSS objects in `NeutralizationStudio` |

