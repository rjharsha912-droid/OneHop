import { Bus, ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 text-white press"
      style={{ background: "linear-gradient(135deg,#0077b6 0%,#023e8a 100%)" }}
    >
      <div className="relative z-10">
        <span className="inline-block rounded-xl bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider mb-2">
          Limited Time
        </span>
        <p className="text-xl font-extrabold leading-tight">
          Flat 10% OFF<br />on Bus Bookings
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-1.5">
            <span className="text-xs font-extrabold tracking-widest">ONEHOP10</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-primary"
          >
            Book Now <ArrowRight size={12} />
          </button>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-2 opacity-20">
        <Bus size={100} strokeWidth={1} />
      </div>
    </div>
  );
}