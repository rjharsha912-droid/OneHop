import { useNavigate } from "react-router-dom";
import { Bell, Mountain, Waves, Building2, Trees } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { AskBar } from "@/components/home/AskBar";
import { QuickActionGrid } from "@/components/home/QuickActionGrid";
import { LiveUpdates } from "@/components/home/LiveUpdates";
import { AISuggestionCard } from "@/components/home/AISuggestionCard";
import { PromoBanner } from "@/components/home/PromoBanner";
import { DestinationCard, DESTINATION_GRADIENTS } from "@/components/common/DestinationCard";
import { WeatherWidget } from "@/components/home/WeatherWidget";

const TOP_DESTINATIONS = [
  { name: "Ooty", tag: "Hill Station", icon: <Mountain size={28} />, key: "ooty" },
  { name: "Goa", tag: "Beach", icon: <Waves size={28} />, key: "goa" },
  { name: "Coimbatore", tag: "City", icon: <Building2 size={28} />, key: "coimbatore" },
  { name: "Wayanad", tag: "Nature", icon: <Trees size={28} />, key: "wayanad" },
];

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Traveller";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Hello, {firstName}! 👋</p>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">Where would you like to go today?</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/inbox")}
          aria-label="Notifications"
          className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-surface shadow-card text-ink"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            3
          </span>
        </button>
      </div>

      <AskBar />

      <QuickActionGrid />

      <LiveUpdates />
      <WeatherWidget /> 

      <AISuggestionCard />

      <PromoBanner />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Top Destinations</h2>
          <button type="button" onClick={() => navigate("/trips")} className="text-sm font-semibold text-primary">
            View All
          </button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {TOP_DESTINATIONS.map((dest) => (
            <DestinationCard
              key={dest.name}
              name={dest.name}
              tag={dest.tag}
              icon={dest.icon}
              gradient={DESTINATION_GRADIENTS[dest.key]}
              className="sm:w-full"
              onClick={() =>
                navigate("/chat", { state: { prefill: `I'm planning a trip to ${dest.name}` } })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
