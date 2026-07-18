import { ncertMoleculeLibrary } from "./ncertMoleculeLibrary";

export const class12Molecules = ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("12"));
