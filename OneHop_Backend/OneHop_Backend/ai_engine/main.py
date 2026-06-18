# ai_engine/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import requests
import json
import re
import sys
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
load_dotenv(os.path.join(BASE_DIR, ".env"))

from mock_data import get_city_data, get_available_cities

app = FastAPI(title="OneHop AI Engine", version="3.0.0")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SYSTEM_PROMPT = """You are OneHop AI, a friendly Indian travel assistant. You can chat naturally and answer ANY question about travel in India - destinations, food, culture, safety, weather, budgeting, best time to visit, local transport, etc.

We have detailed hotel/food/transport data for these cities only: Goa, Ooty, Mumbai, Delhi, Jaipur.

If the user wants a COMPLETE trip itinerary, gather these details through natural conversation (one or two at a time, not a rigid list):
- destination city (must be Goa, Ooty, Mumbai, Delhi, or Jaipur)
- number of days
- number of travellers
- total budget in INR
- accommodation preference (budget / mid-range / luxury)
- travel style (adventure / relaxation / cultural / food / mixed)
- dietary preference (vegetarian / non-vegetarian / vegan)
- local transport preference (taxi / auto / public transport / rental)
- activities of interest
- departure city

Once you have ALL ten details, end your reply with exactly this on its own line:
ITINERARY_READY: {"city": "...", "days": "...", "people": "...", "budget": "...", "accommodation": "...", "travel_style": "...", "dietary": "...", "transport": "...", "activities": "...", "departure_city": "..."}

Only output that line when you truly have all 10 details confirmed. Otherwise just chat normally. Keep replies short, warm, and friendly."""


class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []
    trip_data: dict = {}


class ChatResponse(BaseModel):
    reply: str
    next_question: Optional[str] = None
    question_index: int = 0
    trip_data: dict = {}
    itinerary: Optional[dict] = None
    is_complete: bool = False


def ask_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return "Gemini API key not configured. Add GEMINI_API_KEY to .env"
    try:
        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=30
        )
        data = response.json()
        if response.status_code != 200:
            err_msg = data.get("error", {}).get("message", response.text)
            return f"Gemini API error: {err_msg}"
        candidates = data.get("candidates", [])
        if not candidates:
            return "Sorry, I could not generate a response."
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return "Sorry, I could not generate a response."
        return parts[0].get("text", "Sorry, I could not generate a response.")
    except requests.exceptions.Timeout:
        return "Gemini API took too long. Please try again."
    except requests.exceptions.ConnectionError:
        return "Could not reach Gemini API. Check internet connection."
    except Exception as e:
        return f"AI error: {str(e)}"


def build_prompt(history: list, message: str) -> str:
    convo_text = ""
    for turn in history[-12:]:
        role = "User" if turn.get("role") == "user" else "OneHop AI"
        convo_text += f"{role}: {turn.get('content', '')}\n"
    convo_text += f"User: {message}\nOneHop AI:"
    return f"{SYSTEM_PROMPT}\n\n{convo_text}"


def extract_itinerary_request(reply: str):
    match = re.search(r"ITINERARY_READY:\s*(\{.*\})", reply, re.DOTALL)
    if not match:
        return reply, None
    json_str = match.group(1)
    clean_reply = reply[:match.start()].strip()
    try:
        data = json.loads(json_str)
        return clean_reply, data
    except json.JSONDecodeError:
        return reply, None


def filter_transport_by_preference(transport: list, preference: str) -> list:
    preference_lower = preference.lower()
    if "public" in preference_lower:
        preferred = [t for t in transport if any(k in t["type"].lower() for k in ["bus", "train", "metro"])]
    elif "taxi" in preference_lower or "cab" in preference_lower:
        preferred = [t for t in transport if "taxi" in t["type"].lower() or "cab" in t["type"].lower()]
    elif "rental" in preference_lower:
        preferred = [t for t in transport if "rental" in t["type"].lower()]
    elif "auto" in preference_lower:
        preferred = [t for t in transport if "auto" in t["type"].lower() or "rickshaw" in t["type"].lower()]
    else:
        preferred = transport
    return preferred if preferred else transport


def build_itinerary(trip_data: dict) -> dict:
    city = str(trip_data.get("city", "")).lower()
    days = int(trip_data.get("days", 3) or 3)
    people = int(trip_data.get("people", 2) or 2)
    budget = int(trip_data.get("budget", 20000) or 20000)
    accommodation = str(trip_data.get("accommodation", "mid-range")).lower()
    transport_pref = str(trip_data.get("transport", "taxi"))

    city_data = get_city_data(city)
    if not city_data:
        return {"error": f"No data available for {city}"}

    hotels = city_data.get("hotels", [])
    if "budget" in accommodation:
        recommended_hotels = [h for h in hotels if h["price_per_night"] < 2000]
    elif "luxury" in accommodation:
        recommended_hotels = [h for h in hotels if h["price_per_night"] > 5000]
    else:
        recommended_hotels = [h for h in hotels if 2000 <= h["price_per_night"] <= 5000]
    if not recommended_hotels:
        recommended_hotels = hotels[:2]

    transport = filter_transport_by_preference(city_data.get("transport", []), transport_pref)
    restaurants = city_data.get("restaurants", [])
    tourist_places = city_data.get("tourist_places", [])

    places_per_day = max(1, len(tourist_places) // days)
    day_plan = []
    place_index = 0
    for day in range(1, days + 1):
        daily_places = []
        for _ in range(places_per_day):
            if place_index < len(tourist_places):
                daily_places.append(tourist_places[place_index])
                place_index += 1
        restaurant_for_day = restaurants[day % len(restaurants)] if restaurants else None
        day_plan.append({
            "day": day,
            "places_to_visit": daily_places,
            "recommended_restaurant": restaurant_for_day,
            "tip": "Start early to avoid crowds at popular spots."
        })

    hotel_cost = recommended_hotels[0]["price_per_night"] * days * (people // 2 or 1)
    transport_cost = transport[0]["price_per_day"] * days if transport else 0
    food_cost = restaurants[0]["avg_cost_per_person"] * people * days * 3 if restaurants else 0
    total_estimated = hotel_cost + transport_cost + food_cost

    return {
        "city": city.title(),
        "duration": f"{days} days",
        "travellers": people,
        "departure_city": trip_data.get("departure_city", "Not specified"),
        "recommended_hotels": recommended_hotels[:2],
        "recommended_transport": transport[:2],
        "day_wise_plan": day_plan,
        "cost_estimate": {
            "hotel": hotel_cost,
            "transport": transport_cost,
            "food": food_cost,
            "total_estimated": total_estimated,
            "budget_provided": budget,
            "within_budget": total_estimated <= budget
        }
    }


def build_itinerary_summary_prompt(trip_data: dict, itinerary: dict) -> str:
    city = trip_data.get('city', '').title()
    days = trip_data.get('days', '')
    budget = trip_data.get('budget', '')
    hotels = [h['name'] for h in itinerary.get('recommended_hotels', [])]
    total = itinerary.get('cost_estimate', {}).get('total_estimated', 0)
    within = itinerary.get('cost_estimate', {}).get('within_budget', False)

    return f"""You are OneHop, a friendly Indian travel assistant.
Write a short 3-4 sentence exciting travel summary for a {days}-day trip to {city}.
Budget: Rs{budget}. Recommended hotel: {hotels}. Estimated cost: Rs{total}. Within budget: {within}.
Be warm, friendly and specific to {city}. End with one travel tip."""


@app.get("/")
def root():
    return {"message": "OneHop AI Engine is running", "model": GEMINI_MODEL}


@app.get("/health")
def health():
    return {"status": "healthy" if GEMINI_API_KEY else "unhealthy", "gemini_configured": bool(GEMINI_API_KEY)}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    message = request.message.strip()
    history = request.conversation_history
    trip_data = request.trip_data.copy()

    if not message and not history:
        return ChatResponse(
            reply="Namaste! 🙏 I'm OneHop AI - ask me anything about travelling in India, or tell me you'd like a full trip plan!",
            trip_data=trip_data
        )

    prompt = build_prompt(history, message)
    raw_reply = ask_gemini(prompt)
    clean_reply, extracted_trip_data = extract_itinerary_request(raw_reply)

    if extracted_trip_data:
        city_lower = str(extracted_trip_data.get("city", "")).lower()
        if city_lower not in get_available_cities():
            return ChatResponse(
                reply=f"I can build detailed itineraries only for: {', '.join(c.title() for c in get_available_cities())}. Could you pick one of these?",
                trip_data=trip_data
            )

        itinerary = build_itinerary(extracted_trip_data)
        summary_prompt = build_itinerary_summary_prompt(extracted_trip_data, itinerary)
        ai_summary = ask_gemini(summary_prompt)

        return ChatResponse(
            reply=ai_summary,
            trip_data=extracted_trip_data,
            itinerary=itinerary,
            is_complete=True
        )

    return ChatResponse(
        reply=clean_reply,
        trip_data=trip_data,
        is_complete=False
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)