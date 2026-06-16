import { useNavigate } from "react-router-dom";
import { MapPin, Bot, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AISuggestionCard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-ink">AI Suggestion for You</h2>
      <Card
        interactive
        onClick={() => navigate("/commute")}
        className="flex items-center gap-3 border-none bg-gradient-to-r from-accent-light to-primary-light"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <MapPin size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-body">
            Heavy rain expected in your area. Shared cab available at{" "}
            <span className="font-bold text-ink">₹85</span>, arriving by 8:52 AM.
          </p>
          <span className="mt-1 inline-flex items-center gap-0.5 text-sm font-semibold text-primary">
            View Details <ChevronRight size={14} />
          </span>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Bot size={24} />
        </div>
      </Card>
    </div>
  );
}
