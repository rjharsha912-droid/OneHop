import { useState } from "react";
import { Map, UtensilsCrossed, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { foodApi, type Restaurant } from "@/lib/api";

const FOOD_GRADIENTS = [
  "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
  "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)",
  "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  "linear-gradient(135deg, #e3483a 0%, #ffb199 100%)",
];

const FILTERS = ["All", "Veg", "Non-Veg", "Cafes", "Street Food"] as const;
type FilterType = typeof FILTERS[number];

const CITIES = ["Goa", "Ooty", "Mumbai", "Delhi", "Jaipur"];

export default function Food() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();

  const [active, setActive] = useState<FilterType>("All");
  const [selectedCity, setSelectedCity] = useState(itinerary?.city ?? "Goa");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchFood = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await foodApi.searchRestaurants(selectedCity);
      setRestaurants(data.restaurants);
      setSearched(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Could not fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = active === "All"
    ? restaurants
    : restaurants.filter((r) => r.type === active);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Best Food Near You"
        subtitle={searched ? `${filtered.length} restaurants found` : "Search by city"}
        right={
          <button type="button" className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink">
            <Map size={18} />
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
        <Button onClick={searchFood}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

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
                active === f ? "bg-primary text-white" : "bg-surface text-body shadow-card border border-line"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Restaurant list */}
      {searched && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((r, idx) => (
            <div
              key={r.name}
              className="rounded-2xl bg-surface shadow-card overflow-hidden"
            >
              {/* Gradient banner */}
              <div
                className="h-2 w-full"
                style={{ background: FOOD_GRADIENTS[idx % FOOD_GRADIENTS.length] }}
              />
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-ink">{r.name}</p>
                    <p className="text-xs text-muted">{r.cuisine} · {r.location}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-success-light px-2 py-0.5">
                    <Star size={10} className="text-success fill-success" />
                    <span className="text-xs font-bold text-success">{r.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted">🍽 {r.specialty}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">₹{r.avg_cost_per_person} per person</span>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    r.type === "Veg" ? "bg-success-light text-success" :
                    r.type === "Cafes" ? "bg-info-light text-info" :
                    r.type === "Street Food" ? "bg-warning-light text-warning" :
                    "bg-error-light text-error"
                  )}>
                    {r.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && filtered.length === 0 && !loading && (
        <p className="text-center text-sm text-muted py-8">No restaurants for this filter. Try "All".</p>
      )}

      {!searched && !loading && (
        <div className="text-center py-8">
          <UtensilsCrossed size={40} className="mx-auto text-muted mb-3" />
          <p className="text-sm text-muted">Select a city and click Search to find restaurants!</p>
        </div>
      )}

      <p className="text-center text-xs text-muted">
        ✅ Trusted & Hygienic — All restaurants verified for quality.
      </p>
    </div>
  );
}