import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Trash2, Plus, ChevronRight, Map, Calendar, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chatStore";
import { chatApi } from "@/lib/api";
import type { ConversationRecord } from "@/types";
import { timeAgo, titleCase } from "@/lib/utils";

const CITY_GRADIENTS: Record<string, string> = {
  goa:      "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)",
  ooty:     "linear-gradient(135deg, #1aa15e 0%, #9fd99a 100%)",
  mumbai:   "linear-gradient(135deg, #ff6a00 0%, #ffb27a 100%)",
  delhi:    "linear-gradient(135deg, #7c5cfc 0%, #b69bff 100%)",
  jaipur:   "linear-gradient(135deg, #e08a00 0%, #ffd58a 100%)",
  default:  "linear-gradient(135deg, #ff6a00 0%, #7c5cfc 100%)",
};

export default function Trips() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [history, setHistory] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    chatApi
      .history()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await chatApi.deleteConversation(id).catch(() => {});
    setHistory((prev) => prev.filter((h) => h._id !== id));
    setDeleteId(null);
  };

  const completed  = history.filter((h) => h.is_complete);
  const inProgress = history.filter((h) => !h.is_complete);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="My Trips" showBack={false} />
        <Button size="sm" icon={<Plus size={16} />} onClick={() => navigate("/chat")}>
          New Trip
        </Button>
      </div>

      {/* Stats row */}
      {history.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total",     value: history.length,    color: "bg-primary-light text-primary" },
            { label: "Completed", value: completed.length,  color: "bg-success-light text-success" },
            { label: "Planning",  value: inProgress.length, color: "bg-warning-light text-warning" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 text-center ${s.color}`}>
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-xs font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active itinerary banner */}
      {itinerary && (
        <button
          type="button"
          onClick={() => navigate("/trip")}
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent p-4 text-left text-white shadow-sm"
        >
          <Map size={22} />
          <div className="flex-1">
            <p className="text-xs font-semibold text-white/80">Active plan</p>
            <p className="text-base font-extrabold">
              {itinerary.city} · {itinerary.duration}
            </p>
            <p className="text-xs text-white/70">
              {itinerary.travellers} travellers · Tap to view
            </p>
          </div>
          <ChevronRight size={20} />
        </button>
      )}

      {loading && (
        <p className="text-center text-sm text-muted py-8">Loading trips…</p>
      )}

      {!loading && history.length === 0 && !itinerary && (
        <EmptyState
          icon={<Plane size={28} />}
          title="No trips yet"
          description="Start chatting with OneHop AI to plan your first trip."
          action={
            <Button icon={<Plus size={16} />} onClick={() => navigate("/chat")}>
              Plan a trip
            </Button>
          }
        />
      )}

      {/* Completed trips */}
      {completed.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">
            ✅ Completed Plans ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map((conv) => (
              <TripCard
                key={conv._id}
                conv={conv}
                onDelete={handleDelete}
                deleting={deleteId === conv._id}
              />
            ))}
          </div>
        </section>
      )}

      {/* In progress trips */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">
            ✈️ In Progress ({inProgress.length})
          </h2>
          <div className="space-y-3">
            {inProgress.map((conv) => (
              <TripCard
                key={conv._id}
                conv={conv}
                onDelete={handleDelete}
                deleting={deleteId === conv._id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TripCard({
  conv,
  onDelete,
  deleting,
}: {
  conv: ConversationRecord;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const city     = conv.trip_data?.city ?? "";
  const dest     = city ? titleCase(city) : "Trip plan";
  const days     = conv.trip_data?.days;
  const people   = conv.trip_data?.people;
  const budget   = conv.trip_data?.budget;
  const gradient = CITY_GRADIENTS[city.toLowerCase()] ?? CITY_GRADIENTS.default;

  return (
    <Card className="overflow-hidden p-0">
      {/* Gradient top bar */}
      <div className="h-2 w-full" style={{ background: gradient }} />

      <div className="flex items-center gap-3 p-4">
        {/* City icon */}
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white text-lg font-extrabold"
          style={{ background: gradient }}
        >
          {dest.slice(0, 2).toUpperCase()}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-extrabold text-ink">{dest}</p>
            <Badge tone={conv.is_complete ? "success" : "warning"} className="text-[10px] shrink-0">
              {conv.is_complete ? "Complete" : "Planning"}
            </Badge>
          </div>

          {/* Trip details */}
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            {days && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {days} days
              </span>
            )}
            {people && (
              <span className="flex items-center gap-1">
                <Users size={11} /> {people} people
              </span>
            )}
            {budget && (
              <span className="flex items-center gap-1">
                <Wallet size={11} /> ₹{Number(budget).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-[11px] text-muted">{timeAgo(conv.updated_at)}</p>
        </div>

        {/* Delete button */}
        <button
          type="button"
          aria-label="Delete"
          onClick={() => onDelete(conv._id)}
          disabled={deleting}
          className="shrink-0 rounded-full p-2 text-muted hover:bg-danger-light hover:text-danger disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}