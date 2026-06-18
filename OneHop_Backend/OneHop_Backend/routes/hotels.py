# routes/hotels.py — Hotel search by city

from fastapi import APIRouter, HTTPException, Depends
from middleware.auth import verify_token

router = APIRouter()

HOTELS_DATA = {
    "Goa": [
        {"name": "Taj Holiday Village Resort", "type": "Resort", "price_per_night": 8500, "rating": 4.8, "amenities": ["Pool", "Spa", "Beach Access", "WiFi"], "location": "Sinquerim Beach"},
        {"name": "The Leela Goa", "type": "Luxury", "price_per_night": 12000, "rating": 4.9, "amenities": ["Pool", "Spa", "Restaurant", "WiFi"], "location": "Mobor Beach"},
        {"name": "Zostel Goa", "type": "Budget", "price_per_night": 800, "rating": 4.2, "amenities": ["WiFi", "Common Kitchen", "Lounge"], "location": "Panaji"},
        {"name": "Kenilworth Beach Resort", "type": "Resort", "price_per_night": 5500, "rating": 4.5, "amenities": ["Pool", "Restaurant", "WiFi", "Gym"], "location": "Utorda Beach"},
    ],
    "Ooty": [
        {"name": "Savoy Hotel", "type": "Heritage", "price_per_night": 6500, "rating": 4.7, "amenities": ["Garden", "Restaurant", "WiFi", "Fireplace"], "location": "Sylks Road"},
        {"name": "Sterling Ooty Fern Hill", "type": "Resort", "price_per_night": 4500, "rating": 4.5, "amenities": ["Pool", "Spa", "Restaurant", "WiFi"], "location": "Fern Hill"},
        {"name": "Hotel Lakeview", "type": "Budget", "price_per_night": 1200, "rating": 4.0, "amenities": ["WiFi", "Restaurant", "Parking"], "location": "Ooty Lake"},
        {"name": "The Monarch", "type": "Villa", "price_per_night": 3500, "rating": 4.3, "amenities": ["Garden", "WiFi", "Kitchen", "Parking"], "location": "Charring Cross"},
    ],
    "Mumbai": [
        {"name": "The Taj Mahal Palace", "type": "Luxury", "price_per_night": 25000, "rating": 4.9, "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "Bar"], "location": "Colaba"},
        {"name": "Trident Nariman Point", "type": "Luxury", "price_per_night": 15000, "rating": 4.7, "amenities": ["Pool", "Spa", "Restaurant", "WiFi"], "location": "Nariman Point"},
        {"name": "Hotel Residency", "type": "Budget", "price_per_night": 2500, "rating": 4.1, "amenities": ["WiFi", "Restaurant", "AC"], "location": "Fort"},
        {"name": "ITC Grand Central", "type": "5★", "price_per_night": 12000, "rating": 4.6, "amenities": ["Pool", "Spa", "Gym", "Restaurant", "WiFi"], "location": "Parel"},
    ],
    "Delhi": [
        {"name": "The Imperial New Delhi", "type": "Luxury", "price_per_night": 18000, "rating": 4.9, "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "Bar"], "location": "Connaught Place"},
        {"name": "Taj Hotel & Convention Centre", "type": "5★", "price_per_night": 14000, "rating": 4.7, "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "Gym"], "location": "Dwarka"},
        {"name": "Bloom Hotel", "type": "Budget", "price_per_night": 2000, "rating": 4.2, "amenities": ["WiFi", "AC", "Restaurant"], "location": "Vikaspuri"},
        {"name": "Leela Ambience Gurugram", "type": "Resort", "price_per_night": 9000, "rating": 4.6, "amenities": ["Pool", "Spa", "Gym", "Restaurant", "WiFi"], "location": "Gurugram"},
    ],
    "Jaipur": [
        {"name": "Rambagh Palace", "type": "Heritage", "price_per_night": 35000, "rating": 4.9, "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "Garden"], "location": "Bhawani Singh Road"},
        {"name": "Samode Haveli", "type": "Heritage", "price_per_night": 8000, "rating": 4.7, "amenities": ["Pool", "Restaurant", "WiFi", "Garden"], "location": "Gangapole"},
        {"name": "Hotel Pearl Palace", "type": "Budget", "price_per_night": 1500, "rating": 4.4, "amenities": ["WiFi", "Restaurant", "Rooftop"], "location": "Hathroi Fort"},
        {"name": "ITC Rajputana", "type": "5★", "price_per_night": 11000, "rating": 4.6, "amenities": ["Pool", "Spa", "Restaurant", "WiFi", "Gym"], "location": "Palace Road"},
    ],
}


@router.get("/search")
async def search_hotels(
    city: str,
    user_id: str = Depends(verify_token)
):
    city = city.strip().title()
    hotels = HOTELS_DATA.get(city)

    if not hotels:
        raise HTTPException(
            status_code=404,
            detail=f"No hotels found for {city}. Supported cities: {list(HOTELS_DATA.keys())}"
        )

    return {
        "city": city,
        "hotels": hotels
    }


@router.get("/cities")
def get_hotel_cities():
    return {"cities": list(HOTELS_DATA.keys())}