import { useState } from "react";
import { CheckCircle2, Bell, Tag, RefreshCw, AlertCircle, Car } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TabBar } from "@/components/ui/TabBar";
import { timeAgo } from "@/lib/utils";

type Tab = "all" | "bookings" | "offers" | "updates" | "alerts";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "bookings", label: "Bookings" },
  { id: "offers", label: "Offers" },
  { id: "updates", label: "Updates" },
  { id: "alerts", label: "Alerts" },
];

interface Notification {
  id: string;
  type: Tab;
  icon: ReactNode;
  iconBg: string;
  title: string;
  body: string;
  time: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "bookings",
    icon: <CheckCircle2 size={18} />,
    iconBg: "bg-success-light text-success",
    title: "Booking Confirmed 🎉",
    body: "Your flight to Goa is confirmed. Booking ID: GEA6F12XT",
    time: new Date(Date.now() - 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "alerts",
    icon: <RefreshCw size={18} />,
    iconBg: "bg-info-light text-info",
    title: "Check-in Reminder",
    body: "Check-in for your IndiGo flight 6E 524 opens in 24 hours.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "offers",
    icon: <Tag size={18} />,
    iconBg: "bg-warning-light text-warning",
    title: "Great Offer for You!",
    body: "Get up to 25% off on hotels in Goa. Use code: GOAEASY25",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "updates",
    icon: <Bell size={18} />,
    iconBg: "bg-primary-light text-primary",
    title: "Trip to Goa",
    body: "Don't forget! Your trip starts on 12 May 2025.",
    time: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "alerts",
    icon: <Tag size={18} />,
    iconBg: "bg-success-light text-success",
    title: "Price Drop Alert",
    body: "The price of your selected hotel has dropped. Book now and save more!",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    type: "bookings",
    icon: <Car size={18} />,
    iconBg: "bg-accent-light text-accent",
    title: "Ride Reminder",
    body: "Your cab to Dabolim Airport is scheduled tomorrow at 04:30 AM.",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    type: "offers",
    icon: <AlertCircle size={18} />,
    iconBg: "bg-success-light text-success",
    title: "Wallet Cashback",
    body: "Yay! ₹250 cashback credited to your wallet.",
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    type: "updates",
    icon: <Bell size={18} />,
    iconBg: "bg-primary-light text-primary",
    title: "Weekend Getaway?",
    body: "Plan a quick trip near you. Explore now!",
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Inbox() {
  const [tab, setTab] = useState<Tab>("all");

  const visible = tab === "all" ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.type === tab);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Inbox" showBack={false} />
        <Badge tone="primary">{NOTIFICATIONS.length}</Badge>
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="space-y-2">
        {visible.map((notif) => (
          <Card key={notif.id} interactive className="flex items-start gap-3 py-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${notif.iconBg}`}>
              {notif.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-ink">{notif.title}</p>
                <span className="shrink-0 text-[11px] text-muted">{timeAgo(notif.time)}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">{notif.body}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Promo banner at bottom */}
      <div
        className="overflow-hidden rounded-card p-4 text-white"
        style={{ background: "linear-gradient(135deg, #2f7df6 0%, #6fd3e0 100%)" }}
      >
        <p className="font-bold">Looking for things to do in Goa?</p>
        <p className="mt-1 text-sm text-white/80">Explore top attractions and experiences.</p>
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
