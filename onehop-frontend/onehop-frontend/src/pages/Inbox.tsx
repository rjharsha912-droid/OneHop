import { useState, useEffect } from "react";
import { CheckCircle2, Bell, Tag, RefreshCw, AlertCircle, Car, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TabBar } from "@/components/ui/TabBar";
import { timeAgo } from "@/lib/utils";
import { chatApi } from "@/lib/api";
import type { ConversationRecord } from "@/types";

type Tab = "all" | "bookings" | "offers" | "updates" | "alerts";

const TABS: { id: Tab; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "bookings", label: "Bookings" },
  { id: "offers",   label: "Offers" },
  { id: "updates",  label: "Updates" },
  { id: "alerts",   label: "Alerts" },
];

interface Notification {
  id: string;
  type: Tab;
  icon: ReactNode;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// Static offers/alerts that are always shown
const STATIC_NOTIFICATIONS: Notification[] = [
  {
    id: "offer-1",
    type: "offers",
    icon: <Tag size={18} />,
    iconBg: "bg-warning-light text-warning",
    title: "🎉 25% Off on Hotels in Goa!",
    body: "Limited time offer. Use code: GOAEASY25 before it expires.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "offer-2",
    type: "offers",
    icon: <AlertCircle size={18} />,
    iconBg: "bg-success-light text-success",
    title: "💰 Wallet Cashback Available",
    body: "Complete your next trip booking and get ₹250 cashback in your wallet.",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "alert-1",
    type: "alerts",
    icon: <Bell size={18} />,
    iconBg: "bg-primary-light text-primary",
    title: "🌦 Weather Alert",
    body: "Heavy rain expected in Ooty this weekend. Plan your trip accordingly.",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "alert-2",
    type: "alerts",
    icon: <Tag size={18} />,
    iconBg: "bg-success-light text-success",
    title: "📉 Price Drop Alert",
    body: "Hotel prices in Jaipur have dropped by 30%. Book now and save more!",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "update-1",
    type: "updates",
    icon: <Bell size={18} />,
    iconBg: "bg-primary-light text-primary",
    title: "✨ New Feature: Cab Prices",
    body: "You can now compare cab prices between cities. Check it out in Transport!",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

// Generate notifications from real trip data
function generateTripNotifications(trips: ConversationRecord[]): Notification[] {
  const notifications: Notification[] = [];

  trips.forEach((trip) => {
    const city = trip.trip_data?.city;
    const dest = city ? city.charAt(0).toUpperCase() + city.slice(1) : "your destination";

    if (trip.is_complete) {
      notifications.push({
        id: `trip-complete-${trip._id}`,
        type: "bookings",
        icon: <CheckCircle2 size={18} />,
        iconBg: "bg-success-light text-success",
        title: `✅ Trip to ${dest} Planned!`,
        body: `Your ${trip.trip_data?.days ?? ""} day itinerary for ${dest} is ready. Tap to view details.`,
        time: trip.updated_at,
        read: false,
      });
    } else {
      notifications.push({
        id: `trip-progress-${trip._id}`,
        type: "updates",
        icon: <RefreshCw size={18} />,
        iconBg: "bg-info-light text-info",
        title: `✈️ Continue Planning ${dest}`,
        body: `You have an incomplete trip plan for ${dest}. Continue where you left off!`,
        time: trip.updated_at,
        read: false,
      });
    }

    // Add cab reminder for completed trips
    if (trip.is_complete && trip.trip_data?.departure_city) {
      notifications.push({
        id: `cab-${trip._id}`,
        type: "bookings",
        icon: <Car size={18} />,
        iconBg: "bg-accent-light text-accent",
        title: `🚗 Book Your Cab`,
        body: `Don't forget to book a cab from ${trip.trip_data.departure_city} to ${dest}!`,
        time: trip.updated_at,
        read: false,
      });
    }
  });

  return notifications;
}

export default function Inbox() {
  const [tab, setTab]                   = useState<Tab>("all");
  const [notifications, setNotifications] = useState<Notification[]>(STATIC_NOTIFICATIONS);
  const [loading, setLoading]           = useState(true);
  const [unreadCount, setUnreadCount]   = useState(0);

  useEffect(() => {
    chatApi.history()
      .then((trips) => {
        const tripNotifs = generateTripNotifications(trips);
        const all = [...tripNotifs, ...STATIC_NOTIFICATIONS]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(all);
        setUnreadCount(all.filter((n) => !n.read).length);
      })
      .catch(() => {
        setUnreadCount(STATIC_NOTIFICATIONS.filter((n) => !n.read).length);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const visible = tab === "all"
    ? notifications
    : notifications.filter((n) => n.type === tab);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader title="Inbox" showBack={false} />
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge tone="primary">{unreadCount} new</Badge>
          )}
        </div>
      </div>

      {/* Mark all read */}
      {unreadCount > 0 && (
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-primary"
        >
          Mark all as read
        </button>
      )}

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {loading && (
        <p className="text-center text-sm text-muted py-4">Loading notifications...</p>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-center text-sm text-muted py-8">No notifications here.</p>
      )}

      <div className="space-y-2">
        {visible.map((notif) => (
          <Card
            key={notif.id}
            interactive
            className={`flex items-start gap-3 py-3 transition-colors ${
              !notif.read ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${notif.iconBg}`}>
              {notif.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold text-ink ${!notif.read ? "text-primary" : ""}`}>
                  {notif.title}
                </p>
                <span className="shrink-0 text-[11px] text-muted">{timeAgo(notif.time)}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">{notif.body}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(notif.id)}
              className="shrink-0 rounded-full p-1 text-muted hover:bg-danger-light hover:text-danger"
            >
              <Trash2 size={14} />
            </button>
          </Card>
        ))}
      </div>

      {/* Promo banner */}
      <div
        className="overflow-hidden rounded-card p-4 text-white"
        style={{ background: "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)" }}
      >
        <p className="font-bold">🌴 Looking for a weekend getaway?</p>
        <p className="mt-1 text-sm text-white/80">
          Explore top destinations and get exclusive deals.
        </p>
        <button
          type="button"
          className="mt-3 rounded-pill bg-white/20 px-4 py-1.5 text-sm font-semibold text-white"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
}