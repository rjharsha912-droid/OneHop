# routes/cab.py — Estimated cab fares between cities

from fastapi import APIRouter, HTTPException, Depends
from middleware.auth import verify_token

router = APIRouter()

CITY_DISTANCES = {
    ("Ooty", "Coimbatore"): 86,
    ("Ooty", "Bangalore"): 270,
    ("Ooty", "Chennai"): 540,
    ("Ooty", "Mysore"): 160,
    ("Goa", "Mumbai"): 590,
    ("Goa", "Bangalore"): 560,
    ("Goa", "Pune"): 450,
    ("Mumbai", "Pune"): 150,
    ("Mumbai", "Ahmedabad"): 530,
    ("Mumbai", "Delhi"): 1400,
    ("Delhi", "Jaipur"): 280,
    ("Delhi", "Agra"): 230,
    ("Delhi", "Chandigarh"): 250,
    ("Jaipur", "Agra"): 240,
    ("Jaipur", "Mumbai"): 1150,
    ("Chennai", "Bangalore"): 350,
    ("Chennai", "Pondicherry"): 150,
    ("Bangalore", "Mysore"): 145,
    ("Bangalore", "Hyderabad"): 570,
}

CAB_RATES = {
    "Mini":    {"per_km": 10, "base_fare": 50,  "emoji": "🚗"},
    "Sedan":   {"per_km": 13, "base_fare": 75,  "emoji": "🚙"},
    "SUV":     {"per_km": 18, "base_fare": 100, "emoji": "🚐"},
    "Sharing": {"per_km": 6,  "base_fare": 30,  "emoji": "🚌"},
}

def get_distance(from_city: str, to_city: str):
    key1 = (from_city, to_city)
    key2 = (to_city, from_city)
    return CITY_DISTANCES.get(key1) or CITY_DISTANCES.get(key2)

@router.get("/estimate")
async def get_cab_estimate(
    from_city: str,
    to_city: str,
    user_id: str = Depends(verify_token)
):
    from_city = from_city.strip().title()
    to_city   = to_city.strip().title()

    if from_city == to_city:
        raise HTTPException(status_code=400, detail="From and To cities cannot be the same.")

    distance = get_distance(from_city, to_city)
    if not distance:
        raise HTTPException(status_code=404, detail=f"Route not available between {from_city} and {to_city} yet.")

    estimates = []
    for cab_type, rates in CAB_RATES.items():
        fare = rates["base_fare"] + (distance * rates["per_km"])
        estimates.append({
            "cab_type":     cab_type,
            "emoji":        rates["emoji"],
            "fare_min":     int(fare * 0.9),
            "fare_max":     int(fare * 1.1),
            "duration_hrs": round(distance / 60, 1),
            "distance_km":  distance,
        })

    return {
        "from_city":   from_city,
        "to_city":     to_city,
        "distance_km": distance,
        "estimates":   estimates
    }

@router.get("/cities")
def get_cab_cities():
    cities = set()
    for (a, b) in CITY_DISTANCES.keys():
        cities.add(a)
        cities.add(b)
    return {"cities": sorted(list(cities))}