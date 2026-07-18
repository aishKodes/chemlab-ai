export type ElectrochemistryLevelId = "build_cell" | "find_electrodes" | "electron_flow" | "ion_flow" | "nernst_lab";

export type CellPart = "zn_electrode" | "cu_electrode" | "zn_solution" | "cu_solution" | "salt_bridge" | "wire" | "voltmeter";

export type ElectrochemistryLevel = {
  id: ElectrochemistryLevelId;
  title: string;
  objective: string;
  xp: number;
};

export type ConcentrationState = {
  zn2Concentration: number;
  cu2Concentration: number;
  temperatureK: number;
};

export type ElectrochemistryProgress = {
  completed: ElectrochemistryLevelId[];
  xp: number;
  badgeUnlocked: boolean;
};

export type IonDirectionAnswer = "anions_to_anode_cations_to_cathode" | "anions_to_cathode_cations_to_anode" | "electrons_through_bridge";
