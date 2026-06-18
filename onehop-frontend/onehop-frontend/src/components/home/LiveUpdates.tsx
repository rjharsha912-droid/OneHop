import { CloudRain, TrafficCone, Bus, Zap } from "lucide-react";

const UPDATES = [
  {
    Icon: CloudRain,
    color: "#0077b6",
    bg: "#e0f0ff",
    title: "28°C",
    subtitle: "Light Rain",
    meta: "Coimbatore",
    badge: "LIVE",
    badgeBg: "#0077b6",
  },
  {
    Icon: TrafficCone,
    color: "#e08a00",
    bg: "#fff4e0",
    title: "Moderate",
    subtitle: "Traffic",
    meta: "Mettupalayam Rd",
    badge: "ALERT",
    badgeBg: "#e08a00",
  },
  {
    Icon: Bus,
    color: "#e3483a",
    bg: "#fdeeec",
    title: "Bus 447",
    subtitle: "Delayed +15m",
    meta: "Next stop",
    badge: "DELAY",
    badgeBg: "#e3483a",
  },
];

export function LiveUpdates() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-extrabold text-ink">Live Updates</h2>
        <span className="flex items-center gap-1 rounded-full bg-[#e3483a] px-2 py-0.5 text-[10px] font-extrabold text-white">
          <Zap size={9} fill="white" /> LIVE
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {UPDATES.map(({ Icon, color, bg, title, subtitle, meta, badge, badgeBg }) => (
          <div
            key={title}
            className="rounded-2xl p-3 animate-fade-in-up"
            style={{ background: bg }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="flex size-9 items-center justify-center rounded-xl"
                style={{ background: `${color}22` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg text-white"
                style={{ background: badgeBg }}
              >
                {badge}
              </span>
            </div>
            <p className="text-sm font-extrabold text-ink">{title}</p>
            <p className="text-xs font-medium text-body">{subtitle}</p>
            <p className="mt-0.5 truncate text-[10px] text-muted">{meta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}