import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GameBoardShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border-2 border-cyan-100/80 bg-slate-950/18 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-md",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.30),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(250,204,21,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(224,242,254,0.34))]" />
      <div className="absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      {children}
    </div>
  );
}
