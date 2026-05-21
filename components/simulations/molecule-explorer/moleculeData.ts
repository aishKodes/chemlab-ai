export type MoleculeModel = {
  key: string;
  name: string;
  formula: string;
  geometry: string;
  bondAngle: string;
  whatToNotice: string;
  masterAlchemHint: string;
  viewerStyle: "molecule" | "lattice";
  xyz: string;
};

export const moleculeModels: MoleculeModel[] = [
  {
    key: "water",
    name: "Water",
    formula: "H₂O",
    geometry: "Bent",
    bondAngle: "about 104.5°",
    whatToNotice:
      "Water is not straight. Oxygen has lone pairs that push the hydrogen bonds into a bent shape.",
    masterAlchemHint: "Look for the bend. That shape helps explain why water is polar.",
    viewerStyle: "molecule",
    xyz: `3
water
O 0.000 0.000 0.000
H 0.758 0.584 0.000
H -0.758 0.584 0.000`,
  },
  {
    key: "methane",
    name: "Methane",
    formula: "CH₄",
    geometry: "Tetrahedral",
    bondAngle: "about 109.5°",
    whatToNotice:
      "Four C-H bonds spread evenly in three dimensions, giving methane a tetrahedral shape.",
    masterAlchemHint: "Rotate it slowly. The hydrogens are not flat on a page; they point into 3D space.",
    viewerStyle: "molecule",
    xyz: `5
methane
C 0.000 0.000 0.000
H 0.629 0.629 0.629
H -0.629 -0.629 0.629
H -0.629 0.629 -0.629
H 0.629 -0.629 -0.629`,
  },
  {
    key: "carbon-dioxide",
    name: "Carbon dioxide",
    formula: "CO₂",
    geometry: "Linear",
    bondAngle: "180°",
    whatToNotice:
      "Carbon dioxide has two electron regions around carbon, so they point in opposite directions.",
    masterAlchemHint: "This one is the straight-line molecule. The bond angle is the clue.",
    viewerStyle: "molecule",
    xyz: `3
carbon dioxide
O -1.160 0.000 0.000
C 0.000 0.000 0.000
O 1.160 0.000 0.000`,
  },
  {
    key: "ammonia",
    name: "Ammonia",
    formula: "NH₃",
    geometry: "Trigonal pyramidal",
    bondAngle: "about 107°",
    whatToNotice:
      "Ammonia has three bonds and one lone pair. The lone pair pushes the bonds into a pyramid.",
    masterAlchemHint: "Find the pyramid. The lone pair is invisible, but its push changes the shape.",
    viewerStyle: "molecule",
    xyz: `4
ammonia
N 0.000 0.000 0.110
H 0.000 0.939 -0.274
H 0.813 -0.469 -0.274
H -0.813 -0.469 -0.274`,
  },
  {
    key: "sodium-chloride",
    name: "Sodium chloride",
    formula: "NaCl",
    geometry: "Ionic lattice concept",
    bondAngle: "repeating lattice",
    whatToNotice:
      "Sodium chloride is not one small covalent molecule. It forms a repeating crystal of positive and negative ions.",
    masterAlchemHint: "Do not look for one Na-Cl pair only. The repeating pattern is the important idea.",
    viewerStyle: "lattice",
    xyz: `27
sodium chloride crystal fragment
Na -1.2 -1.2 -1.2
Cl 0.0 -1.2 -1.2
Na 1.2 -1.2 -1.2
Cl -1.2 0.0 -1.2
Na 0.0 0.0 -1.2
Cl 1.2 0.0 -1.2
Na -1.2 1.2 -1.2
Cl 0.0 1.2 -1.2
Na 1.2 1.2 -1.2
Cl -1.2 -1.2 0.0
Na 0.0 -1.2 0.0
Cl 1.2 -1.2 0.0
Na -1.2 0.0 0.0
Cl 0.0 0.0 0.0
Na 1.2 0.0 0.0
Cl -1.2 1.2 0.0
Na 0.0 1.2 0.0
Cl 1.2 1.2 0.0
Na -1.2 -1.2 1.2
Cl 0.0 -1.2 1.2
Na 1.2 -1.2 1.2
Cl -1.2 0.0 1.2
Na 0.0 0.0 1.2
Cl 1.2 0.0 1.2
Na -1.2 1.2 1.2
Cl 0.0 1.2 1.2
Na 1.2 1.2 1.2`,
  },
];

export const linearMoleculeChallenge = {
  question: "Which molecule is linear?",
  correctOptionId: "carbon-dioxide",
  hint: "Look for the molecule with a 180° bond angle.",
  options: [
    { id: "water", label: "Water", feedback: "Water is bent because oxygen has lone pairs." },
    { id: "carbon-dioxide", label: "Carbon dioxide", feedback: "Correct. Carbon dioxide is linear with a 180° bond angle." },
    { id: "ammonia", label: "Ammonia", feedback: "Ammonia is trigonal pyramidal, not linear." },
  ],
};
