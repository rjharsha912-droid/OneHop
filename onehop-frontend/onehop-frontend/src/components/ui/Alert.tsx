import { AlertTriangle, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "warning" | "info" | "danger";

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const toneStyles: Record<Tone, { bg: string; text: string; icon: ReactNode }> = {
  warning: { bg: "bg-warning-light", text: "text-warning", icon: <AlertTriangle size={18} /> },
  danger: { bg: "bg-danger-light", text: "text-danger", icon: <AlertTriangle size={18} /> },
  info: { bg: "bg-info-light", text: "text-info", icon: <Info size={18} /> },
};

export function Alert({ tone = "info", title, children, onDismiss, className }: AlertProps) {
  const style = toneStyles[tone];
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl p-3.5 text-sm", style.bg, className)}>
      <span className={cn("mt-0.5 shrink-0", style.text)}>{style.icon}</span>
      <div className="min-w-0 flex-1">
        {title && <p className={cn("font-semibold", style.text)}>{title}</p>}
        <p className="text-body">{children}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-muted hover:bg-black/5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
