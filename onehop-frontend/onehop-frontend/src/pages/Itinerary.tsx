import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Users, MapPin, Download, Share2,
  Hotel as HotelIcon, Car, Sparkles
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/itinerary/StatCard";
import { DayPlanCard } from "@/components/itinerary/DayPlanCard";
import { BudgetBreakdown } from "@/components/itinerary/BudgetBreakdown";
import { HotelCard } from "@/components/common/HotelCard";
import { TransportCard } from "@/components/common/TransportCard";
import { DESTINATION_GRADIENTS } from "@/components/common/DestinationCard";
import { formatINR } from "@/lib/utils";

type Tab = "itinerary" | "stay" | "travel" | "budget";

const TABS: { id: Tab; label: string }[] = [
  { id: "itinerary", label: "Itinerary" },
  { id: "stay", label: "Stay" },
  { id: "travel", label: "Travel" },
  { id: "budget", label: "Budget" },
];

const HOTEL_GRADIENTS = [
  "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
];

export default function Itinerary() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [tab, setTab] = useState<Tab>("itinerary");

  if (!itinerary) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Trip Itinerary" />
        <EmptyState
          icon={<Sparkles size={28} />}
          title="No itinerary yet"
          description="Chat with OneHop AI to plan your perfect trip and your detailed itinerary will appear here."
          action={
            <Button onClick={() => navigate("/chat")} icon={<Sparkles size={16} />}>
              Plan with OneHop AI
            </Button>
          }
        />
      </div>
    );
  }

  const cityKey = itinerary.city.toLowerCase();
  const gradient =
    DESTINATION_GRADIENTS[cityKey] ?? "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title={`${itinerary.city} Trip`}
        subtitle={`${itinerary.duration} · ${itinerary.travellers} Travellers`}
        right={
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Share"
              className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              aria-label="Download"
              className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
            >
              <Download size={18} />
            </button>
          </div>
        }
      />

      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-card p-5 text-white"
        style={{ background: gradient }}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-white/70">AI-generated plan</p>
        <h2 className="mt-1 text-2xl font-extrabold">{itinerary.city}</h2>
        <p className="mt-1 text-sm text-white/85">
          Departure from {itinerary.departure_city}
        </p>
        <div className="mt-3 flex gap-4 text-sm text-white/90">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {itinerary.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {itinerary.travellers} travellers
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {itinerary.city}
          </span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <StatCard icon={<Calendar size={14} />} label="Duration" value={itinerary.duration} />
        <StatCard icon={<HotelIcon size={14} />} label="Hotels" value={itinerary.recommended_hotels.length} />
        <StatCard
          icon={<Car size={14} />}
          label="Activities"
          value={itinerary.day_wise_plan.reduce((s, d) => s + d.places_to_visit.length, 0)}
        />
        <StatCard
          icon={<Sparkles size={14} />}
          label="Est. Cost"
          value={formatINR(itinerary.cost_estimate.total_estimated)}
        />
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* Tab content */}
      {tab === "itinerary" && (
        <div className="space-y-4">
          {itinerary.day_wise_plan.map((day) => (
            <DayPlanCard key={day.day} day={day} />
          ))}
        </div>
      )}

      {tab === "stay" && (
        <div className="space-y-3">
          {itinerary.recommended_hotels.map((hotel, idx) => (
            <HotelCard
              key={hotel.name}
              hotel={hotel}
              gradient={HOTEL_GRADIENTS[idx % HOTEL_GRADIENTS.length]}
            />
          ))}
        </div>
      )}

      {tab === "travel" && (
        <div className="space-y-3">
          {itinerary.recommended_transport.map((t) => (
            <TransportCard key={t.type} option={t} />
          ))}
        </div>
      )}

      {tab === "budget" && <BudgetBreakdown cost={itinerary.cost_estimate} />}

      {/* Book CTA */}
      <Button
        fullWidth
        size="lg"
        onClick={() => navigate("/booking-confirmation")}
        icon={<Sparkles size={18} />}
      >
        Book This Plan
      </Button>
    </div>
  );
}
