# routes/weather.py — Live weather for OneHop cities

from fastapi import APIRouter, HTTPException, Depends
from middleware.auth import verify_token
import httpx
import os

router = APIRouter()

OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

SUPPORTED_CITIES = ["Goa", "Ooty", "Mumbai", "Delhi", "Jaipur"]


# ──────────────────────────────────────────────
# GET /api/weather/{city}
# Get live weather for a city (requires login)
# ──────────────────────────────────────────────

@router.get("/{city}")
async def get_weather(city: str, user_id: str = Depends(verify_token)):
    """
    Returns live weather data for supported Indian cities.
    """
    # Normalize city name
    city = city.strip().title()

    if city not in SUPPORTED_CITIES:
        raise HTTPException(
            status_code=400,
            detail=f"City '{city}' not supported. Supported cities: {SUPPORTED_CITIES}"
        )

    if not OPENWEATHER_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Weather API key not configured. Add OPENWEATHER_API_KEY to .env"
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                OPENWEATHER_URL,
                params={
                    "q":     f"{city},IN",
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric"   # Celsius
                }
            )

            if response.status_code == 401:
                raise HTTPException(status_code=500, detail="Invalid API key. Check OPENWEATHER_API_KEY in .env")

            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"Weather data not found for {city}.")

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Weather API error: {response.text}")

            data = response.json()

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Weather API took too long. Try again.")

    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Cannot reach weather service. Check internet connection.")

    # Return clean, useful response
    return {
        "city":        city,
        "country":     "IN",
        "temperature": data["main"]["temp"],
        "feels_like":  data["main"]["feels_like"],
        "humidity":    data["main"]["humidity"],
        "condition":   data["weather"][0]["main"],
        "description": data["weather"][0]["description"].capitalize(),
        "wind_speed":  data["wind"]["speed"],
        "icon":        f"https://openweathermap.org/img/wn/{data['weather'][0]['icon']}@2x.png"
    }


# ──────────────────────────────────────────────
# GET /api/weather/health
# Quick check — no auth needed
# ──────────────────────────────────────────────

@router.get("/health")
async def weather_health():
    key_set = bool(OPENWEATHER_API_KEY)
    return {
        "weather_route": "healthy",
        "api_key_configured": key_set
    }