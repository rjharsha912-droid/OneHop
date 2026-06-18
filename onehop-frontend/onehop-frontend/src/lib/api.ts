import axios, { AxiosError } from "axios";
import type {
  AuthResponse,
  ChatMessageResponse,
  ChatStartResponse,
  ConversationRecord,
  User,
} from "@/types";

/**
 * Base URL for the OneHop FastAPI backend.
 * Set VITE_API_BASE_URL in a .env file to point at your running backend, e.g.
 *   VITE_API_BASE_URL=http://localhost:8000/api
 * Falls back to localhost:8000/api (the default from the backend README).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const TOKEN_STORAGE_KEY = "onehop-auth";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** Reads the JWT from the zustand-persisted auth store in localStorage */
function readStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Friendly error message extraction for FastAPI's {detail: "..."} shape */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ detail?: string }>;
    if (!err.response) {
      return "Can't reach the OneHop server. Make sure the backend is running and VITE_API_BASE_URL is set correctly.";
    }
    const detail = err.response.data?.detail;
    if (typeof detail === "string") return detail;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// ──────────────────────────────────────────────
// Auth endpoints
// ──────────────────────────────────────────────

export const authApi = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signup", { name, email, password });
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};

// ──────────────────────────────────────────────
// Chat endpoints
// ──────────────────────────────────────────────

export const chatApi = {
  async start(): Promise<ChatStartResponse> {
    const { data } = await api.post<ChatStartResponse>("/chat/start");
    return data;
  },

  async sendMessage(conversationId: string, message: string): Promise<ChatMessageResponse> {
    const { data } = await api.post<ChatMessageResponse>("/chat/message", {
      message,
      conversation_id: conversationId,
    });
    return data;
  },

  async history(): Promise<ConversationRecord[]> {
    const { data } = await api.get<ConversationRecord[]>("/chat/history");
    return data;
  },

  async getConversation(id: string): Promise<ConversationRecord> {
    const { data } = await api.get<ConversationRecord>(`/chat/history/${id}`);
    return data;
  },

  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/chat/history/${id}`);
  },

  async cities(): Promise<{ cities: string[]; message: string }> {
    const { data } = await api.get("/chat/cities");
    return data;
  },

  async health(): Promise<{ chat_route: string; ai_engine: unknown }> {
    const { data } = await api.get("/chat/health");
    return data;
  },
};
// ──────────────────────────────────────────────
// Weather endpoints
// ──────────────────────────────────────────────

export type WeatherResponse = {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  condition: string;
  description: string;
  wind_speed: number;
  icon: string;
};

export const weatherApi = {
  async getWeather(city: string): Promise<WeatherResponse> {
    const { data } = await api.get<WeatherResponse>(`/weather/${city}`);
    return data;
  },
};

// ──────────────────────────────────────────────
// Cab endpoints
// ──────────────────────────────────────────────

export type CabEstimate = {
  cab_type: string;
  emoji: string;
  fare_min: number;
  fare_max: number;
  duration_hrs: number;
  distance_km: number;
};

export type CabResponse = {
  from_city: string;
  to_city: string;
  distance_km: number;
  estimates: CabEstimate[];
};

export const cabApi = {
  async getEstimate(fromCity: string, toCity: string): Promise<CabResponse> {
    const { data } = await api.get<CabResponse>("/cab/estimate", {
      params: { from_city: fromCity, to_city: toCity },
    });
    return data;
  },

  async getCities(): Promise<{ cities: string[] }> {
    const { data } = await api.get("/cab/cities");
    return data;
  },
};
export type Hotel = {
  name: string;
  type: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
  location: string;
};

export type HotelSearchResponse = {
  city: string;
  hotels: Hotel[];
};

export const hotelApi = {
  async searchHotels(city: string): Promise<HotelSearchResponse> {
    const { data } = await api.get<HotelSearchResponse>(`/hotels/search`, {
      params: { city },
    });
    return data;
  },
};
// ──────────────────────────────────────────────
// Food endpoints
// ──────────────────────────────────────────────

export type Restaurant = {
  name: string;
  cuisine: string;
  avg_cost_per_person: number;
  rating: number;
  type: string;
  location: string;
  specialty: string;
};

export type FoodSearchResponse = {
  city: string;
  restaurants: Restaurant[];
};

export const foodApi = {
  async searchRestaurants(city: string): Promise<FoodSearchResponse> {
    const { data } = await api.get<FoodSearchResponse>("/food/search", {
      params: { city },
    });
    return data;
  },
};

// ──────────────────────────────────────────────
// Profile endpoints
// ──────────────────────────────────────────────

export type ProfileStats = {
  total_trips: number;
  total_chats: number;
  travel_points: number;
  wallet_balance: number;
  flights_booked: number;
  hotels_booked: number;
  cabs_booked: number;
};

export const profileApi = {
  async getStats(): Promise<ProfileStats> {
    const { data } = await api.get<ProfileStats>("/profile/stats");
    return data;
  },

  async updateProfile(name: string): Promise<{ message: string; name: string }> {
    const { data } = await api.put("/profile/update", { name });
    return data;
  },
};