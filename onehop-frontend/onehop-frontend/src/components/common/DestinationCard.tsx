import type { ReactNode } from "react";
import { Star, MapPin } from "lucide-react";
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

export function DestinationCard({ name, tag, icon, gradient, rating = 4.5, onClick, className }: DestinationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative h-44 w-36 shrink-0 overflow-hidden rounded-3xl text-left shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.25)] press",
        className
      )}
      style={{ background: gradient }}
    >
      {/* Icon top right */}
      <div className="absolute right-3 top-3 text-white/90 drop-shadow">{icon}</div>

      {/* Rating badge */}
      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-xl bg-black/30 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        <Star size={10} className="fill-white text-white" />
        {rating}
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
        <div className="flex items-center gap-1 mb-0.5">
          <MapPin size={10} className="text-white/80" />
          <p className="text-[10px] text-white/80 font-medium">{tag}</p>
        </div>
        <p className="text-sm font-extrabold text-white">{name}</p>
      </div>
    </button>
  );
}

export const DESTINATION_GRADIENTS: Record<string, string> = {
  ooty:        "linear-gradient(160deg,#2d6a4f 0%,#52b788 100%)",
  goa:         "linear-gradient(160deg,#0077b6 0%,#48cae4 100%)",
  coimbatore:  "linear-gradient(160deg,#f77f00 0%,#fcbf49 100%)",
  wayanad:     "linear-gradient(160deg,#1b4332 0%,#40916c 100%)",
  mumbai:      "linear-gradient(160deg,#560bad 0%,#7b2d8b 100%)",
  delhi:       "linear-gradient(160deg,#c9184a 0%,#ff4d6d 100%)",
  jaipur:      "linear-gradient(160deg,#d62828 0%,#f77f00 100%)",
};