# routes/food.py — Restaurant search by city

from fastapi import APIRouter, HTTPException, Depends
from middleware.auth import verify_token

router = APIRouter()

RESTAURANTS_DATA = {
    "Goa": [
        {"name": "Fisherman's Wharf", "cuisine": "Seafood", "avg_cost_per_person": 800, "rating": 4.6, "type": "Non-Veg", "location": "Cavelossim", "specialty": "Grilled Fish, Lobster"},
        {"name": "Gunpowder", "cuisine": "South Indian", "avg_cost_per_person": 600, "rating": 4.5, "type": "Veg", "location": "Assagao", "specialty": "Kerala Meals, Dosas"},
        {"name": "Britto's", "cuisine": "Multi-Cuisine", "avg_cost_per_person": 700, "rating": 4.3, "type": "Non-Veg", "location": "Baga Beach", "specialty": "Prawn Curry, Fish Thali"},
        {"name": "Infantaria", "cuisine": "Bakery & Cafe", "avg_cost_per_person": 300, "rating": 4.4, "type": "Cafes", "location": "Calangute", "specialty": "Croissants, Coffee"},
        {"name": "Cafe Tato", "cuisine": "Street Food", "avg_cost_per_person": 150, "rating": 4.5, "type": "Street Food", "location": "Panaji", "specialty": "Pav Bhaji, Misal"},
    ],
    "Ooty": [
        {"name": "Shinkow's Chinese Restaurant", "cuisine": "Chinese", "avg_cost_per_person": 400, "rating": 4.3, "type": "Non-Veg", "location": "Ooty Town", "specialty": "Noodles, Fried Rice"},
        {"name": "Willy's Coffee Pub", "cuisine": "Cafe", "avg_cost_per_person": 350, "rating": 4.5, "type": "Cafes", "location": "Charring Cross", "specialty": "Hot Chocolate, Waffles"},
        {"name": "Hotel Dasaprakash", "cuisine": "South Indian", "avg_cost_per_person": 250, "rating": 4.4, "type": "Veg", "location": "Ooty Town", "specialty": "Idli, Dosa, Filter Coffee"},
        {"name": "The Autumn Leaf", "cuisine": "Multi-Cuisine", "avg_cost_per_person": 500, "rating": 4.2, "type": "Non-Veg", "location": "Fern Hill", "specialty": "Pasta, Grills"},
        {"name": "Chaat Street", "cuisine": "Street Food", "avg_cost_per_person": 100, "rating": 4.3, "type": "Street Food", "location": "Market Area", "specialty": "Pani Puri, Bhel"},
    ],
    "Mumbai": [
        {"name": "Leopold Cafe", "cuisine": "Multi-Cuisine", "avg_cost_per_person": 800, "rating": 4.4, "type": "Non-Veg", "location": "Colaba", "specialty": "Fish & Chips, Biryani"},
        {"name": "Britannia & Co", "cuisine": "Parsi", "avg_cost_per_person": 600, "rating": 4.7, "type": "Non-Veg", "location": "Ballard Estate", "specialty": "Berry Pulao, Dhansak"},
        {"name": "Cafe Madras", "cuisine": "South Indian", "avg_cost_per_person": 200, "rating": 4.5, "type": "Veg", "location": "Matunga", "specialty": "Idli, Vada, Filter Coffee"},
        {"name": "Juhu Chowpatty", "cuisine": "Street Food", "avg_cost_per_person": 100, "rating": 4.6, "type": "Street Food", "location": "Juhu Beach", "specialty": "Bhel Puri, Sev Puri"},
        {"name": "The Bombay Canteen", "cuisine": "Modern Indian", "avg_cost_per_person": 1200, "rating": 4.6, "type": "Non-Veg", "location": "Lower Parel", "specialty": "Modern Indian Cuisine"},
    ],
    "Delhi": [
        {"name": "Karim's", "cuisine": "Mughlai", "avg_cost_per_person": 500, "rating": 4.6, "type": "Non-Veg", "location": "Jama Masjid", "specialty": "Mutton Korma, Seekh Kebab"},
        {"name": "Indian Accent", "cuisine": "Fine Dining", "avg_cost_per_person": 3000, "rating": 4.8, "type": "Non-Veg", "location": "Lodhi Road", "specialty": "Modern Indian Tasting Menu"},
        {"name": "Saravana Bhavan", "cuisine": "South Indian", "avg_cost_per_person": 300, "rating": 4.4, "type": "Veg", "location": "Connaught Place", "specialty": "Thali, Dosa, Idli"},
        {"name": "Paranthe Wali Gali", "cuisine": "Street Food", "avg_cost_per_person": 150, "rating": 4.5, "type": "Street Food", "location": "Chandni Chowk", "specialty": "Stuffed Paranthas"},
        {"name": "Blue Tokai Coffee", "cuisine": "Cafe", "avg_cost_per_person": 400, "rating": 4.5, "type": "Cafes", "location": "Vasant Vihar", "specialty": "Pour Over Coffee, Sandwiches"},
    ],
    "Jaipur": [
        {"name": "Laxmi Misthan Bhandar", "cuisine": "Rajasthani", "avg_cost_per_person": 300, "rating": 4.6, "type": "Veg", "location": "Johari Bazaar", "specialty": "Dal Baati Churma, Ghewar"},
        {"name": "Spice Court", "cuisine": "Rajasthani", "avg_cost_per_person": 600, "rating": 4.4, "type": "Non-Veg", "location": "Civil Lines", "specialty": "Laal Maas, Ker Sangri"},
        {"name": "Tapri Central", "cuisine": "Cafe", "avg_cost_per_person": 250, "rating": 4.5, "type": "Cafes", "location": "C-Scheme", "specialty": "Masala Chai, Sandwiches"},
        {"name": "Masala Chowk", "cuisine": "Street Food", "avg_cost_per_person": 150, "rating": 4.4, "type": "Street Food", "location": "Ram Niwas Garden", "specialty": "Kachori, Pyaaz Kachori"},
        {"name": "1135 AD", "cuisine": "Royal Rajasthani", "avg_cost_per_person": 2500, "rating": 4.7, "type": "Non-Veg", "location": "Amer Fort", "specialty": "Royal Thali, Game Meat"},
    ],
}


@router.get("/search")
async def search_restaurants(
    city: str,
    user_id: str = Depends(verify_token)
):
    city = city.strip().title()
    restaurants = RESTAURANTS_DATA.get(city)

    if not restaurants:
        raise HTTPException(
            status_code=404,
            detail=f"No restaurants found for {city}. Supported: {list(RESTAURANTS_DATA.keys())}"
        )

    return {
        "city": city,
        "restaurants": restaurants
    }


@router.get("/cities")
def get_food_cities():
    return {"cities": list(RESTAURANTS_DATA.keys())}