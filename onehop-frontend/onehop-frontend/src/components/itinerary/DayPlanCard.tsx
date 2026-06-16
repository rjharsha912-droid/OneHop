import { Lightbulb, Clock, Ticket } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RestaurantCard } from "@/components/common/RestaurantCard";
import { DESTINATION_GRADIENTS } from "@/components/common/DestinationCard";
import { getPlaceVisual } from "@/lib/placeIcons";
import { formatINR } from "@/lib/utils";
import type { DayPlan } from "@/types";

const RESTAURANT_GRADIENTS = Object.values(DESTINATION_GRADIENTS);

export function DayPlanCard({ day }: { day: DayPlan }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
          {day.day}
        </span>
        <h3 className="text-base font-bold text-ink">Day {day.day}</h3>
      </div>

      {/* Timeline of places */}
      <div className="space-y-4">
        {day.places_to_visit.map((place, idx) => {
          const { Icon, gradient } = getPlaceVisual(place.type);
          const isLast = idx === day.places_to_visit.length - 1;
          return (
            <div key={place.name} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: gradient }}
                >
                  <Icon size={16} />
                </div>
                {!isLast && <div className="mt-1 w-px flex-1 bg-line" />}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-ink">{place.name}</p>
                  <Badge tone="neutral">{place.type}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted">{place.description}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {place.best_time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Ticket size={12} /> {place.entry_fee > 0 ? formatINR(place.entry_fee) : "Free entry"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restaurant */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Dinner recommendation</p>
        <RestaurantCard
          restaurant={day.recommended_restaurant}
          gradient={RESTAURANT_GRADIENTS[(day.day - 1) % RESTAURANT_GRADIENTS.length]}
        />
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 rounded-2xl bg-info-light p-3 text-sm text-body">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-info" />
        <span>
          <span className="font-semibold text-info">Travel tip: </span>
          {day.tip}
        </span>
      </div>
    </Card>
  );
}
