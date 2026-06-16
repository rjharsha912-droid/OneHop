import { CheckCircle2, Download, Share2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { itinerary, tripData } = useChatStore();

  const BOOKING_ID = "GEA6F12XT";

  const flightDetails = {
    airline: "IndiGo 6E 524",
    type: "Economy · Non-stop",
    dep: "06:20",
    arr: "08:40",
    duration: "2h 20m",
    depCode: (tripData.departure_city ?? "DEL").slice(0, 3).toUpperCase(),
    arrCode: (itinerary?.city ?? "GOI").slice(0, 3).toUpperCase(),
  };

  const price = itinerary?.cost_estimate.total_estimated ?? 12360;

  return (
    <div className="space-y-5 pb-8">
      {/* Success banner */}
      <div className="flex flex-col items-center gap-3 pt-6 pb-2 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-success-light text-success">
          <CheckCircle2 size={44} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink">Booking Confirmed!</h1>
          <p className="mt-1 text-sm text-muted">
            Yay! Your trip to {itinerary?.city ?? "Goa"} is confirmed.
            <br />
            We can't wait for you to have a great time!
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-line bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Booking ID</p>
          <p className="mt-1 text-2xl font-extrabold tracking-[0.15em] text-primary">{BOOKING_ID}</p>
          <p className="mt-1 text-xs text-muted">
            A confirmation email has been sent to{" "}
            <span className="text-ink font-medium">you@email.com</span>
          </p>
        </div>
      </div>

      {/* Flight details */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Flight Details</h2>
          <Badge tone="success">Confirmed</Badge>
        </div>
        <div>
          <p className="text-base font-bold text-ink">{flightDetails.airline}</p>
          <p className="text-xs text-muted">{flightDetails.type}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xl font-extrabold text-ink">{flightDetails.dep}</p>
            <p className="text-xs font-semibold text-muted">{flightDetails.depCode}</p>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <p className="text-xs text-muted">{flightDetails.duration}</p>
            <div className="flex w-full items-center gap-1 my-1">
              <div className="h-px flex-1 bg-line" />
              <div className="size-2 rounded-full bg-primary" />
              <div className="h-px flex-1 bg-line" />
            </div>
            <p className="text-xs text-success">Non-stop</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-ink">{flightDetails.arr}</p>
            <p className="text-xs font-semibold text-muted">{flightDetails.arrCode}</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted border-t border-line pt-3">
          <span>📅 12 May 2025, Sunday</span>
          <span>🧳 7 kg Cabin</span>
          <span>🍽 Free Meal Included</span>
        </div>
      </Card>

      {/* Traveller details */}
      <Card className="space-y-2">
        <h2 className="text-sm font-bold text-ink">Traveller Details</h2>
        <p className="text-xs text-muted">{itinerary?.travellers ?? 3} Travellers</p>
        {["Ananya Sharma — Adult", "Rahul Sharma — Adult", "Kiara Sharma — Child (7 yrs)"].slice(
          0,
          itinerary?.travellers ?? 3
        ).map((t, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-ink">{i + 1}. {t.split(" — ")[0]}</span>
            <Badge tone="neutral">{t.split(" — ")[1]}</Badge>
          </div>
        ))}
      </Card>

      {/* Price summary */}
      <Card className="space-y-2">
        <h2 className="text-sm font-bold text-ink">Price Summary</h2>
        {[
          { label: "Base Fare (2 Adults)", amount: itinerary?.cost_estimate.hotel ?? 8240 },
          { label: "Child Fare", amount: 2060 },
          { label: "Taxes & Fees", amount: 2060 },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted">{row.label}</span>
            <span className="text-ink">{formatINR(row.amount)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-line pt-2 font-bold">
          <span className="text-ink">Total Amount</span>
          <span className="text-primary">{formatINR(price)}</span>
        </div>
        <p className="text-xs text-success">✅ You saved ₹1,240 on this booking</p>
      </Card>

      {/* What's next */}
      <Card className="space-y-2">
        <h2 className="text-sm font-bold text-ink">What's Next?</h2>
        {[
          "Check-in opens 24 hours before departure",
          "Carry a valid ID proof for all travellers",
          "Arrive at the airport at least 2 hours early",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-body">
            <CheckCircle2 size={16} className="shrink-0 text-success" />
            {item}
          </div>
        ))}
        <button
          type="button"
          className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary"
        >
          View Travel Guidelines <ChevronRight size={14} />
        </button>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" icon={<Share2 size={16} />} onClick={() => {}}>
          Manage Booking
        </Button>
        <Button icon={<Download size={16} />} onClick={() => {}}>
          Download E-Ticket
        </Button>
      </div>

      <Button
        fullWidth
        variant="ghost"
        onClick={() => navigate("/home")}
      >
        Back to Home
      </Button>
    </div>
  );
}
