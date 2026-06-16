import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RingIcon {
  icon: ReactNode;
  /** Position on the ring in degrees, 0 = top, clockwise */
  angle: number;
  tone?: "primary" | "accent" | "info" | "success" | "warning";
}

interface IllustrationRingProps {
  center: ReactNode;
  icons: RingIcon[];
  className?: string;
}

const toneClasses: Record<string, string> = {
  primary: "bg-primary-light text-primary",
  accent: "bg-accent-light text-accent",
  info: "bg-info-light text-info",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
};

export function IllustrationRing({ center, icons, className }: IllustrationRingProps) {
  const radius = 46; // percentage of half-width

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[280px]", className)}>
      {/* Dashed orbit */}
      <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-primary-soft" />

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
          {center}
        </div>
      </div>

      {/* Orbiting icons */}
      {icons.map((item, idx) => {
        const rad = (item.angle - 90) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <div
            key={idx}
            className={cn(
              "absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-card",
              toneClasses[item.tone ?? "primary"]
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
