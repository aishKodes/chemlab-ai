export function Electrode({ kind, active }: { kind: "zinc" | "copper"; active: boolean }) {
  const isZinc = kind === "zinc";
  return (
    <div
      className={`absolute top-20 h-48 w-8 rounded-b-xl rounded-t-sm border shadow-lg transition-all duration-700 ${
        isZinc ? "left-[26%] border-slate-400 bg-gradient-to-b from-slate-200 to-slate-500" : "right-[26%] border-orange-500 bg-gradient-to-b from-orange-300 to-orange-700"
      } ${active ? (isZinc ? "scale-x-90 opacity-90" : "shadow-orange-300/80 ring-4 ring-orange-300/30") : ""}`}
    />
  );
}
