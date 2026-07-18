export function SaltBridge({ ready, active }: { ready: boolean; active: boolean }) {
  return (
    <div className={`pointer-events-none absolute left-[31%] right-[31%] top-24 h-32 transition-opacity ${ready ? "opacity-100" : "opacity-20"}`}>
      <div className={`h-20 rounded-t-full border-[10px] border-b-0 ${active ? "border-emerald-300 shadow-[0_0_28px_rgba(110,231,183,0.75)]" : "border-slate-300"}`} />
      <p className="mt-1 text-center text-xs font-black uppercase tracking-[0.18em] text-emerald-100">Salt bridge</p>
    </div>
  );
}
