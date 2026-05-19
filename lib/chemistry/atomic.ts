import { periodicTable } from "@/data/periodic-table";

export function getElementByAtomicNumber(atomicNumber: number) {
  return periodicTable.find((element) => element.atomicNumber === atomicNumber);
}

export function getElementBySymbol(symbol: string) {
  return periodicTable.find(
    (element) => element.symbol.toLowerCase() === symbol.trim().toLowerCase(),
  );
}

export function calculateAtomicCharge(protons: number, electrons: number) {
  return protons - electrons;
}

export function calculateMassNumber(protons: number, neutrons: number) {
  return protons + neutrons;
}

export function getShellConfiguration(electrons: number) {
  const capacities = [2, 8, 8, 18, 18, 32];
  let remaining = Math.max(0, Math.floor(electrons));
  const shells: number[] = [];

  for (const capacity of capacities) {
    if (remaining <= 0) break;
    const shellElectrons = Math.min(capacity, remaining);
    shells.push(shellElectrons);
    remaining -= shellElectrons;
  }

  if (remaining > 0) shells.push(remaining);
  return shells;
}

export function describeAtomState(protons: number, neutrons: number, electrons: number) {
  const element = getElementByAtomicNumber(protons);
  const massNumber = calculateMassNumber(protons, neutrons);
  const charge = calculateAtomicCharge(protons, electrons);
  const shellConfiguration = getShellConfiguration(electrons);

  if (!element) {
    return {
      element: null,
      massNumber,
      charge,
      shellConfiguration,
      label: "Unknown atom",
      description:
        "This prototype includes the first 30 elements. Reduce the proton count to inspect a known element.",
    };
  }

  const chargeLabel =
    charge === 0 ? "neutral atom" : charge > 0 ? `${charge}+ cation` : `${Math.abs(charge)}- anion`;
  const isotopeLabel = `${element.name}-${massNumber}`;

  return {
    element,
    massNumber,
    charge,
    shellConfiguration,
    label: `${isotopeLabel} ${chargeLabel}`,
    description: `${element.symbol} has ${protons} protons, ${neutrons} neutrons, and ${electrons} electrons. It is ${charge === 0 ? "neutral" : charge > 0 ? "electron-deficient" : "electron-rich"} in this configuration.`,
  };
}
