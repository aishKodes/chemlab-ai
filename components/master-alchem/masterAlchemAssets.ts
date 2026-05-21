import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

type AssetSafety = "approved" | "unsafe" | "missing";

export type MasterAlchemAssetRecord = {
  mood: MasterAlchemMood | "reference";
  filename: string;
  originalPath: string;
  processedPath?: string;
  quarantinePath: string;
  usedInApp: boolean;
  usable: boolean;
  safety: AssetSafety;
  issue: string;
};

const processedUnsafePaths: Partial<Record<MasterAlchemMood | "reference", string>> = {
  avatar: "/processed/public___quarantine__bad-assets__master-alchem-avatar.png",
  celebrating: "/processed/public___quarantine__bad-assets__master-alchem-celebrating.png",
  hero: "/processed/public___quarantine__bad-assets__master-alchem-hero.png",
  idle: "/processed/public___quarantine__bad-assets__master-alchem-idle.png",
  labGuide: "/processed/public___quarantine__bad-assets__master-alchem-lab-guide.png",
  guide: "/processed/public___quarantine__bad-assets__master-alchem-pointing.png",
  reference: "/processed/public___quarantine__bad-assets__master-alchem-reference.png",
  thinking: "/processed/public___quarantine__bad-assets__master-alchem-thinking.png",
  warning: "/processed/public___quarantine__bad-assets__master-alchem-warning.png",
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
  processedPath:
    processedUnsafePaths[name === "lab-guide" ? "labGuide" : name === "pointing" ? "guide" : (name as MasterAlchemMood | "reference")],
  quarantinePath: `/_quarantine/bad-assets/master-alchem-${name}.png`,
  usedInApp: false,
  usable: false,
  safety: "unsafe",
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

export function getRejectedMasterAlchemAssets() {
  return masterAlchemAssetInventory.filter((asset) => asset.safety === "unsafe");
}

export function getMasterAlchemAssetMetadata(mood: MasterAlchemMood) {
  const approved = approvedProcessedAssets[mood];
  if (approved) {
    return {
      mood,
      safety: "approved" as const,
      src: approved,
      reason: "Approved processed Master Alchem asset.",
    };
  }

  const rejected = masterAlchemAssetInventory.find((asset) => asset.mood === mood);
  if (rejected) {
    return {
      mood,
      safety: "unsafe" as const,
      src: rejected.processedPath,
      reason: rejected.issue,
    };
  }

  return {
    mood,
    safety: "missing" as const,
    reason: "No Master Alchem asset exists for this mood; use the SVG/CSS fallback.",
  };
}

export function getMasterAlchemAssetDecision() {
  return "No processed Master Alchem cutout is approved for live use yet; the SVG/CSS mentor is used to avoid checkerboard artifacts.";
}

export function getMasterAlchemFallbackAsset() {
  return null;
}
