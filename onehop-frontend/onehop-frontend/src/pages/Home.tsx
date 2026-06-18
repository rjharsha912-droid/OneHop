import { useNavigate } from "react-router-dom";
import {
  Bell, Mountain, Waves, Building2, Trees,
  TrendingUp, MapPin, ChevronRight, Shield, Star,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { AskBar } from "@/components/home/AskBar";
import { QuickActionGrid } from "@/components/home/QuickActionGrid";
import { LiveUpdates } from "@/components/home/LiveUpdates";
import { AISuggestionCard } from "@/components/home/AISuggestionCard";
import { PromoBanner } from "@/components/home/PromoBanner";
import { DestinationCard, DESTINATION_GRADIENTS } from "@/components/common/DestinationCard";
import { WeatherWidget } from "@/components/home/WeatherWidget";

const TOP_DESTINATIONS = [
  { name: "Ooty",       tag: "Hill Station", icon: <Mountain size={22} />, key: "ooty",       rating: 4.8 },
  { name: "Goa",        tag: "Beach",        icon: <Waves size={22} />,    key: "goa",        rating: 4.9 },
  { name: "Coimbatore", tag: "City",         icon: <Building2 size={22} />,key: "coimbatore", rating: 4.5 },
  { name: "Wayanad",    tag: "Nature",       icon: <Trees size={22} />,    key: "wayanad",    rating: 4.7 },
];

const TRENDING = [
  { name: "Jaipur",      emoji: "🏯", temp: "32°C", tag: "Heritage" },
  { name: "Munnar",      emoji: "🍃", temp: "18°C", tag: "Nature"   },
  { name: "Pondicherry", emoji: "🌊", temp: "29°C", tag: "Beach"    },
  { name: "Mysore",      emoji: "👑", temp: "27°C", tag: "Culture"  },
  { name: "Coorg",       emoji: "☕", temp: "20°C", tag: "Hills"    },
  { name: "Hampi",       emoji: "🏛", temp: "31°C", tag: "Historic" },
];

const OFFERS = [
  { label: "FLAT ₹500 OFF",  sub: "On first hotel booking", code: "HOTEL500", color1: "#ff6a00", color2: "#ff9a3c" },
  { label: "25% OFF CABS",   sub: "Use code at checkout",   code: "CAB25",    color1: "#7c5cfc", color2: "#a78bfa" },
  { label: "FREE BREAKFAST", sub: "Select Ooty hotels",     code: "OOTYBRK",  color1: "#1aa15e", color2: "#34d399" },
];

const TRUST = [
  { icon: Shield, label: "100% Secure" },
  { icon: Star,   label: "4.8 Rated"   },
  { icon: MapPin, label: "50+ Cities"  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Traveller";

  return (
    <div className="space-y-7 pb-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <p className="text-[13px] text-muted font-medium">{getGreeting()} 👋</p>
          <h1 className="text-[26px] font-extrabold text-ink tracking-tight leading-tight">
            {firstName}
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-[#0077b6]" />
            <p className="text-[12px] text-muted font-medium">Coimbatore, Tamil Nadu</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/inbox")}
          className="relative flex size-12 items-center justify-center rounded-2xl bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)] press"
        >
          <Bell size={20} className="text-ink" />
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#e3483a] text-[10px] font-extrabold text-white">
            3
          </span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="animate-fade-in-up delay-100">
        <AskBar />
      </div>

      {/* ── Hero ── */}
      <div className="animate-scale-in delay-200">
        <div
          className="relative overflow-hidden rounded-3xl p-6"
          style={{ background: "linear-gradient(135deg,#0077b6 0%,#023e8a 60%,#03045e 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="absolute right-16 -bottom-10 size-28 rounded-full bg-white/5" />
          <div className="absolute -right-2 top-12 size-16 rounded-full bg-white/10" />

          <div className="relative z-10 max-w-[60%]">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
              <div className="size-1.5 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                AI Travel Assistant
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
              Plan Your<br />Perfect Trip
            </h2>
            <p className="text-[13px] text-white/70 mt-2 mb-5 leading-relaxed">
              Hotels · Cabs · Food · Itinerary — one chat away
            </p>
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#0077b6] press shadow-sm"
            >
              Start Planning →
            </button>
          </div>

          {/* Floating elements */}
          <div className="absolute right-5 top-5 text-5xl animate-float">✈️</div>
          <div className="absolute right-10 bottom-5 text-3xl animate-float delay-300">🌏</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="animate-fade-in-up delay-200">
        <QuickActionGrid />
      </div>

      {/* ── Hot Deals ── */}
      <div className="animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-ink">🔥 Hot Deals</h2>
          <button type="button" className="text-[13px] font-bold text-[#0077b6] flex items-center">
            All <ChevronRight size={14} />
          </button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {OFFERS.map((offer, idx) => (
            <div
              key={offer.code}
              className={`shrink-0 w-52 rounded-3xl p-4 press animate-fade-in-up delay-${(idx+1)*100}`}
              style={{ background: `linear-gradient(135deg,${offer.color1},${offer.color2})` }}
            >
              <p className="text-base font-extrabold text-white">{offer.label}</p>
              <p className="text-[12px] text-white/75 mt-0.5 mb-3">{offer.sub}</p>
              <div className="flex items-center justify-between">
                <div className="rounded-xl border border-white/40 bg-white/15 px-2.5 py-1">
                  <span className="text-[11px] font-extrabold text-white tracking-widest">{offer.code}</span>
                </div>
                <span className="text-[12px] font-bold text-white/80">Copy →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Updates ── */}
      <div className="animate-fade-in-up delay-300">
        <LiveUpdates />
      </div>

      {/* ── Trending ── */}
      <div className="animate-fade-in-up delay-400">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#0077b6]" />
          <h2 className="text-base font-extrabold text-ink">Trending Destinations</h2>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {TRENDING.map((dest, idx) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => navigate("/chat", { state: { prefill: `Plan a trip to ${dest.name}` } })}
              className={`shrink-0 flex flex-col items-center gap-2 rounded-2xl bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] px-4 py-3 min-w-[72px] press hover-lift animate-scale-in delay-${(idx+1)*100} border border-line/60`}
            >
              <span className="text-3xl">{dest.emoji}</span>
              <p className="text-[12px] font-extrabold text-ink">{dest.name}</p>
              <span className="rounded-full bg-[#0077b6] px-2 py-0.5 text-[10px] font-bold text-white">
                {dest.temp}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Weather ── */}
      <div className="animate-fade-in-up delay-400">
        <WeatherWidget />
      </div>

      {/* ── AI Suggestion ── */}
      <div className="animate-fade-in-up delay-500">
        <AISuggestionCard />
      </div>

      {/* ── Top Destinations ── */}
      <div className="animate-fade-in-up delay-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-ink">Top Destinations</h2>
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="text-[13px] font-bold text-[#0077b6] flex items-center"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {TOP_DESTINATIONS.map((dest, idx) => (
            <div
              key={dest.name}
              className={`animate-scale-in delay-${(idx+1)*100} hover-lift`}
            >
              <DestinationCard
                name={dest.name}
                tag={dest.tag}
                icon={dest.icon}
                gradient={DESTINATION_GRADIENTS[dest.key]}
                rating={dest.rating}
                className="sm:w-full sm:h-48"
                onClick={() => navigate("/chat", { state: { prefill: `Plan a trip to ${dest.name}` } })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Promo ── */}
      <div className="animate-fade-in-up delay-600">
        <PromoBanner />
      </div>

      {/* ── Trust Bar ── */}
      <div className="flex items-center justify-around rounded-2xl bg-white shadow-card p-4 animate-fade-in delay-700">
        {TRUST.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={18} className="text-[#0077b6]" />
            <p className="text-[11px] font-bold text-ink">{label}</p>
          </div>
        ))}
      </div>

    </div>
  );
}