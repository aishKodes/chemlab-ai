import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type MasterAlchemAssetRecord = {
  mood: MasterAlchemMood | "reference";
  filename: string;
  originalPath: string;
  quarantinePath: string;
  usedInApp: boolean;
  usable: boolean;
  issue: string;
};

export const masterAlchemAssetInventory: MasterAlchemAssetRecord[] = [
  "avatar",
  "celebrating",
  "hero",
  "idle",
  "lab-guide",
  "pointing",
  "reference",
  "thinking",
  "warning",
].map((name) => ({
  mood: name === "lab-guide" ? "labGuide" : (name as MasterAlchemAssetRecord["mood"]),
  filename: `master-alchem-${name}.png`,
  originalPath: `assets/master-alchem-${name}.png`,
  quarantinePath: `/_quarantine/bad-assets/master-alchem-${name}.png`,
  usedInApp: false,
  usable: false,
  issue: "RGB PNG with baked checkerboard-style background; quarantined and not used in student UI.",
}));

export function resolveMasterAlchemAsset() {
  return null;
}
