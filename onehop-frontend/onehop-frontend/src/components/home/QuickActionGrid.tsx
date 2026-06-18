import { useNavigate } from "react-router-dom";
import { Car, Plane, Hotel, UtensilsCrossed, Compass, Bus } from "lucide-react";

const ACTIONS = [
  { label: "Commute",  Icon: Car,             color: "#ff6a00", bg: "#fff1e6", to: "/commute"   },
  { label: "Flights",  Icon: Plane,           color: "#0077b6", bg: "#e0f0ff", to: "/transport" },
  { label: "Hotels",   Icon: Hotel,           color: "#1aa15e", bg: "#e7f8ef", to: "/hotels"    },
  { label: "Food",     Icon: UtensilsCrossed, color: "#e3483a", bg: "#fdeeec", to: "/food"      },
  { label: "Explore",  Icon: Compass,         color: "#7c5cfc", bg: "#efe9ff", to: "/chat"      },
  { label: "Bus",      Icon: Bus,             color: "#e08a00", bg: "#fff4e0", to: "/transport" },
];

export function QuickActionGrid() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4 text-base font-extrabold text-ink">What are you looking for?</h2>
      <div className="grid grid-cols-6 gap-1">
        {ACTIONS.map(({ label, Icon, color, bg, to }, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            className={`flex flex-col items-center gap-2 py-2 rounded-2xl press animate-fade-in-up delay-${(idx + 1) * 100}`}
          >
            <div
              className="flex size-14 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: bg }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <span className="text-[11px] font-semibold text-body">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}