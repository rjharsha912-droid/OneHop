// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ──────────────────────────────────────────────
// Chat / Conversation
// ──────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/** Loosely-typed bag of answers collected by the AI engine's 10-question flow */
export interface TripData {
  city?: string;
  days?: string;
  people?: string;
  budget?: string;
  accommodation?: string;
  travel_style?: string;
  dietary?: string;
  transport?: string;
  activities?: string;
  departure_city?: string;
  [key: string]: string | undefined;
}

// ──────────────────────────────────────────────
// Itinerary (returned once is_complete = true)
// ──────────────────────────────────────────────

export interface Hotel {
  name: string;
  location: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
}

export interface Restaurant {
  name: string;
  cuisine: string;
  location: string;
  avg_cost_per_person: number;
  rating: number;
  must_try: string;
}

export interface TransportOption {
  type: string;
  provider: string;
  price_per_day: number;
  note: string;
}

export interface TouristPlace {
  name: string;
  type: string;
  entry_fee: number;
  best_time: string;
  description: string;
  location?: string;
}

export interface DayPlan {
  day: number;
  places_to_visit: TouristPlace[];
  recommended_restaurant: Restaurant;
  tip: string;
}

export interface CostEstimate {
  hotel: number;
  transport: number;
  food: number;
  total_estimated: number;
  budget_provided: number;
  within_budget: boolean;
}

export interface Itinerary {
  city: string;
  duration: string;
  travellers: number;
  departure_city: string;
  recommended_hotels: Hotel[];
  recommended_transport: TransportOption[];
  day_wise_plan: DayPlan[];
  cost_estimate: CostEstimate;
  error?: string;
}

// ──────────────────────────────────────────────
// API request / response shapes
// ──────────────────────────────────────────────

export interface ChatStartResponse {
  conversation_id: string;
  reply: string;
  next_question?: string | null;
  question_index: number;
  trip_data: TripData;
  is_complete: boolean;
}

export interface ChatMessageResponse {
  conversation_id: string;
  reply: string;
  next_question?: string | null;
  question_index: number;
  trip_data: TripData;
  itinerary?: Itinerary | null;
  is_complete: boolean;
}

export interface ConversationRecord {
  _id: string;
  user_id: string;
  messages: ChatMessage[];
  trip_data: TripData;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  detail: string;
}
