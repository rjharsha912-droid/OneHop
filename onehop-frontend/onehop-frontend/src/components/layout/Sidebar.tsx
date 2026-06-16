import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-line bg-surface px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles size={18} />
        </div>
        <span className="text-xl font-extrabold text-ink">
          One<span className="text-primary">Hop</span>
        </span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] font-semibold transition-colors",
                isActive ? "bg-primary-light text-primary" : "text-body hover:bg-line/70"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => navigate("/chat")}
        className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-accent to-primary px-3.5 py-3 text-[15px] font-bold text-white shadow-sm transition-transform hover:scale-[1.01]"
      >
        <Sparkles size={20} />
        Plan with OneHop AI
      </button>

      {user && (
        <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
          <Avatar name={user.name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/auth");
            }}
            aria-label="Log out"
            className="shrink-0 rounded-full p-2 text-muted hover:bg-line hover:text-danger"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
