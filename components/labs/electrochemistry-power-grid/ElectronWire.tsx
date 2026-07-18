import { motion } from "framer-motion";

export function ElectronWire({ ready, active }: { ready: boolean; active: boolean }) {
  return (
    <div className={`pointer-events-none absolute left-[26%] right-[26%] top-10 h-16 transition-opacity ${ready ? "opacity-100" : "opacity-20"}`}>
      <div className="absolute left-0 right-0 top-8 h-2 rounded-full bg-slate-900 shadow-lg" />
      {active
        ? Array.from({ length: 8 }, (_, index) => (
            <motion.span
              key={index}
              className="absolute top-6 h-5 w-5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.95)]"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: index * 0.24 }}
            />
          ))
        : null}
      <p className="absolute left-1/2 top-11 -translate-x-1/2 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-cyan-100">{"e- flow: Zn -> Cu"}</p>
    </div>
  );
}
