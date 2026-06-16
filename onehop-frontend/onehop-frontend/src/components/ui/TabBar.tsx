import { cn } from "@/lib/utils";

interface TabBarProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export function TabBar<T extends string>({ tabs, active, onChange }: TabBarProps<T>) {
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative shrink-0 pb-3 text-[15px] font-semibold transition-colors",
            active === tab.id ? "text-primary" : "text-muted hover:text-ink"
          )}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
