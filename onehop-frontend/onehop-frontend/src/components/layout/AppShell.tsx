import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 pb-24 md:pb-10">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
