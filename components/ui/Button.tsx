import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-cyan-300 text-slate-950 shadow-[0_0_34px_rgba(59,231,200,0.24)] hover:bg-cyan-200",
  secondary:
    "border-white/15 bg-white/10 text-white hover:border-cyan-200/40 hover:bg-white/15",
  ghost: "border-transparent bg-transparent text-slate-200 hover:bg-white/10",
  danger:
    "border-rose-300/30 bg-rose-400/15 text-rose-100 hover:bg-rose-400/25",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type BaseProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
