import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export function AISuggestionCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/commute")}
      className="w-full text-left press"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-4"
        style={{ background: "linear-gradient(135deg,#0077b6 0%,#7c5cfc 100%)" }}
      >
        {/* Decorative */}
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute right-8 -bottom-6 size-16 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-0.5">
              AI Suggestion
            </p>
            <p className="text-sm font-bold text-white leading-snug">
              Heavy rain expected. Shared cab at <span className="text-yellow-300">₹85</span> arriving 8:52 AM
            </p>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    </button>
  );
}