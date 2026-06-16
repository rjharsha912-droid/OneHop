import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Trash2, Plus, ChevronRight, Map } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chatStore";
import { chatApi } from "@/lib/api";
import type { ConversationRecord } from "@/types";
import { timeAgo, titleCase } from "@/lib/utils";

export default function Trips() {
  const navigate = useNavigate();
  const { itinerary } = useChatStore();
  const [history, setHistory] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatApi
      .history()
      .then(setHistory)
      .catch(() => {/* silently fail if backend down */})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await chatApi.deleteConversation(id).catch(() => {});
    setHistory((prev) => prev.filter((h) => h._id !== id));
  };

  const completed = history.filter((h) => h.is_complete);
  const inProgress = history.filter((h) => !h.is_complete);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="My Trips" showBack={false} />
        <Button
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => navigate("/chat")}
        >
          New Trip
        </Button>
      </div>

      {/* Current active itinerary chip */}
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
          </div>
          <ChevronRight size={20} />
        </button>
      )}

      {loading && (
        <p className="text-center text-sm text-muted">Loading trips…</p>
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

      {completed.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">Completed plans</h2>
          <div className="space-y-3">
            {completed.map((conv) => (
              <TripRow key={conv._id} conv={conv} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">In progress</h2>
          <div className="space-y-3">
            {inProgress.map((conv) => (
              <TripRow key={conv._id} conv={conv} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TripRow({
  conv,
  onDelete,
}: {
  conv: ConversationRecord;
  onDelete: (id: string) => void;
}) {
  const city = conv.trip_data?.city;
  const dest = city ? titleCase(city) : "Trip plan";

  return (
    <Card className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <Plane size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink">{dest}</p>
        <p className="flex items-center gap-2 text-xs text-muted">
          {timeAgo(conv.updated_at)}
          <Badge tone={conv.is_complete ? "success" : "warning"} className="text-[10px]">
            {conv.is_complete ? "Complete" : "Planning"}
          </Badge>
        </p>
      </div>
      <button
        type="button"
        aria-label="Delete"
        onClick={() => onDelete(conv._id)}
        className="shrink-0 rounded-full p-2 text-muted hover:bg-danger-light hover:text-danger"
      >
        <Trash2 size={16} />
      </button>
    </Card>
  );
}
