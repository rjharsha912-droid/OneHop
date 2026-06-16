import { useState } from "react";
import { Filter, SortAsc } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { HotelCard } from "@/components/common/HotelCard";
import { useChatStore } from "@/store/chatStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Hotel as HotelIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const HOTEL_GRADIENTS = [
  "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
];

const FILTERS = ["All", "Resort", "Villa", "Budget", "5★", "4★"] as const;
type Filter = typeof FILTERS[number];

export default function Hotels() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [active, setActive] = useState<Filter>("All");

  if (!itinerary) {
    return (
      <div className="space-y-4">
        <PageHeader title="Hotels" />
        <EmptyState
          icon={<HotelIcon size={28} />}
          title="No hotels to show yet"
          description="Plan a trip with OneHop AI and we'll recommend the best hotels for you."
          action={<Button onClick={() => navigate("/chat")}>Plan a trip</Button>}
        />
      </div>
    );
  }

  const allHotels = itinerary.recommended_hotels;
  const filtered = active === "All" ? allHotels : allHotels.filter(() => true); // real filter would go here

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title={`Hotels in ${itinerary.city}`}
        subtitle={`${itinerary.duration} · 2 Guests`}
        right={
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
          >
            <SortAsc size={18} />
          </button>
        }
      />

      {/* Filter pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "shrink-0 rounded-pill px-4 py-2 text-sm font-semibold transition-colors",
              active === f
                ? "bg-primary text-white"
                : "bg-surface text-body shadow-card border border-line"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Hotel list */}
      <div className="space-y-3">
        {filtered.map((hotel, idx) => (
          <HotelCard
            key={hotel.name}
            hotel={hotel}
            gradient={HOTEL_GRADIENTS[idx % HOTEL_GRADIENTS.length]}
          />
        ))}
      </div>

      {/* Guarantees row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Best Price", icon: "💰" },
          { label: "Free Cancel", icon: "✅" },
          { label: "Secure Pay", icon: "🔒" },
          { label: "24/7 Help", icon: "🎧" },
        ].map((g) => (
          <div key={g.label} className="rounded-2xl bg-surface p-2 shadow-card text-xs text-muted">
            <p className="text-lg">{g.icon}</p>
            {g.label}
          </div>
        ))}
      </div>

      {/* Filter button */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3 text-sm font-semibold text-ink shadow-card"
      >
        <Filter size={16} className="text-primary" /> Filter
      </button>
    </div>
  );
}
