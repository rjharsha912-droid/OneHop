import { CloudRain, TrafficCone, Bus } from "lucide-react";
import { Card } from "@/components/ui/Card";

const UPDATES = [
  {
    icon: <CloudRain size={18} />,
    iconBg: "bg-info-light text-info",
    title: "28°C",
    subtitle: "Light Rain",
    meta: "Coimbatore",
    cardBg: "bg-info-light/60",
  },
  {
    icon: <TrafficCone size={18} />,
    iconBg: "bg-warning-light text-warning",
    title: "Traffic",
    subtitle: "Moderate",
    meta: "Mettupalayam Rd",
    cardBg: "bg-warning-light/60",
  },
  {
    icon: <Bus size={18} />,
    iconBg: "bg-success-light text-success",
    title: "Bus 447",
    subtitle: "Delayed",
    meta: "+15 min",
    cardBg: "bg-success-light/60",
  },
];

export function LiveUpdates() {
  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-ink">Live Updates</h2>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {UPDATES.map((u) => (
          <Card key={u.title} className={`${u.cardBg} border-none p-3 shadow-none`}>
            <div className={`mb-2 flex size-8 items-center justify-center rounded-full ${u.iconBg}`}>
              {u.icon}
            </div>
            <p className="text-sm font-bold text-ink leading-tight">{u.title}</p>
            <p className="text-xs text-body">{u.subtitle}</p>
            <p className="mt-1 truncate text-[11px] text-muted">{u.meta}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
