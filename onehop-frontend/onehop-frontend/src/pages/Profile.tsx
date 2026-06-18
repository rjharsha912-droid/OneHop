import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LogOut, Settings, CreditCard, Tag, Gift, HelpCircle,
  Phone, Star, Bell, Shield, FileText, Info, ChevronRight,
  CheckCircle2, Plane, Hotel, Car, Edit2, X, Check,
} from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { profileApi, type ProfileStats } from "@/lib/api";

interface ProfileRow {
  icon: ReactNode;
  label: string;
  sub: string;
  to?: string;
}

function SectionRow({ icon, label, sub, to }: ProfileRow) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-line text-body">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted" />
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    profileApi.getStats().then(setStats).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await profileApi.updateProfile(newName.trim());
      setSaveMsg("Name updated!");
      setEditing(false);
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Profile" showBack={false} />
        <button
          type="button"
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-full bg-surface shadow-card text-ink"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Profile hero */}
      <Card className="space-y-3">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size={56} />
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm text-ink"
                  autoFocus
                />
                <button type="button" onClick={handleSaveName} disabled={saving}
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={14} />
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="flex size-8 items-center justify-center rounded-full bg-line text-ink">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-extrabold text-ink">{user?.name ?? "Traveller"}</h2>
                <button type="button" onClick={() => setEditing(true)}
                  className="text-muted hover:text-primary">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p className="truncate text-sm text-muted">{user?.email ?? ""}</p>
            <Badge tone="success" icon={<CheckCircle2 size={12} />} className="mt-1.5">
              Verified
            </Badge>
          </div>
        </div>
        {saveMsg && (
          <p className="text-xs text-center text-success">{saveMsg}</p>
        )}
      </Card>

      {/* Travel Points + Wallet */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-start gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-light text-warning">
            <Star size={16} />
          </div>
          <div>
            <p className="text-base font-extrabold text-ink">
              {stats?.travel_points ?? 0}
            </p>
            <p className="text-xs text-muted">Travel Points</p>
            <p className="mt-0.5 text-[11px] text-primary">Redeem for offers</p>
          </div>
        </Card>
        <Card className="flex items-start gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
            <CreditCard size={16} />
          </div>
          <div>
            <p className="text-base font-extrabold text-ink">
              ₹{stats?.wallet_balance ?? 0}
            </p>
            <p className="text-xs text-muted">My Wallet</p>
            <p className="mt-0.5 text-[11px] text-primary">View transactions</p>
          </div>
        </Card>
      </div>

      {/* Trip Stats */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">My Activity</h3>
          <button type="button" className="text-xs font-semibold text-primary">
            View All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { label: "Trips",   count: stats?.total_trips ?? 0,    icon: <Plane size={18} />, color: "text-primary bg-primary-light" },
            { label: "Chats",   count: stats?.total_chats ?? 0,    icon: <Plane size={18} />, color: "text-info bg-info-light" },
            { label: "Hotels",  count: stats?.hotels_booked ?? 0,  icon: <Hotel size={18} />, color: "text-success bg-success-light" },
            { label: "Cabs",    count: stats?.cabs_booked ?? 0,    icon: <Car size={18} />,   color: "text-accent bg-accent-light" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1">
              <div className={`flex size-10 items-center justify-center rounded-full ${b.color}`}>
                {b.icon}
              </div>
              <p className="font-bold text-ink">{b.count}</p>
              <p className="text-muted">{b.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padded={false} className="px-4 divide-y divide-line">
        <h3 className="py-3 text-sm font-bold text-ink">Quick Actions</h3>
        <SectionRow icon={<Settings size={16} />}   label="Manage Travellers"  sub="Add or edit traveller details" />
        <SectionRow icon={<CreditCard size={16} />} label="Payment Methods"    sub="Cards, UPI and wallets" />
        <SectionRow icon={<Tag size={16} />}        label="Offers & Coupons"   sub="View your available offers" />
        <SectionRow icon={<Gift size={16} />}       label="Refer & Earn"       sub="Invite friends and earn rewards" />
      </Card>

      {/* Support */}
      <Card padded={false} className="px-4 divide-y divide-line">
        <h3 className="py-3 text-sm font-bold text-ink">Support</h3>
        <SectionRow icon={<HelpCircle size={16} />} label="Help Centre"  sub="FAQs and support" />
        <SectionRow icon={<Phone size={16} />}      label="Contact Us"   sub="We're here to help" />
        <SectionRow icon={<Star size={16} />}       label="Rate Us"      sub="Share your experience" />
      </Card>

      {/* More */}
      <Card padded={false} className="px-4 divide-y divide-line">
        <h3 className="py-3 text-sm font-bold text-ink">More</h3>
        <SectionRow icon={<Bell size={16} />}     label="Notification Preferences" sub="Manage your notification settings" />
        <SectionRow icon={<Shield size={16} />}   label="Privacy Policy"           sub="Read our privacy policy" />
        <SectionRow icon={<FileText size={16} />} label="Terms & Conditions"       sub="Read our terms and conditions" />
        <SectionRow icon={<Info size={16} />}     label="About OneHop"             sub="Version 1.0.0" />
      </Card>

      <Button fullWidth variant="outline" icon={<LogOut size={18} />} onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
}