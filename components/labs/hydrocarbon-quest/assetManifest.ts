import { hydrocarbonQuestAssetManifest } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";

export type HydrocarbonAssetRole =
  | "story_classroom_intro"
  | "story_full_name_analogy"
  | "story_transition_to_lab"
  | "game_board_background_clean"
  | "game_board_background_futuristic"
  | "level_1_visual_reference"
  | "level_2_visual_reference"
  | "level_3_visual_reference"
  | "quest_map_background"
  | "completion_celebration";

export type HydrocarbonRoleAsset = {
  role: HydrocarbonAssetRole;
  key: keyof typeof hydrocarbonQuestAssetManifest.assets;
  label: string;
  use: "story" | "map" | "game-background" | "level-reference" | "reward";
  note: string;
  src: string;
  rawPath: string;
  status: "ok" | "missing" | "unsafe";
};

const assets = hydrocarbonQuestAssetManifest.assets;

export const hydrocarbonAssetRoles = {
  story_classroom_intro: roleAsset(
    "story_classroom_intro",
    "sceneFamilyAnalogy",
    "Classroom confusion and family-name setup",
    "story",
    "Chosen as the opening classroom frame because it shows Kabir, Aparna, and the IUPAC teaching board in one cinematic composition.",
  ),
  story_full_name_analogy: roleAsset(
    "story_full_name_analogy",
    "sceneFullNameRule",
    "Full-name analogy teaching frame",
    "story",
    "Used for the First Name / Middle Name / Surname explanation. Any baked text is treated as visual texture; code renders the actual lesson text.",
  ),
  story_transition_to_lab: roleAsset(
    "story_transition_to_lab",
    "scenePortalLab",
    "Transition into the futuristic naming lab",
    "story",
    "Used as the cinematic bridge from classroom story to game-like quest.",
  ),
  game_board_background_clean: roleAsset(
    "game_board_background_clean",
    "sceneCleanPuzzleBoard",
    "Clean interactive molecule board",
    "game-background",
    "Used behind the dynamic SVG molecule and HTML controls. The generated screenshot UI is not used as the real interaction layer.",
  ),
  game_board_background_futuristic: roleAsset(
    "game_board_background_futuristic",
    "sceneAdvancedReference",
    "Senior-secondary futuristic challenge board",
    "level-reference",
    "Used for locked advanced modules and boss previews so the higher-level roadmap has a visual identity.",
  ),
  level_1_visual_reference: roleAsset(
    "level_1_visual_reference",
    "sceneButaneReference",
    "Butane level visual reference",
    "level-reference",
    "Used for the Family Lineage module card and Butane milestone preview.",
  ),
  level_2_visual_reference: roleAsset(
    "level_2_visual_reference",
    "sceneMethylpentaneReference",
    "2-Methylpentane level visual reference",
    "level-reference",
    "Used for Cousin Branches module previews.",
  ),
  level_3_visual_reference: roleAsset(
    "level_3_visual_reference",
    "sceneButeneReference",
    "But-1-ene level visual reference",
    "level-reference",
    "Used for VIP Double Bonds module previews and the But-1-ene playable level.",
  ),
  quest_map_background: roleAsset(
    "quest_map_background",
    "sceneQuestMap",
    "Hydrocarbon quest map",
    "map",
    "Used as the quest map background with clean real module labels rendered in code.",
  ),
  completion_celebration: roleAsset(
    "completion_celebration",
    "sceneFinalBadge",
    "Hydrocarbon Name Master completion scene",
    "reward",
    "Used for the final completion reward scene.",
  ),
} satisfies Record<HydrocarbonAssetRole, HydrocarbonRoleAsset>;

export const hydrocarbonStoryboardFrames = [
  hydrocarbonAssetRoles.story_classroom_intro,
  hydrocarbonAssetRoles.story_full_name_analogy,
  hydrocarbonAssetRoles.story_transition_to_lab,
  hydrocarbonAssetRoles.level_1_visual_reference,
  hydrocarbonAssetRoles.level_2_visual_reference,
  hydrocarbonAssetRoles.level_3_visual_reference,
  hydrocarbonAssetRoles.quest_map_background,
  hydrocarbonAssetRoles.completion_celebration,
];

export const allHydrocarbonRoleAssets = Object.values(hydrocarbonAssetRoles);

function roleAsset(
  role: HydrocarbonAssetRole,
  key: keyof typeof hydrocarbonQuestAssetManifest.assets,
  label: string,
  use: HydrocarbonRoleAsset["use"],
  note: string,
): HydrocarbonRoleAsset {
  const asset = assets[key];
  return {
    role,
    key,
    label,
    use,
    note,
    src: asset.webPath,
    rawPath: asset.rawPath,
    status: asset.status,
  };
}
