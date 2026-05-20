import { cn } from "@/lib/utils";

export function ColourfulGradientBlob({
  className,
  tone = "blue",
}: {
  className?: string;
  tone?: "blue" | "pink" | "green" | "amber";
}) {
  const tones = {
    blue: "from-sky-300 via-blue-300 to-violet-300",
    pink: "from-fuchsia-300 via-pink-300 to-orange-200",
    green: "from-lime-200 via-emerald-200 to-cyan-200",
    amber: "from-amber-200 via-orange-200 to-rose-200",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full bg-gradient-to-br opacity-60 blur-3xl",
        tones[tone],
        className,
      )}
      aria-hidden="true"
    />
  );
}
