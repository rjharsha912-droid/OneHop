import { Home, Map, MessageCircle, Bell, User } from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/home", label: "Home", icon: <Home size={22} /> },
  { to: "/trips", label: "Trips", icon: <Map size={22} /> },
  { to: "/chat", label: "OneHop AI", icon: <MessageCircle size={22} /> },
  { to: "/inbox", label: "Inbox", icon: <Bell size={22} /> },
  { to: "/profile", label: "Profile", icon: <User size={22} /> },
];
