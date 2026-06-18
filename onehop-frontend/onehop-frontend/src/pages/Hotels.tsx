import { useState } from "react";
import { Filter, SortAsc, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { HotelCard } from "@/components/common/HotelCard";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Hotel as HotelIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { hotelApi, type Hotel } from "@/lib/api";

const HOTEL_GRADIENTS = [
  "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
];

const FILTERS = ["All", "Resort", "Villa", "Budget", "Luxury", "Heritage"] as const;
type FilterType = typeof FILTERS[number];

const CITIES = ["Goa", "Ooty", "Mumbai", "Delhi", "Jaipur"];

export default function Hotels() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();

  const [active, setActive] = useState<FilterType>("All");
  const [selectedCity, setSelectedCity] = useState(itinerary?.city ?? "Goa");
  const [hotels, setHotels] = useState<Hotel[]>(itinerary?.recommended_hotels ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(!!itinerary);

  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelApi.searchHotels(selectedCity);
      setHotels(data.hotels);
      setSearched(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Could not fetch hotels.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = active === "All"
    ? hotels
    : hotels.filter((h) => h.type === active);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Hotels"
        subtitle={searched ? `${filtered.length} hotels found` : "Search hotels by city"}
        right={
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
          >
            <SortAsc size={18} />
          </button>
        }
      />

      {/* City Search */}
      <div className="flex gap-2">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Button onClick={searchHotels}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Filter pills */}
      {searched && (
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
      )}

      {/* Hotel list */}
      {searched && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((hotel, idx) => (
            <HotelCard
              key={hotel.name}
              hotel={hotel}
              gradient={HOTEL_GRADIENTS[idx % HOTEL_GRADIENTS.length]}
            />
          ))}
        </div>
      )}

      {searched && filtered.length === 0 && !loading && (
        <div className="text-center py-8 text-muted text-sm">
          No hotels found for this filter. Try "All".
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-8">
          <HotelIcon size={40} className="mx-auto text-muted mb-3" />
          <p className="text-sm text-muted">Select a city and click Search to find hotels!</p>
        </div>
      )}

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
    </div>
  );
}