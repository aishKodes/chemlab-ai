import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-blue-500 bg-blue-600 text-white shadow-[0_8px_0_rgba(29,78,216,0.35)] hover:-translate-y-0.5 hover:bg-blue-500 active:translate-y-0.5 active:shadow-[0_4px_0_rgba(29,78,216,0.35)]",
  secondary:
    "border-violet-200 bg-white/75 text-violet-800 shadow-[0_6px_0_rgba(124,58,237,0.16)] hover:-translate-y-0.5 hover:bg-violet-50",
  ghost: "border-transparent bg-transparent text-slate-700 hover:bg-white/60 hover:text-blue-700",
  danger:
    "border-rose-400 bg-rose-500 text-white shadow-[0_7px_0_rgba(225,29,72,0.25)] hover:-translate-y-0.5 hover:bg-rose-400",
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
    "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border font-extrabold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
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
