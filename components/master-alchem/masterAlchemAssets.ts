import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type MasterAlchemAssetRecord = {
  mood: MasterAlchemMood | "reference";
  filename: string;
  originalPath: string;
  processedPath?: string;
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
  mood: name === "lab-guide" ? "labGuide" : name === "pointing" ? "guide" : (name as MasterAlchemAssetRecord["mood"]),
  filename: `master-alchem-${name}.png`,
  originalPath: `assets/master-alchem-${name}.png`,
  quarantinePath: `/_quarantine/bad-assets/master-alchem-${name}.png`,
  usedInApp: false,
  usable: false,
  issue: "RGB PNG with baked checkerboard-style background; quarantined and not used in student UI.",
}));

const approvedProcessedAssets: Partial<Record<MasterAlchemMood, string>> = {};

export function resolveMasterAlchemAsset(mood: MasterAlchemMood) {
  const src = approvedProcessedAssets[mood];
  if (!src) return null;
  return { src, alt: `Master Alchem ${mood}` };
}

export function hasApprovedMasterAlchemAsset(mood: MasterAlchemMood) {
  return Boolean(approvedProcessedAssets[mood]);
}

export function getApprovedMasterAlchemAssets() {
  return approvedProcessedAssets;
}

export function getMasterAlchemAssetDecision() {
  return "No processed Master Alchem cutout is approved for live use yet; the SVG/CSS mentor is used to avoid checkerboard artifacts.";
}

export function getMasterAlchemFallbackAsset() {
  return null;
}
