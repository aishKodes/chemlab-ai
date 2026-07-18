import { calculateDaniellCellVoltage, validateConcentration } from "../components/labs/electrochemistry-power-grid/electrochemistryCalculations";

const standard = calculateDaniellCellVoltage({ zn2Concentration: 1, cu2Concentration: 1, temperatureK: 298 });
const highCopper = calculateDaniellCellVoltage({ zn2Concentration: 1, cu2Concentration: 2, temperatureK: 298 });
const highZinc = calculateDaniellCellVoltage({ zn2Concentration: 2, cu2Concentration: 1, temperatureK: 298 });

const checks = [
  { name: "standard state is about 1.10 V", ok: Math.abs(standard - 1.1) < 0.005, value: standard },
  { name: "higher Cu2+ increases voltage", ok: highCopper > standard, value: highCopper },
  { name: "higher Zn2+ decreases voltage", ok: highZinc < standard, value: highZinc },
];

let invalidRejected = false;
try {
  validateConcentration(0);
} catch {
  invalidRejected = true;
}
checks.push({ name: "zero concentration rejected", ok: invalidRejected, value: 0 });

for (const check of checks) {
  console.log(JSON.stringify(check));
  if (!check.ok) process.exitCode = 1;
}
