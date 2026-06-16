import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "info" | "accent" | "neutral" | "danger";

interface IconCircleProps {
  icon: ReactNode;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  accent: "bg-accent-light text-accent",
  danger: "bg-danger-light text-danger",
  neutral: "bg-line text-body",
};

const sizeClasses = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
};

export function IconCircle({ icon, tone = "primary", size = "md", className }: IconCircleProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
    >
      {icon}
    </div>
  );
}
