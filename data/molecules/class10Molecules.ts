import { ncertMoleculeLibrary } from "./ncertMoleculeLibrary";

export const class10Molecules = ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("10"));
