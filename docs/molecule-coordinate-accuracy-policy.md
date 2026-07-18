# Molecule Coordinate Accuracy Policy

Chemlab molecule visuals are teaching models first. They must make shape, bonding, and geometry understandable without pretending to be experimentally optimized structures.

## Coordinate Sources

Every molecule in `data/molecules/` must declare:

- `coordinateSource`
- `accuracyLevel`
- `notes`
- `lastReviewed`

Accepted coordinate source labels:

- `idealized_vsepr`: ideal school-level geometry such as linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral, square planar, and bent shapes.
- `hand_curated`: Chemlab-authored educational coordinates for readable class-level visualization.
- `simplified_lattice`: concept model for ionic solids or extended structures that are not single molecules.
- `external_reviewed`: external coordinates may be used only after license, source, and accuracy review.

## Accuracy Levels

- `idealized`: useful for VSEPR or shape reasoning; not a bond-length-accurate structure.
- `school_level`: suitable for NCERT Class 10-12 conceptual visualization.
- `reviewed`: checked against a reliable source by a reviewer.
- `advanced_reference`: reserved for future source-backed structures.

## Public Display Rules

- Show an accuracy/source badge in the viewer.
- Avoid claiming exact bond lengths or experimental geometry unless the coordinates are source-backed.
- For hydrocarbons and functional groups, prefer clear readable layouts over crowded realism.
- For coordination compounds, show ligand geometry as simplified donor-atom models unless full ligand coordinates are reviewed.
- For ionic solids such as NaCl, label the display as a lattice/concept model, not a discrete molecule.

## Adding A Molecule

Before adding a molecule:

1. Add class levels, chapters, topics, categories, geometry, bond angles, and source notes.
2. Validate atom ids and bonds with `npm run test:molecule-library`.
3. Confirm the molecule appears under the correct class filter.
4. If an external coordinate source is used, record source URL, license, attribution, and review status before public use.

## Review Standard

A molecule can remain in Chemlab if:

- atoms and bonds are internally valid
- labels are readable
- school-level geometry is not misleading
- source and accuracy tags are visible
- validation passes without errors

