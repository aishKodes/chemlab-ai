import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export function Card({ children, className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-lg p-5",
        interactive &&
          "transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-white/[0.09]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
