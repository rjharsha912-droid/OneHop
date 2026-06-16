import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "info" | "danger" | "accent" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-light text-primary-dark",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  danger: "bg-danger-light text-danger",
  accent: "bg-accent-light text-accent-dark",
  neutral: "bg-line text-body",
};

export function Badge({ tone = "neutral", icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
