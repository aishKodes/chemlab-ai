import { AVOGADRO } from "@/data/constants";

export { AVOGADRO };

export function massToMoles(massGrams: number, molarMass: number) {
  if (molarMass <= 0) return 0;
  return massGrams / molarMass;
}

export function molesToMass(moles: number, molarMass: number) {
  return moles * molarMass;
}

export function molesToParticles(moles: number) {
  return moles * AVOGADRO;
}

export function particlesToMoles(particles: number) {
  return particles / AVOGADRO;
}

export function formatScientific(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(3)} x 10^${exponent}`;
}
