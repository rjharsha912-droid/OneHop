import { Car, Bus, Bike, Train, Ship } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { IconCircle } from "@/components/ui/IconCircle";
import { formatINR } from "@/lib/utils";
import type { TransportOption } from "@/types";

function transportIcon(type: string): { icon: ReactNode; tone: "primary" | "info" | "success" | "warning" } {
  const t = type.toLowerCase();
  if (t.includes("bus") || t.includes("metro")) return { icon: <Bus size={20} />, tone: "info" };
  if (t.includes("train")) return { icon: <Train size={20} />, tone: "info" };
  if (t.includes("bike") || t.includes("scooter") || t.includes("rickshaw")) return { icon: <Bike size={20} />, tone: "success" };
  if (t.includes("ferry") || t.includes("boat")) return { icon: <Ship size={20} />, tone: "info" };
  return { icon: <Car size={20} />, tone: "primary" };
}

export function TransportCard({ option }: { option: TransportOption }) {
  const { icon, tone } = transportIcon(option.type);
  return (
    <Card className="flex items-center gap-3">
      <IconCircle icon={icon} tone={tone} size="lg" />
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold text-ink">{option.type}</h3>
        <p className="truncate text-xs text-muted">{option.provider}</p>
        <p className="mt-0.5 text-xs text-muted">{option.note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-extrabold text-ink">{formatINR(option.price_per_day)}</p>
        <p className="text-[11px] text-muted">/ day</p>
      </div>
    </Card>
  );
}
