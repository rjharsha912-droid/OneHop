import { MapPin, Star, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  gradient: string;
  onSelect?: () => void;
}

export function RestaurantCard({ restaurant, gradient, onSelect }: RestaurantCardProps) {
  return (
    <Card interactive={!!onSelect} onClick={onSelect} className="flex gap-3">
      <div
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-white sm:size-20"
        style={{ background: gradient }}
      >
        <UtensilsCrossed size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-ink">{restaurant.name}</h3>
          <Badge tone="success" icon={<Star size={11} className="fill-current" />}>
            {restaurant.rating}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted">{restaurant.cuisine}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> {restaurant.location}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-extrabold text-ink">{formatINR(restaurant.avg_cost_per_person)}</span>
          <span className="text-xs text-muted">for one</span>
          <Badge tone="primary">Must try: {restaurant.must_try}</Badge>
        </div>
      </div>
    </Card>
  );
}
