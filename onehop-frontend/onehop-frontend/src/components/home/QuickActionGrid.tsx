import { useNavigate } from "react-router-dom";
import { Car, Plane, Hotel, UtensilsCrossed, Compass, Grid2x2 } from "lucide-react";
import { IconCircle } from "@/components/ui/IconCircle";

const ACTIONS = [
  { label: "Commute", icon: <Car size={20} />, tone: "primary" as const, to: "/commute" },
  { label: "Trips", icon: <Plane size={20} />, tone: "warning" as const, to: "/trips" },
  { label: "Hotels", icon: <Hotel size={20} />, tone: "info" as const, to: "/hotels" },
  { label: "Food", icon: <UtensilsCrossed size={20} />, tone: "success" as const, to: "/food" },
  { label: "Explore", icon: <Compass size={20} />, tone: "accent" as const, to: "/chat" },
  { label: "More", icon: <Grid2x2 size={20} />, tone: "neutral" as const, to: "/transport" },
];

export function QuickActionGrid() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-ink">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.to)}
            className="flex flex-col items-center gap-2 rounded-2xl py-2 transition-colors hover:bg-line/50"
          >
            <IconCircle icon={action.icon} tone={action.tone} size="lg" />
            <span className="text-xs font-medium text-body">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
