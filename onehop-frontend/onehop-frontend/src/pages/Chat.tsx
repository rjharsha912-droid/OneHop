import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, RotateCcw, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useChatStore, TOTAL_TRIP_QUESTIONS } from "@/store/chatStore";
import { formatINR } from "@/lib/utils";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversationId,
    messages,
    questionIndex,
    itinerary,
    isComplete,
    status,
    error,
    startNewTrip,
    sendMessage,
    reset,
    clearError,
  } = useChatStore();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefillHandled = useRef(false);

  // Bootstrap: start a conversation if there isn't one yet, and
  // optionally fire off a prefilled question from Home's search bar.
  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill;

    const run = async () => {
      if (!conversationId) {
        await startNewTrip();
      }
      if (prefill && !prefillHandled.current) {
        prefillHandled.current = true;
        await sendMessage(prefill);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;
    setInput("");
    sendMessage(text);
  };

  const handleNewTrip = async () => {
    reset();
    prefillHandled.current = false;
    await startNewTrip();
  };

  const progressPct = Math.min(100, (questionIndex / TOTAL_TRIP_QUESTIONS) * 100);

  return (
    <div className="flex h-[calc(100vh-1rem)] flex-col md:h-[calc(100vh-4rem)] md:max-w-3xl md:mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 pb-3">
        <button
          type="button"
          onClick={() => navigate("/home")}
          aria-label="Back to home"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-card text-ink hover:bg-line/60"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-white">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">OneHop AI</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-success" />
            Online
          </p>
        </div>
        <button
          type="button"
          onClick={handleNewTrip}
          aria-label="Start a new trip"
          title="Start a new trip"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-card text-ink hover:bg-line/60"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Progress bar while collecting trip details */}
      {conversationId && !isComplete && (
        <div className="mb-3 px-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Planning your trip</span>
            <span>
              {Math.min(questionIndex, TOTAL_TRIP_QUESTIONS)}/{TOTAL_TRIP_QUESTIONS}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-line">
            <div
              className="h-full rounded-pill bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <Alert tone="danger" className="mb-3" onDismiss={clearError}>
          {error}
        </Alert>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-1 pb-3">
        {messages.map((m, idx) => (
          <MessageBubble key={idx} message={m} />
        ))}
        {status === "loading" && <TypingIndicator />}

        {isComplete && itinerary && !itinerary.error && (
          <ItineraryReadyCard
            city={itinerary.city}
            duration={itinerary.duration}
            total={itinerary.cost_estimate.total_estimated}
            withinBudget={itinerary.cost_estimate.within_budget}
            onView={() => navigate("/trip")}
          />
        )}

        {isComplete && itinerary?.error && (
          <Alert tone="warning">{itinerary.error}</Alert>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-1 pt-2">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-4 shadow-card">
          <MapPin size={16} className="shrink-0 text-muted" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isComplete ? "Ask about your itinerary..." : "Type your message..."}
            className="h-full w-full bg-transparent text-[15px] text-ink placeholder:text-muted outline-none"
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || status === "loading"}
          aria-label="Send message"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function ItineraryReadyCard({
  city,
  duration,
  total,
  withinBudget,
  onView,
}: {
  city: string;
  duration: string;
  total: number;
  withinBudget: boolean;
  onView: () => void;
}) {
  return (
    <Card className="border-none bg-gradient-to-r from-primary-light to-accent-light">
      <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Itinerary ready</p>
      <h3 className="mt-1 text-lg font-extrabold text-ink">
        {city} · {duration}
      </h3>
      <p className="mt-1 text-sm text-body">
        Estimated cost <span className="font-bold text-ink">{formatINR(total)}</span>
        {" — "}
        <span className={withinBudget ? "text-success font-semibold" : "text-warning font-semibold"}>
          {withinBudget ? "within your budget" : "slightly over budget"}
        </span>
      </p>
      <Button size="sm" className="mt-3" icon={<ArrowRight size={16} />} iconPosition="right" onClick={onView}>
        View full itinerary
      </Button>
    </Card>
  );
}
