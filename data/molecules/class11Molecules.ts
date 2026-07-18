import { ncertMoleculeLibrary } from "./ncertMoleculeLibrary";

export const class11Molecules = ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("11"));
