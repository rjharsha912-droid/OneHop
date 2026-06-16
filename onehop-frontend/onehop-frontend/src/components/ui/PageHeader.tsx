import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, onBack, showBack = true, right, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("flex items-center gap-3 px-1 py-1", className)}>
      {showBack && (
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-card text-ink hover:bg-line/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
