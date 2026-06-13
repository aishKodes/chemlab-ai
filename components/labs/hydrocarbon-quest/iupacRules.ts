export const rootWordsByCarbonCount: Record<number, string> = {
  1: "Meth",
  2: "Eth",
  3: "Prop",
  4: "But",
  5: "Pent",
  6: "Hex",
  7: "Hept",
  8: "Oct",
  9: "Non",
  10: "Dec",
};

export const hydrocarbonSuffixes = {
  single: "ane",
  double: "ene",
  triple: "yne",
};

export const fullNameAnalogy = [
  {
    title: "First Name",
    chemistry: "Side Branch / Prefix",
    color: "orange",
    example: "methyl, ethyl",
  },
  {
    title: "Middle Name",
    chemistry: "Main Carbon Chain / Root Word",
    color: "blue",
    example: "meth, eth, prop, but, pent",
  },
  {
    title: "Surname",
    chemistry: "Bond Type / Suffix",
    color: "purple",
    example: "ane, ene, yne",
  },
] as const;
