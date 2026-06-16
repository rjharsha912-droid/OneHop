import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, getApiErrorMessage } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading";
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "idle",
      error: null,

      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const { token, user } = await authApi.login(email, password);
          set({ token, user, status: "idle" });
        } catch (err) {
          set({ status: "idle", error: getApiErrorMessage(err, "Couldn't sign in. Check your details and try again.") });
          throw err;
        }
      },

      signup: async (name, email, password) => {
        set({ status: "loading", error: null });
        try {
          const { token, user } = await authApi.signup(name, email, password);
          set({ token, user, status: "idle" });
        } catch (err) {
          set({ status: "idle", error: getApiErrorMessage(err, "Couldn't create your account. Try a different email.") });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      refreshUser: async () => {
        if (!get().token) return;
        try {
          const user = await authApi.me();
          set({ user });
        } catch {
          // Token likely expired — sign the user out quietly
          set({ user: null, token: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "onehop-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
