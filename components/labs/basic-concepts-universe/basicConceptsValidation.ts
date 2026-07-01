import type { Checkpoint } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function validateCheckpointAnswer(checkpoint: Checkpoint, answer: string) {
  return {
    correct: checkpoint.answer === answer,
    message: checkpoint.answer === answer ? checkpoint.explanation : "Try again. Choose the answer that matches the visible evidence.",
  };
}

export function isZoneCheckpointComplete(checkpoints: Checkpoint[], answers: Record<number, string>) {
  return checkpoints.every((checkpoint, index) => answers[index] === checkpoint.answer);
}
