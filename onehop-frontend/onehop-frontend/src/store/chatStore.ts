import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chatApi, getApiErrorMessage } from "@/lib/api";
import type { ChatMessage, ConversationRecord, Itinerary, TripData } from "@/types";

interface ChatState {
  conversationId: string | null;
  messages: ChatMessage[];
  tripData: TripData;
  nextQuestion: string | null;
  questionIndex: number;
  itinerary: Itinerary | null;
  isComplete: boolean;
  status: "idle" | "loading";
  error: string | null;

  startNewTrip: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  loadConversation: (record: ConversationRecord) => void;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  conversationId: null as string | null,
  messages: [] as ChatMessage[],
  tripData: {} as TripData,
  nextQuestion: null as string | null,
  questionIndex: 0,
  itinerary: null as Itinerary | null,
  isComplete: false,
  status: "idle" as const,
  error: null as string | null,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startNewTrip: async () => {
        set({ status: "loading", error: null });
        try {
          const res = await chatApi.start();
          set({
            conversationId: res.conversation_id,
            messages: [{ role: "assistant", content: res.reply }],
            nextQuestion: res.next_question ?? null,
            questionIndex: res.question_index,
            tripData: res.trip_data,
            itinerary: null,
            isComplete: res.is_complete,
            status: "idle",
          });

          // The greeting and the first question usually arrive together;
          // surface the first question as its own chat bubble for a natural feel.
          if (res.next_question) {
            set((state) => ({
              messages: [...state.messages, { role: "assistant", content: res.next_question! }],
            }));
          }
        } catch (err) {
          set({ status: "idle", error: getApiErrorMessage(err, "Couldn't start a new trip. Is the backend running?") });
          throw err;
        }
      },

      sendMessage: async (text: string) => {
        const { conversationId } = get();
        if (!conversationId) {
          set({ error: "Start a trip first before sending a message." });
          return;
        }
        const trimmed = text.trim();
        if (!trimmed) return;

        set((state) => ({
          messages: [...state.messages, { role: "user", content: trimmed }],
          status: "loading",
          error: null,
        }));

        try {
          const res = await chatApi.sendMessage(conversationId, trimmed);
          const newAssistantMessages: ChatMessage[] = [{ role: "assistant", content: res.reply }];
          if (res.next_question) {
            newAssistantMessages.push({ role: "assistant", content: res.next_question });
          }
          set((state) => ({
            messages: [...state.messages, ...newAssistantMessages],
            nextQuestion: res.next_question ?? null,
            questionIndex: res.question_index,
            tripData: res.trip_data,
            itinerary: res.itinerary ?? state.itinerary,
            isComplete: res.is_complete,
            status: "idle",
          }));
        } catch (err) {
          set((state) => ({
            status: "idle",
            error: getApiErrorMessage(err, "Couldn't reach OneHop AI. Please try again."),
            messages: [
              ...state.messages,
              { role: "assistant", content: "Hmm, I couldn't process that — please try again in a moment." },
            ],
          }));
        }
      },

      loadConversation: (record: ConversationRecord) => {
        const tripData = record.trip_data ?? {};
        // Re-derive question progress: count how many trip_data fields are filled.
        const filled = Object.values(tripData).filter((v) => v !== undefined && v !== null && v !== "").length;
        set({
          conversationId: record._id,
          messages: record.messages ?? [],
          tripData,
          nextQuestion: null,
          questionIndex: record.is_complete ? TOTAL_TRIP_QUESTIONS : filled,
          itinerary: null,
          isComplete: record.is_complete,
          status: "idle",
          error: null,
        });
      },

      reset: () => set({ ...initialState }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "onehop-chat",
    }
  )
);

export const TOTAL_TRIP_QUESTIONS = 10;
