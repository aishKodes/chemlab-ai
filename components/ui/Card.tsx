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
        "glass-panel rounded-[1.5rem] p-5",
        interactive &&
          "transition duration-200 hover:-translate-y-1 hover:rotate-[0.2deg] hover:border-blue-300/45",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
