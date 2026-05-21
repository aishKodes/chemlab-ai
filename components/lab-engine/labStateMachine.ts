export function getNextPhase<TPhase extends string>(phases: TPhase[], current: TPhase) {
  const index = phases.indexOf(current);
  if (index < 0) return phases[0];
  return phases[Math.min(index + 1, phases.length - 1)];
}

export function getPreviousPhase<TPhase extends string>(phases: TPhase[], current: TPhase) {
  const index = phases.indexOf(current);
  if (index <= 0) return phases[0];
  return phases[index - 1];
}

export function getPhaseProgress<TPhase extends string>(phases: TPhase[], current: TPhase) {
  const index = phases.indexOf(current);
  if (index < 0 || phases.length <= 1) return 0;
  return Math.round((index / (phases.length - 1)) * 100);
}

export function isFinalPhase<TPhase extends string>(phases: TPhase[], current: TPhase) {
  return phases[phases.length - 1] === current;
}
