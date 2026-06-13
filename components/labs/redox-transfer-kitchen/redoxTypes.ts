export type RedoxAssetRole =
  | "story_confused_kitchen"
  | "story_empty_kitchen"
  | "karthik_confused_character"
  | "karthik_realization_character"
  | "paati_explaining_character"
  | "paati_giving_murukku_character"
  | "story_guidance_kitchen"
  | "transition_kitchen_to_science"
  | "redox_game_board_background"
  | "redox_success_or_magic_background";

export type RedoxAssetKind = "story" | "character" | "game" | "success";

export type RedoxAssetEntry = {
  role: RedoxAssetRole;
  label: string;
  rawFile: string;
  rawSrc: string;
  src: string;
  kind: RedoxAssetKind;
  width: number;
  height: number;
  hasAlpha: boolean;
  checkerboardSuspected: boolean;
  usedIn: "story" | "game" | "success" | "story-character";
  note: string;
};

export type RedoxSpeaker = "Karthik" | "Jaya Paati" | "Chemlab";

export type RedoxCameraMotion = "slow_zoom" | "pan_left" | "pan_right" | "none";

export type RedoxStoryFrame = {
  id: string;
  assetRole: RedoxAssetRole;
  speaker: RedoxSpeaker;
  text: string;
  voiceText?: string;
  cameraMotion: RedoxCameraMotion;
  duration: number;
  overlay?: "murukku_transfer" | "equation_strip" | "naming_board" | "start_game";
  characterRoles?: RedoxAssetRole[];
};

export type RedoxLevelId =
  | "murukku_transaction"
  | "electron_transaction"
  | "oxidation_gate"
  | "reduction_gate"
  | "spectator_cleanup"
  | "simultaneous_redox"
  | "agents_challenge";

export type RedoxGameMode = "game" | "explore";

export type RedoxStep = "objective" | "action" | "result";

export type RedoxLedgerState = {
  giverIdentified: boolean;
  receiverIdentified: boolean;
  electronsTransferred: boolean;
  oxidationDetected: boolean;
  reductionDetected: boolean;
  spectatorRemoved: boolean;
  redoxLinked: boolean;
};

export type RedoxLevel = {
  id: RedoxLevelId;
  title: string;
  learningGoal: string;
  objective: string;
  equation?: string;
  paatiHint: string;
  chemistryExplanation: string;
  successMessage: string;
  xp: number;
  interactions: string[];
};

export type RedoxChallengeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type RedoxFeedback = {
  correct: boolean;
  message: string;
  hint?: string;
};

export type RedoxSoundEvent =
  | "murukku_transfer_start"
  | "murukku_received"
  | "electron_release"
  | "electron_travel"
  | "ion_transform"
  | "correct_answer"
  | "wrong_answer_soft"
  | "ledger_check"
  | "level_complete"
  | "badge_unlock"
  | "transition_whoosh";
