import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
    }),
    { name: "onehop-ui" }
  )
);
