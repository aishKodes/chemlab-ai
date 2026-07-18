import { ncertMoleculeLibrary } from "../data/molecules/ncertMoleculeLibrary";
import { validateMoleculeLibrary } from "../data/molecules/moleculeValidation";

const required = ["water", "carbon-dioxide", "methane", "ammonia", "boron-trifluoride", "ethene", "ethyne", "benzene"];
const warnings = validateMoleculeLibrary(ncertMoleculeLibrary);
const errors = warnings.filter((warning) => warning.severity === "error");
const missing = required.filter((id) => !ncertMoleculeLibrary.some((molecule) => molecule.id === id));
const missingSource = ncertMoleculeLibrary.filter((molecule) => !molecule.coordinateSource || !molecule.accuracyLevel || !molecule.notes);
const classCounts = {
  class10: ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("10")).length,
  class11: ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("11")).length,
  class12: ncertMoleculeLibrary.filter((molecule) => molecule.classLevels.includes("12")).length,
};

console.log(JSON.stringify({ count: ncertMoleculeLibrary.length, classCounts, errors: errors.length, warnings: warnings.length, missing, missingSource: missingSource.length }));

if (errors.length || missing.length || missingSource.length || ncertMoleculeLibrary.length < 35 || classCounts.class10 < 10 || classCounts.class11 < 15 || classCounts.class12 < 10) {
  process.exitCode = 1;
}
