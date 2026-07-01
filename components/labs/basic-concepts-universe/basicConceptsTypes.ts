export type UniverseZoneId =
  | "matter-world"
  | "measurement-lab"
  | "chemical-laws-court"
  | "mole-portal"
  | "formula-detective"
  | "stoichiometry-factory";

export type UniverseZoneStatus = "playable" | "preview";

export type UniverseZone = {
  id: UniverseZoneId;
  title: string;
  subtitle: string;
  objective: string;
  status: UniverseZoneStatus;
  badge: string;
  xp: number;
};

export type SubstanceCard = {
  formula: string;
  name: string;
  molarMass: number;
  atoms: Record<string, number>;
};

export type MatterSample = {
  name: string;
  correctCategory: "element" | "compound" | "homogeneous mixture" | "heterogeneous mixture";
  clue: string;
};

export type Checkpoint = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type StoichiometryResult = {
  limitingReagent: "N2" | "H2" | "balanced";
  ammoniaMoles: number;
  leftoverN2: number;
  leftoverH2: number;
};
