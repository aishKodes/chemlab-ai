"use client";

import { useReducer } from "react";
import { redoxLevels } from "./redoxQuestData";
import { ElectronTransferGame } from "./ElectronTransferGame";
import { RedoxLevelComplete } from "./RedoxLevelComplete";
import { initialRedoxGameState } from "./redoxGameState";
import { redoxReducer } from "./redoxReducer";
import { useRedoxSound } from "./redoxSoundHooks";

export function RedoxGameEngine({ onRestartStory }: { onRestartStory: () => void }) {
  const [state, dispatch] = useReducer(redoxReducer, initialRedoxGameState);
  const { play } = useRedoxSound();
  const showReward = state.currentLevelIndex >= redoxLevels.length;
  const xp = redoxLevels.filter((item) => state.completedLevels.includes(item.id)).reduce((total, item) => total + item.xp, 0);
  const level = redoxLevels[state.currentLevelIndex];

  function completeTimed(action: () => void, startSound?: Parameters<typeof play>[0], endSound: Parameters<typeof play>[0] = "correct_answer") {
    if (state.isAnimating) return;
    dispatch({ type: "begin_animation" });
    if (startSound) play(startSound);
    window.setTimeout(() => {
      action();
      play(endSound);
      play("ledger_check");
    }, 720);
  }

  function handlePrimaryAction() {
    if (!level) return;
    if (level.id === "murukku_transaction") {
      completeTimed(() => dispatch({ type: "transfer_murukku" }), "murukku_transfer_start", "murukku_received");
      return;
    }
    if (level.id === "electron_transaction") {
      completeTimed(() => dispatch({ type: "transfer_electrons" }), "electron_release", "electron_travel");
      return;
    }
    if (level.id === "simultaneous_redox") {
      completeTimed(() => dispatch({ type: "run_redox" }), "electron_travel", "level_complete");
    }
  }

  function nextLevel() {
    if (state.currentLevelIndex === redoxLevels.length - 1) {
      play("badge_unlock");
    } else {
      play("transition_whoosh");
    }
    dispatch({ type: "next_level" });
  }

  function resetLevel() {
    dispatch({ type: "reset_current_level" });
    play("transition_whoosh");
  }

  if (showReward) {
    return (
      <RedoxLevelComplete
        xp={xp}
        onRestartStory={onRestartStory}
        onReplayGame={() => {
          dispatch({ type: "reset_game" });
        }}
      />
    );
  }

  return <ElectronTransferGame state={state} dispatch={dispatch} onAction={handlePrimaryAction} onNext={nextLevel} onResetLevel={resetLevel} />;
}
