import type { CellPart } from "./electrochemistryTypes";
import { CellBuilderStage } from "./CellBuilderStage";

export function DaniellCell3D(props: { parts: Set<CellPart>; reactionActive: boolean; ionActive: boolean }) {
  return <CellBuilderStage {...props} />;
}
