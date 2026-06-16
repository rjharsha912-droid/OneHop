import { Hotel as HotelIcon, MapPin, Star, Wifi, Coffee, Waves, Trees, UtensilsCrossed, Sparkle } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatINR, titleCase } from "@/lib/utils";
import type { Hotel } from "@/types";

const AMENITY_ICONS: Record<string, ReactNode> = {
  wifi: <Wifi size={12} />,
  pool: <Waves size={12} />,
  spa: <Sparkle size={12} />,
  restaurant: <UtensilsCrossed size={12} />,
  breakfast: <Coffee size={12} />,
  "river view": <Waves size={12} />,
  "beach access": <Waves size={12} />,
  garden: <Trees size={12} />,
};

function amenityIcon(label: string): ReactNode {
  const key = Object.keys(AMENITY_ICONS).find((k) => label.toLowerCase().includes(k));
  return key ? AMENITY_ICONS[key] : <Sparkle size={12} />;
}

interface HotelCardProps {
  hotel: Hotel;
  gradient: string;
  onSelect?: () => void;
}

export function HotelCard({ hotel, gradient, onSelect }: HotelCardProps) {
  return (
    <Card interactive={!!onSelect} onClick={onSelect} className="flex gap-3">
      <div
        className="flex size-20 shrink-0 items-center justify-center rounded-2xl text-white sm:size-24"
        style={{ background: gradient }}
      >
        <HotelIcon size={28} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-ink">{hotel.name}</h3>
          <Badge tone="success" icon={<Star size={11} className="fill-current" />}>
            {hotel.rating}
          </Badge>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> {hotel.location}
        </p>
        <p className="mt-1.5 text-base font-extrabold text-ink">
          {formatINR(hotel.price_per_night)} <span className="text-xs font-medium text-muted">/ night</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 4).map((a) => (
            <Badge key={a} tone="neutral" icon={amenityIcon(a)} className="capitalize">
              {titleCase(a)}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
