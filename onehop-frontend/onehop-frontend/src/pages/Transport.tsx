import { useState } from "react";
import { Plane, Train, Car, Bus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransportCard } from "@/components/common/TransportCard";
import { useChatStore } from "@/store/chatStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/ui/TabBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useNavigate } from "react-router-dom";

type Tab = "flights" | "trains" | "cabs" | "local";

const TABS: { id: Tab; label: string }[] = [
  { id: "flights", label: "Flights" },
  { id: "trains", label: "Trains" },
  { id: "cabs", label: "Cabs" },
  { id: "local", label: "Local Transport" },
];

const MOCK_FLIGHTS = [
  { airline: "Go First", code: "G8 524", dep: "06:20", arr: "08:40", duration: "2h 20m", price: 4250, stops: "Non-stop" },
  { airline: "SpiceJet", code: "SG 432", dep: "07:45", arr: "10:15", duration: "2h 30m", price: 4680, stops: "Non-stop" },
  { airline: "IndiGo", code: "6E 875", dep: "09:30", arr: "11:55", duration: "2h 25m", price: 5150, stops: "Non-stop" },
  { airline: "Air India", code: "AI 657", dep: "05:50", arr: "10:05", duration: "4h 15m", price: 4120, stops: "1 Stop" },
];

const AIRLINE_COLORS: Record<string, string> = {
  "Go First": "#00a651",
  SpiceJet: "#d7003a",
  IndiGo: "#2a3f8f",
  "Air India": "#e01b24",
  Vistara: "#a01a7d",
};

export default function Transport() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [tab, setTab] = useState<Tab>("flights");

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Transport Options"
        subtitle={itinerary ? `${itinerary.departure_city} → ${itinerary.city}` : undefined}
        right={
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
          >
            <Search size={18} />
          </button>
        }
      />

      {/* Route summary banner */}
      {itinerary && (
        <div className="flex items-center gap-3 rounded-2xl bg-primary-light p-3">
          <Plane size={18} className="shrink-0 text-primary" />
          <p className="text-sm font-semibold text-ink">
            {itinerary.departure_city} → {itinerary.city} · 2 Adults, 1 Child · Economy
          </p>
        </div>
      )}

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "flights" && (
        <div className="space-y-3">
          {MOCK_FLIGHTS.map((flight) => (
            <Card key={flight.code} className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Airline logo pill */}
                <div
                  className="flex h-9 w-14 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                  style={{ background: AIRLINE_COLORS[flight.airline] ?? "#ff6a00" }}
                >
                  {flight.airline.split(" ").map((w) => w[0]).join("")}
                </div>

                {/* Times */}
                <div className="flex flex-1 items-center gap-2">
                  <div className="text-center">
                    <p className="text-base font-extrabold text-ink">{flight.dep}</p>
                    <p className="text-xs text-muted">{itinerary?.departure_city?.slice(0, 3).toUpperCase() ?? "DEL"}</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <div className="text-[11px] text-muted">{flight.duration}</div>
                    <div className="flex w-full items-center gap-1">
                      <div className="h-px flex-1 bg-line" />
                      <Plane size={12} className="text-primary" />
                      <div className="h-px flex-1 bg-line" />
                    </div>
                    <Badge tone={flight.stops === "Non-stop" ? "success" : "warning"} className="text-[10px]">
                      {flight.stops}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-extrabold text-ink">{flight.arr}</p>
                    <p className="text-xs text-muted">{itinerary?.city?.slice(0, 3).toUpperCase() ?? "GOI"}</p>
                  </div>
                </div>

                {/* Price + Select */}
                <div className="shrink-0 text-right">
                  <p className="text-base font-extrabold text-ink">₹{flight.price.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-muted">per adult</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <span>7 kg cabin · 15 kg check-in · Free Meal</span>
                <Button size="sm" onClick={() => navigate("/booking-confirmation")}>
                  Select
                </Button>
              </div>
            </Card>
          ))}

          {/* Flexible booking note */}
          <div className="flex items-center gap-2 rounded-2xl bg-success-light p-3 text-sm text-success">
            <span className="text-lg">✅</span>
            <span>Flexible Booking — Free cancellation available on select flights.</span>
          </div>
        </div>
      )}

      {tab === "trains" && (
        <div className="space-y-3">
          <Card className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-info-light text-info">
              <Train size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink">Rajdhani Express</p>
              <p className="text-xs text-muted">15:30 → 08:40 (+1) · 17h 10m · Sleeper / AC</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-ink">₹890</p>
              <Button size="sm">Book</Button>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-info-light text-info">
              <Train size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink">Shatabdi Express</p>
              <p className="text-xs text-muted">06:00 → 13:30 · 7h 30m · CC / EC</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-ink">₹1,250</p>
              <Button size="sm">Book</Button>
            </div>
          </Card>
        </div>
      )}

      {tab === "cabs" && !itinerary && (
        <EmptyState
          icon={<Car size={28} />}
          title="Plan a trip first"
          description="Your cab recommendations will appear after you plan a trip with OneHop AI."
          action={<Button onClick={() => navigate("/chat")}>Plan a trip</Button>}
        />
      )}

      {tab === "cabs" && itinerary && (
        <div className="space-y-3">
          {itinerary.recommended_transport
            .filter((t) => t.type.toLowerCase().includes("taxi") || t.type.toLowerCase().includes("cab"))
            .map((t) => <TransportCard key={t.type} option={t} />)}
        </div>
      )}

      {tab === "local" && itinerary && (
        <div className="space-y-3">
          {itinerary.recommended_transport.map((t) => (
            <TransportCard key={t.type} option={t} />
          ))}
        </div>
      )}

      {tab === "local" && !itinerary && (
        <EmptyState
          icon={<Bus size={28} />}
          title="No city yet"
          description="Plan a trip and we'll show local transport options."
          action={<Button onClick={() => navigate("/chat")}>Plan a trip</Button>}
        />
      )}
    </div>
  );
}
