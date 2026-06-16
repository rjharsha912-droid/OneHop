import {
  Waves,
  Landmark,
  TreePine,
  ShoppingBag,
  Castle,
  Flower2,
  Footprints,
  MapPin,
  type LucideIcon,
} from "lucide-react";

interface PlaceVisual {
  Icon: LucideIcon;
  gradient: string;
}

const PLACE_VISUALS: Record<string, PlaceVisual> = {
  beach: { Icon: Waves, gradient: "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)" },
  heritage: { Icon: Landmark, gradient: "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)" },
  nature: { Icon: TreePine, gradient: "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)" },
  market: { Icon: ShoppingBag, gradient: "linear-gradient(135deg, #e3483a 0%, #ffb199 100%)" },
  fort: { Icon: Castle, gradient: "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)" },
  garden: { Icon: Flower2, gradient: "linear-gradient(135deg, #1aa15e 0%, #b6e8c8 100%)" },
  monument: { Icon: Landmark, gradient: "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)" },
  promenade: { Icon: Footprints, gradient: "linear-gradient(135deg, #2f7df6 0%, #9fc4ff 100%)" },
};

const DEFAULT_VISUAL: PlaceVisual = { Icon: MapPin, gradient: "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)" };

export function getPlaceVisual(type: string): PlaceVisual {
  return PLACE_VISUALS[type.toLowerCase()] ?? DEFAULT_VISUAL;
}
