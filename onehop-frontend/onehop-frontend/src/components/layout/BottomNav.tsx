import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)", boxShadow: "var(--shadow-nav)" }}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
        {NAV_ITEMS.map((item, idx) => {
          const isCenter = idx === 2; // OneHop AI — emphasized FAB
          if (isCenter) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="relative -mt-7 flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-white shadow-lg shadow-accent/30 active:scale-95 transition-transform"
              >
                <Sparkles size={24} />
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted"
                )
              }
            >
              {item.icon}
              <span>{item.label === "OneHop AI" ? "AI" : item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
