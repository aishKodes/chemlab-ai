import { motion } from "framer-motion";

export function IonFlowLayer({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 7 }, (_, index) => (
        <motion.span
          key={`anion-${index}`}
          className="absolute top-[45%] rounded-full bg-violet-200 px-2 py-1 text-[10px] font-black text-violet-900 shadow"
          initial={{ left: "52%", opacity: 0 }}
          animate={{ left: "35%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.45 }}
        >
          NO3-
        </motion.span>
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <motion.span
          key={`cation-${index}`}
          className="absolute top-[53%] rounded-full bg-emerald-200 px-2 py-1 text-[10px] font-black text-emerald-900 shadow"
          initial={{ left: "48%", opacity: 0 }}
          animate={{ left: "65%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.45 }}
        >
          K+
        </motion.span>
      ))}
    </div>
  );
}
