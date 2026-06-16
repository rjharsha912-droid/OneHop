import { Bus } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-accent to-accent-dark p-5 text-white">
      <div className="relative z-10 max-w-[70%]">
        <p className="text-lg font-extrabold leading-tight">Flat 10% OFF on Bus Bookings</p>
        <div className="mt-3 inline-flex items-center rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
          USE CODE: ONEHOP10
        </div>
      </div>
      <div className="absolute -right-4 bottom-0 flex size-28 items-center justify-center rounded-full bg-white/10 text-white/70">
        <Bus size={56} strokeWidth={1.5} />
      </div>
    </div>
  );
}
