import { useState } from "react";
import { Map, UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { RestaurantCard } from "@/components/common/RestaurantCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FOOD_GRADIENTS = [
  "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
  "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)",
  "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  "linear-gradient(135deg, #e3483a 0%, #ffb199 100%)",
];

const FILTERS = ["All", "Veg", "Non-Veg", "Cafes", "Street Food"] as const;
type Filter = typeof FILTERS[number];

export default function Food() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [active, setActive] = useState<Filter>("All");

  const allRestaurants = itinerary
    ? itinerary.day_wise_plan.map((d) => d.recommended_restaurant)
    : [];
  // De-duplicate by name using reduce to avoid JSX parser confusion with new Map()
  const unique = allRestaurants.reduce<typeof allRestaurants>((acc, r) => {
    if (!acc.find((x) => x.name === r.name)) acc.push(r);
    return acc;
  }, []);

  if (!itinerary || unique.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Best Food Near You" />
        <EmptyState
          icon={<UtensilsCrossed size={28} />}
          title="No food recommendations yet"
          description="Plan a trip and OneHop will suggest the best local eats for every day."
          action={<Button onClick={() => navigate("/chat")}>Plan a trip</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Best Food Near You"
        subtitle={`${itinerary.city} · Curated by OneHop AI`}
        right={
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
          >
            <Map size={18} />
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

      {/* Restaurant list */}
      <div className="space-y-3">
        {unique.map((r, idx) => (
          <RestaurantCard
            key={r.name}
            restaurant={r}
            gradient={FOOD_GRADIENTS[idx % FOOD_GRADIENTS.length]}
          />
        ))}
      </div>

      {/* View on map CTA */}
      <Button
        fullWidth
        size="lg"
        icon={<Map size={18} />}
        onClick={() => {}}
      >
        View on Map
      </Button>

      <p className="text-center text-xs text-muted">
        ✅ Trusted & Hygienic — All restaurants are verified for hygiene and quality.
      </p>
    </div>
  );
}
