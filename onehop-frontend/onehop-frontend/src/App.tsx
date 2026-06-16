import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

import Onboarding from "@/pages/Onboarding";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Itinerary from "@/pages/Itinerary";
import Hotels from "@/pages/Hotels";
import Food from "@/pages/Food";
import Transport from "@/pages/Transport";
import Commute from "@/pages/Commute";
import Trips from "@/pages/Trips";
import Inbox from "@/pages/Inbox";
import Profile from "@/pages/Profile";
import BookingConfirmation from "@/pages/BookingConfirmation";

function RootRedirect() {
  const token = useAuthStore((s) => s.token);
  const hasSeenOnboarding = useUIStore((s) => s.hasSeenOnboarding);

  if (!hasSeenOnboarding) return <Navigate to="/onboarding" replace />;
  if (!token) return <Navigate to="/auth" replace />;
  return <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/trip" element={<Itinerary />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/food" element={<Food />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/commute" element={<Commute />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
