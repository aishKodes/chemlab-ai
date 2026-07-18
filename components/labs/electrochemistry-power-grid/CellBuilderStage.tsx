import type { CellPart } from "./electrochemistryTypes";
import { BeakerHalfCell } from "./BeakerHalfCell";
import { Electrode } from "./Electrode";
import { ElectronWire } from "./ElectronWire";
import { IonFlowLayer } from "./IonFlowLayer";
import { SaltBridge } from "./SaltBridge";

export function CellBuilderStage({
  parts,
  reactionActive,
  ionActive,
}: {
  parts: Set<CellPart>;
  reactionActive: boolean;
  ionActive: boolean;
}) {
  const leftReady = parts.has("zn_solution");
  const rightReady = parts.has("cu_solution");
  const wireReady = parts.has("wire");
  const bridgeReady = parts.has("salt_bridge");
  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[radial-gradient(circle_at_50%_20%,rgba(125,211,252,0.22),transparent_38%),linear-gradient(180deg,#0f172a,#172554)] p-6 shadow-2xl">
      <div className="absolute inset-x-8 bottom-5 h-20 rounded-[100%] bg-black/25 blur-xl" />
      <ElectronWire ready={wireReady} active={reactionActive} />
      <SaltBridge ready={bridgeReady} active={reactionActive || ionActive} />
      <div className="absolute bottom-16 left-[8%] w-[36%]">
        <BeakerHalfCell side="zinc" ready={leftReady} active={reactionActive} />
      </div>
      <div className="absolute bottom-16 right-[8%] w-[36%]">
        <BeakerHalfCell side="copper" ready={rightReady} active={reactionActive} />
      </div>
      {parts.has("zn_electrode") ? <Electrode kind="zinc" active={reactionActive} /> : null}
      {parts.has("cu_electrode") ? <Electrode kind="copper" active={reactionActive} /> : null}
      <IonFlowLayer active={ionActive} />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
        {"Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s)"}
      </div>
    </div>
  );
}
