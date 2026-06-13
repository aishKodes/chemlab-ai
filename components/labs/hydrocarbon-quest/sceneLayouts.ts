import { hydrocarbonAssetRoles } from "@/components/labs/hydrocarbon-quest/assetManifest";
import { hydrocarbonQuestAssets } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import type { HydrocarbonCharacter, HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export type CharacterAssetConfig = {
  id: string;
  src: string;
  alt: string;
  naturalRole: "student" | "teacher";
  anchor: {
    footX: number;
    footY: number;
  };
  defaultScale: number;
  faceDirection: "left" | "right";
  cropPadding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type StageCharacterPlacement = {
  footX: number;
  scale: number;
  flipX: boolean;
  shadowStrength?: number;
};

export type StageBoardArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StageCamera = {
  x: number;
  y: number;
  zoom: number;
};

export type HydrocarbonSceneLayout = {
  id: "classroom" | "rule" | "puzzle" | "portal" | "final";
  backgroundSrc: string;
  integratedCharacters?: boolean;
  groundY: number;
  kabir: StageCharacterPlacement;
  aparna: StageCharacterPlacement;
  boardArea?: StageBoardArea;
  dialogueSafeArea: StageBoardArea;
  camera: StageCamera;
};

type CharacterAssetKey =
  | "kabirReference"
  | "kabirConfused"
  | "kabirSuccess"
  | "aparnaReference"
  | "aparnaExplaining"
  | "aparnaWarning"
  | "aparnaCelebrating";

export const characterAssetConfigs: Record<CharacterAssetKey, CharacterAssetConfig> = {
  kabirReference: {
    id: "kabir-reference",
    src: hydrocarbonQuestAssets.kabirReference.webPath,
    alt: "Kabir listening",
    naturalRole: "student",
    anchor: { footX: 0.501, footY: 0.957 },
    defaultScale: 0.54,
    faceDirection: "right",
  },
  kabirConfused: {
    id: "kabir-confused",
    src: hydrocarbonQuestAssets.kabirConfused.webPath,
    alt: "Kabir confused",
    naturalRole: "student",
    anchor: { footX: 0.503, footY: 0.957 },
    defaultScale: 0.54,
    faceDirection: "right",
  },
  kabirSuccess: {
    id: "kabir-success",
    src: hydrocarbonQuestAssets.kabirSuccess.webPath,
    alt: "Kabir celebrating",
    naturalRole: "student",
    anchor: { footX: 0.48, footY: 0.957 },
    defaultScale: 0.54,
    faceDirection: "right",
  },
  aparnaReference: {
    id: "aparna-reference",
    src: hydrocarbonQuestAssets.aparnaReference.webPath,
    alt: "Aparna ma'am listening",
    naturalRole: "teacher",
    anchor: { footX: 0.49, footY: 0.973 },
    defaultScale: 0.58,
    faceDirection: "left",
  },
  aparnaExplaining: {
    id: "aparna-explaining",
    src: hydrocarbonQuestAssets.aparnaExplaining.webPath,
    alt: "Aparna ma'am explaining",
    naturalRole: "teacher",
    anchor: { footX: 0.461, footY: 0.973 },
    defaultScale: 0.58,
    faceDirection: "left",
  },
  aparnaWarning: {
    id: "aparna-warning",
    src: hydrocarbonQuestAssets.aparnaWarning.webPath,
    alt: "Aparna ma'am giving a correction",
    naturalRole: "teacher",
    anchor: { footX: 0.517, footY: 0.973 },
    defaultScale: 0.58,
    faceDirection: "left",
  },
  aparnaCelebrating: {
    id: "aparna-celebrating",
    src: hydrocarbonQuestAssets.aparnaCelebrating.webPath,
    alt: "Aparna ma'am celebrating",
    naturalRole: "teacher",
    anchor: { footX: 0.485, footY: 0.973 },
    defaultScale: 0.58,
    faceDirection: "left",
  },
};

export const assetByCharacterPose: Record<Exclude<HydrocarbonCharacter, "Master Alchem">, Partial<Record<HydrocarbonPose, CharacterAssetKey>>> = {
  Kabir: {
    idle: "kabirReference",
    listening: "kabirReference",
    speaking: "kabirReference",
    confused: "kabirConfused",
    thinking: "kabirConfused",
    warning: "kabirConfused",
    celebrating: "kabirSuccess",
    success: "kabirSuccess",
  },
  Aparna: {
    idle: "aparnaReference",
    listening: "aparnaReference",
    speaking: "aparnaExplaining",
    explaining: "aparnaExplaining",
    thinking: "aparnaExplaining",
    pointing: "aparnaExplaining",
    warning: "aparnaWarning",
    celebrating: "aparnaCelebrating",
    success: "aparnaCelebrating",
  },
};

export const classroomScene: HydrocarbonSceneLayout = {
  id: "classroom",
  backgroundSrc: hydrocarbonAssetRoles.story_classroom_intro.src,
  integratedCharacters: true,
  groundY: 890,
  kabir: {
    footX: 520,
    scale: 0.54,
    flipX: false,
    shadowStrength: 0.34,
  },
  aparna: {
    footX: 1530,
    scale: 0.54,
    flipX: true,
    shadowStrength: 0.36,
  },
  dialogueSafeArea: {
    x: 210,
    y: 800,
    width: 1500,
    height: 180,
  },
  camera: {
    x: 960,
    y: 540,
    zoom: 1,
  },
};

export const ruleScene: HydrocarbonSceneLayout = {
  ...classroomScene,
  id: "rule",
  backgroundSrc: hydrocarbonAssetRoles.story_full_name_analogy.src,
};

export const puzzleScene: HydrocarbonSceneLayout = {
  id: "puzzle",
  backgroundSrc: hydrocarbonAssetRoles.game_board_background_clean.src,
  integratedCharacters: false,
  groundY: 910,
  kabir: {
    footX: 250,
    scale: 0.38,
    flipX: false,
    shadowStrength: 0.24,
  },
  aparna: {
    footX: 1710,
    scale: 0.43,
    flipX: true,
    shadowStrength: 0.28,
  },
  boardArea: {
    x: 390,
    y: 115,
    width: 1130,
    height: 585,
  },
  dialogueSafeArea: {
    x: 310,
    y: 720,
    width: 1410,
    height: 335,
  },
  camera: {
    x: 960,
    y: 540,
    zoom: 1,
  },
};

export const portalScene: HydrocarbonSceneLayout = {
  id: "portal",
  backgroundSrc: hydrocarbonAssetRoles.story_transition_to_lab.src,
  integratedCharacters: true,
  groundY: 910,
  kabir: {
    footX: 310,
    scale: 0.42,
    flipX: false,
    shadowStrength: 0.24,
  },
  aparna: {
    footX: 1650,
    scale: 0.46,
    flipX: true,
    shadowStrength: 0.28,
  },
  dialogueSafeArea: {
    x: 260,
    y: 800,
    width: 1460,
    height: 200,
  },
  camera: {
    x: 960,
    y: 540,
    zoom: 1,
  },
};

export const finalBadgeScene: HydrocarbonSceneLayout = {
  id: "final",
  backgroundSrc: hydrocarbonAssetRoles.completion_celebration.src,
  integratedCharacters: true,
  groundY: 910,
  kabir: {
    footX: 320,
    scale: 0.42,
    flipX: false,
    shadowStrength: 0.18,
  },
  aparna: {
    footX: 1660,
    scale: 0.44,
    flipX: true,
    shadowStrength: 0.2,
  },
  dialogueSafeArea: {
    x: 260,
    y: 800,
    width: 1460,
    height: 200,
  },
  camera: {
    x: 960,
    y: 540,
    zoom: 1,
  },
};

export const sceneLayouts = {
  classroom: classroomScene,
  rule: ruleScene,
  puzzle: puzzleScene,
  portal: portalScene,
  final: finalBadgeScene,
};

export function resolveCharacterConfig(character: Exclude<HydrocarbonCharacter, "Master Alchem">, pose: HydrocarbonPose): CharacterAssetConfig {
  const assetKey = assetByCharacterPose[character][pose] ?? assetByCharacterPose[character].idle;
  return characterAssetConfigs[assetKey ?? (character === "Kabir" ? "kabirReference" : "aparnaReference")];
}

export function placeCharacterOnGround(
  character: CharacterAssetConfig,
  stage: { width: number; height: number },
  options: {
    groundY: number;
    footXOnStage: number;
    scale: number;
    flipX: boolean;
  },
) {
  const imageWidth = 1600 * options.scale;
  const imageHeight = 1600 * options.scale;
  const left = options.footXOnStage - character.anchor.footX * imageWidth;
  const top = options.groundY - character.anchor.footY * imageHeight;

  return {
    left,
    top,
    width: imageWidth,
    height: imageHeight,
    leftPct: `${(left / stage.width) * 100}%`,
    topPct: `${(top / stage.height) * 100}%`,
    widthPct: `${(imageWidth / stage.width) * 100}%`,
    heightPct: `${(imageHeight / stage.height) * 100}%`,
    footX: options.footXOnStage,
    footY: options.groundY,
    footXPct: `${(options.footXOnStage / stage.width) * 100}%`,
    footYPct: `${(options.groundY / stage.height) * 100}%`,
    transformOrigin: `${character.anchor.footX * 100}% ${character.anchor.footY * 100}%`,
  };
}

export function stageAreaStyle(area: StageBoardArea) {
  return {
    left: `${(area.x / STAGE_WIDTH) * 100}%`,
    top: `${(area.y / STAGE_HEIGHT) * 100}%`,
    width: `${(area.width / STAGE_WIDTH) * 100}%`,
    height: `${(area.height / STAGE_HEIGHT) * 100}%`,
  };
}
