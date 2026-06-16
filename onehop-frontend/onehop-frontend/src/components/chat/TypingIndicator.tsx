import { MapPin } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <MapPin size={14} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-4 py-3.5 shadow-card">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-faint"
            style={{
              animation: "onehop-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes onehop-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
