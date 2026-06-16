# ai_engine/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import requests
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mock_data import get_city_data, get_available_cities

app = FastAPI(title="OneHop AI Engine", version="1.0.0")

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "phi3:mini"

TRIP_QUESTIONS = [
    "Which city in India would you like to visit? We support: Goa, Ooty, Mumbai, Delhi, Jaipur.",
    "How many days are you planning to stay?",
    "How many people are travelling?",
    "What is your total budget in INR? (e.g. 10000, 50000, 100000)",
    "What type of accommodation do you prefer? (budget / mid-range / luxury)",
    "What is your travel style? (adventure / relaxation / cultural / food / mixed)",
    "Do you have any dietary preferences? (vegetarian / non-vegetarian / vegan)",
    "What mode of transport do you prefer for local travel? (taxi / auto / public transport / rental)",
    "Are there any activities you specifically want to do? (beaches / trekking / shopping / sightseeing / nightlife)",
    "What is your departure city? (We'll help plan your travel to the destination)"
]

QUESTION_KEYS = [
    "city", "days", "people", "budget",
    "accommodation", "travel_style", "dietary",
    "transport", "activities", "departure_city"
]


# ---------- Models ----------

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


# ---------- Helpers ----------

def ask_ollama(prompt: str) -> str:
    """Send a prompt to local Ollama and return the response."""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120  # ← increased from 60
        )
        data = response.json()
        return data.get("response", "Sorry, I could not generate a response.")
    except requests.exceptions.ConnectionError:
        return "Ollama is not running. Please start Ollama with 'ollama serve'."
    except Exception as e:
        return f"AI error: {str(e)}"


def extract_city(message: str) -> Optional[str]:
    """Extract city name from user message."""
    message_lower = message.lower()
    for city in get_available_cities():
        if city in message_lower:
            return city
    return None


def filter_hotels_by_budget(hotels: list, budget: int, days: int, people: int) -> list:
    """Filter hotels based on budget per person per night."""
    budget_per_person_per_night = (budget * 0.4) / (people * days)
    filtered = [h for h in hotels if h["price_per_night"] <= budget_per_person_per_night]
    return filtered if filtered else [hotels[0]]


def filter_transport_by_preference(transport: list, preference: str) -> list:
    """Filter transport based on user preference."""
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
    """Build a full itinerary from trip data and mock data."""
    city = trip_data.get("city", "").lower()
    days = int(trip_data.get("days", 3))
    people = int(trip_data.get("people", 2))
    budget = int(trip_data.get("budget", 20000))
    accommodation = trip_data.get("accommodation", "mid-range").lower()
    transport_pref = trip_data.get("transport", "taxi")

    city_data = get_city_data(city)

    if not city_data:
        return {"error": f"No data available for {city}"}

    # --- Hotels ---
    hotels = city_data.get("hotels", [])
    if "budget" in accommodation:
        recommended_hotels = [h for h in hotels if h["price_per_night"] < 2000]
    elif "luxury" in accommodation:
        recommended_hotels = [h for h in hotels if h["price_per_night"] > 5000]
    else:
        recommended_hotels = [h for h in hotels if 2000 <= h["price_per_night"] <= 5000]

    if not recommended_hotels:
        recommended_hotels = hotels[:2]

    # --- Transport ---
    transport = filter_transport_by_preference(city_data.get("transport", []), transport_pref)

    # --- Restaurants ---
    restaurants = city_data.get("restaurants", [])

    # --- Tourist Places ---
    tourist_places = city_data.get("tourist_places", [])

    # --- Day-wise plan ---
    places_per_day = max(1, len(tourist_places) // days)
    day_plan = []
    place_index = 0

    for day in range(1, days + 1):
        daily_places = []
        for _ in range(places_per_day):
            if place_index < len(tourist_places):
                daily_places.append(tourist_places[place_index])
                place_index += 1

        restaurant_for_day = restaurants[day % len(restaurants)]

        day_plan.append({
            "day": day,
            "places_to_visit": daily_places,
            "recommended_restaurant": restaurant_for_day,
            "tip": "Start early to avoid crowds at popular spots."
        })

    # --- Cost Estimate ---
    hotel_cost = recommended_hotels[0]["price_per_night"] * days * (people // 2 or 1)
    transport_cost = transport[0]["price_per_day"] * days
    food_cost = restaurants[0]["avg_cost_per_person"] * people * days * 3
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


def build_itinerary_prompt(trip_data: dict, itinerary: dict) -> str:
    """Build a shorter prompt for faster Ollama response."""
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


# ---------- Routes ----------

@app.get("/")
def root():
    return {"message": "OneHop AI Engine is running", "model": OLLAMA_MODEL}


@app.get("/health")
def health():
    """Check if Ollama is reachable."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            return {"status": "healthy", "ollama": "connected", "model": OLLAMA_MODEL}
    except:
        pass
    return {"status": "unhealthy", "ollama": "disconnected"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Asks 10 questions one by one, then builds and returns itinerary.
    """
    message = request.message.strip()
    history = request.conversation_history
    trip_data = request.trip_data.copy()
    question_index = len(trip_data)

    # --- Greeting on first message ---
    if question_index == 0 and not message:
        return ChatResponse(
            reply="Namaste! 🙏 Welcome to OneHop — your personal Indian travel assistant! I'll help you plan the perfect trip. Let's start!",
            next_question=TRIP_QUESTIONS[0],
            question_index=0,
            trip_data=trip_data
        )

    # --- Store the answer to current question ---
    if question_index < len(QUESTION_KEYS):
        key = QUESTION_KEYS[question_index]

        # Special handling for city
        if key == "city":
            city = extract_city(message)
            if not city:
                return ChatResponse(
                    reply=f"Sorry, we don't have data for that city yet. Please choose from: {', '.join(get_available_cities()).title()}",
                    next_question=TRIP_QUESTIONS[0],
                    question_index=0,
                    trip_data=trip_data
                )
            trip_data["city"] = city
        else:
            trip_data[key] = message

        question_index = len(trip_data)

    # --- Ask next question if not all answered ---
    if question_index < len(TRIP_QUESTIONS):
        next_q = TRIP_QUESTIONS[question_index]

        return ChatResponse(
            reply="Got it! ✅",
            next_question=next_q,
            question_index=question_index,
            trip_data=trip_data
        )

    # --- All 10 questions answered — build itinerary ---
    itinerary = build_itinerary(trip_data)

    # --- Ask Ollama to summarize ---
    prompt = build_itinerary_prompt(trip_data, itinerary)
    ai_summary = ask_ollama(prompt)

    return ChatResponse(
        reply=ai_summary,
        question_index=10,
        trip_data=trip_data,
        itinerary=itinerary,
        is_complete=True
    )


# ---------- Run ----------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)