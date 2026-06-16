import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DestinationCardProps {
  name: string;
  tag: string;
  icon: ReactNode;
  gradient: string;
  rating?: number;
  onClick?: () => void;
  className?: string;
}

export function DestinationCard({ name, tag, icon, gradient, rating, onClick, className }: DestinationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative h-36 w-40 shrink-0 overflow-hidden rounded-card text-left shadow-card transition-transform hover:-translate-y-0.5 sm:h-40 sm:w-48",
        className
      )}
      style={{ background: gradient }}
    >
      <div className="absolute right-3 top-3 text-white/85">{icon}</div>
      {rating && (
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-pill bg-black/25 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          <Star size={12} className="fill-current" />
          {rating}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-xs text-white/80">{tag}</p>
      </div>
    </button>
  );
}

export const DESTINATION_GRADIENTS: Record<string, string> = {
  ooty: "linear-gradient(135deg, #4f7d6c 0%, #8fb89a 100%)",
  goa: "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  coimbatore: "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  wayanad: "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
  mumbai: "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  delhi: "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)",
  jaipur: "linear-gradient(135deg, #e3483a 0%, #ffb199 100%)",
};
