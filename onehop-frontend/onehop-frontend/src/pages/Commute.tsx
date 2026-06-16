import { Car, Bus, CloudRain, ChevronRight, Coffee } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconCircle } from "@/components/ui/IconCircle";

import { useNavigate } from "react-router-dom";

const OPTIONS = [
  {
    id: "shared-cab",
    icon: <Car size={20} />,
    tone: "accent" as const,
    title: "Shared Cab",
    badge: "Recommended",
    badgeTone: "success" as const,
    duration: "20 min",
    arrivalLabel: "Arrive 8:52 AM",
    subtitle: "2 seats left",
    tags: ["Eco-friendly option", "Low fare"],
    price: "₹85",
    ctaLabel: "Book Now",
    ctaTone: "primary" as const,
  },
  {
    id: "metro",
    icon: <Bus size={20} />,
    tone: "info" as const,
    title: "Metro + Walk",
    badge: null,
    badgeTone: "neutral" as const,
    duration: "28 min",
    arrivalLabel: "Arrive 9:05 AM",
    subtitle: "Less Crowd",
    tags: ["Fast & punctual", "Avoid traffic"],
    price: "₹40",
    ctaLabel: "View Route",
    ctaTone: "outline" as const,
  },
  {
    id: "uber",
    icon: <Car size={20} />,
    tone: "warning" as const,
    title: "Uber Go",
    badge: "Surge 2.4x",
    badgeTone: "warning" as const,
    duration: "18 min",
    arrivalLabel: "Arrive 8:40 AM",
    subtitle: "High Demand",
    tags: ["Faster ride", "Doorstep pickup"],
    price: "₹340",
    ctaLabel: "Book Now",
    ctaTone: "primary" as const,
  },
];

export default function Commute() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader title="Best Options for You" subtitle="Updated now · Live data" />

      {/* Options */}
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <Card key={opt.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <IconCircle icon={opt.icon} tone={opt.tone} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-ink">{opt.title}</h3>
                  {opt.badge && (
                    <Badge tone={opt.badgeTone}>{opt.badge}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted">
                  {opt.duration} · <span className="text-body">{opt.arrivalLabel}</span>
                </p>
                <p className="text-xs text-muted">{opt.subtitle}</p>
              </div>
              <p className="shrink-0 text-xl font-extrabold text-ink">{opt.price}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {opt.tags.map((tag) => (
                  <Badge key={tag} tone="neutral" className="text-[11px]">{tag}</Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant={opt.ctaTone as "primary" | "outline"}
                onClick={() => navigate("/booking-confirmation")}
              >
                {opt.ctaLabel}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Weather alert */}
      <div className="flex items-center gap-3 rounded-2xl bg-info-light p-3.5">
        <CloudRain size={20} className="shrink-0 text-info" />
        <div>
          <p className="text-sm font-bold text-ink">Heavy rain expected.</p>
          <p className="text-sm text-muted">Carry an umbrella!</p>
        </div>
        <p className="ml-auto shrink-0 text-base font-extrabold text-ink">28°C</p>
      </div>

      {/* Upsell: breakfast */}
      <button
        type="button"
        onClick={() => navigate("/food")}
        className="flex w-full items-center justify-between rounded-2xl border border-line bg-surface p-3.5 shadow-card transition-shadow hover:shadow-card-hover"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Coffee size={18} className="text-primary" />
          See Best Breakfast on the Way
        </span>
        <ChevronRight size={18} className="text-muted" />
      </button>
    </div>
  );
}
