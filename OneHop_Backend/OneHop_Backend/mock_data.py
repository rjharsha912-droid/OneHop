# mock_data.py

MOCK_DATA = {
    "goa": {
        "hotels": [
            {"name": "The Leela Goa", "location": "Cavelossim Beach", "price_per_night": 8500, "rating": 4.8, "amenities": ["pool", "spa", "beach access", "wifi"]},
            {"name": "Taj Holiday Village", "location": "Sinquerim Beach", "price_per_night": 6500, "rating": 4.6, "amenities": ["pool", "restaurant", "beach access", "wifi"]},
            {"name": "Zostel Goa", "location": "Panjim", "price_per_night": 800, "rating": 4.2, "amenities": ["wifi", "common kitchen", "lounge"]},
            {"name": "Hotel Mandovi", "location": "Panjim", "price_per_night": 2500, "rating": 4.0, "amenities": ["wifi", "restaurant", "river view"]},
        ],
        "restaurants": [
            {"name": "Thalassa", "cuisine": "Greek-Goan", "location": "Vagator", "avg_cost_per_person": 1200, "rating": 4.7, "must_try": "Seafood Platter"},
            {"name": "Fisherman's Wharf", "cuisine": "Seafood", "location": "Cavelossim", "avg_cost_per_person": 900, "rating": 4.5, "must_try": "Prawn Balchão"},
            {"name": "Gunpowder", "cuisine": "South Indian", "location": "Assagao", "avg_cost_per_person": 700, "rating": 4.4, "must_try": "Kerala Fish Curry"},
            {"name": "Britto's", "cuisine": "Multi-cuisine", "location": "Baga Beach", "avg_cost_per_person": 600, "rating": 4.1, "must_try": "Grilled Kingfish"},
        ],
        "transport": [
            {"type": "Scooter Rental", "provider": "GoaWheels", "price_per_day": 400, "note": "Best way to explore Goa"},
            {"type": "Taxi (local)", "provider": "Goa Miles App", "price_per_day": 1500, "note": "AC cabs available"},
            {"type": "Bike Rental", "provider": "Royal Enfield Rentals", "price_per_day": 800, "note": "For longer routes"},
        ],
        "tourist_places": [
            {"name": "Baga Beach", "type": "Beach", "entry_fee": 0, "best_time": "Early morning or sunset", "description": "Most popular beach with shacks and water sports"},
            {"name": "Basilica of Bom Jesus", "type": "Heritage", "entry_fee": 0, "best_time": "Morning", "description": "UNESCO World Heritage Site, 16th century church"},
            {"name": "Dudhsagar Falls", "type": "Nature", "entry_fee": 400, "best_time": "Post monsoon (Oct-Nov)", "description": "Stunning 4-tiered waterfall on Karnataka border"},
            {"name": "Fort Aguada", "type": "Fort", "entry_fee": 0, "best_time": "Evening", "description": "17th century Portuguese fort with lighthouse"},
            {"name": "Anjuna Flea Market", "type": "Market", "entry_fee": 0, "best_time": "Wednesday morning", "description": "Famous weekly market for clothes, spices and souvenirs"},
        ]
    },

    "ooty": {
        "hotels": [
            {"name": "Savoy Hotel", "location": "Sylks Road", "price_per_night": 7000, "rating": 4.7, "amenities": ["garden", "restaurant", "fireplace", "wifi"]},
            {"name": "Sterling Ooty", "location": "Fern Hill", "price_per_night": 5000, "rating": 4.5, "amenities": ["pool", "restaurant", "valley view", "wifi"]},
            {"name": "YMCA Ooty", "location": "Ettines Road", "price_per_night": 1200, "rating": 3.8, "amenities": ["wifi", "cafeteria", "garden"]},
            {"name": "Hotel Welbeck", "location": "Ooty Town", "price_per_night": 2000, "rating": 4.0, "amenities": ["wifi", "restaurant", "parking"]},
        ],
        "restaurants": [
            {"name": "Shinkow's Chinese Restaurant", "cuisine": "Chinese", "location": "Commissioner's Road", "avg_cost_per_person": 400, "rating": 4.3, "must_try": "Noodle Soup"},
            {"name": "Hyderabad Biryani House", "cuisine": "North Indian", "location": "Charing Cross", "avg_cost_per_person": 350, "rating": 4.1, "must_try": "Dum Biryani"},
            {"name": "Garden Restaurant", "cuisine": "South Indian", "location": "Ooty Lake Road", "avg_cost_per_person": 250, "rating": 4.0, "must_try": "Masala Dosa"},
            {"name": "Earl's Secret", "cuisine": "Bakery & Cafe", "location": "Commissioner's Road", "avg_cost_per_person": 300, "rating": 4.4, "must_try": "Homemade Chocolates"},
        ],
        "transport": [
            {"type": "Toy Train", "provider": "Nilgiri Mountain Railway", "price_per_day": 300, "note": "UNESCO heritage train from Mettupalayam"},
            {"type": "Taxi", "provider": "Local Cabs", "price_per_day": 1800, "note": "Best for hill station sightseeing"},
            {"type": "TNSTC Bus", "provider": "Tamil Nadu State Transport", "price_per_day": 100, "note": "Budget option between towns"},
        ],
        "tourist_places": [
            {"name": "Ooty Lake", "type": "Nature", "entry_fee": 30, "best_time": "Morning", "description": "Artificial lake with boating and picnic spots"},
            {"name": "Botanical Gardens", "location": "Ooty Town", "type": "Garden", "entry_fee": 50, "best_time": "Morning", "description": "150-year-old garden with 650+ plant species"},
            {"name": "Doddabetta Peak", "type": "Nature", "entry_fee": 10, "best_time": "Early morning", "description": "Highest peak in Nilgiris at 2637m"},
            {"name": "Rose Garden", "type": "Garden", "entry_fee": 50, "best_time": "Morning", "description": "Largest rose garden in India with 20,000+ varieties"},
            {"name": "Pykara Falls", "type": "Nature", "entry_fee": 30, "best_time": "Post monsoon", "description": "Scenic waterfall and lake 21km from Ooty"},
        ]
    },

    "mumbai": {
        "hotels": [
            {"name": "Taj Mahal Palace", "location": "Colaba", "price_per_night": 25000, "rating": 4.9, "amenities": ["pool", "spa", "sea view", "wifi", "multiple restaurants"]},
            {"name": "The Oberoi Mumbai", "location": "Nariman Point", "price_per_night": 18000, "rating": 4.8, "amenities": ["pool", "spa", "sea view", "wifi"]},
            {"name": "Hotel Residency", "location": "Fort", "price_per_night": 3500, "rating": 4.1, "amenities": ["wifi", "restaurant", "AC"]},
            {"name": "Zostel Mumbai", "location": "Colaba", "price_per_night": 900, "rating": 4.0, "amenities": ["wifi", "common area", "lockers"]},
        ],
        "restaurants": [
            {"name": "Trishna", "cuisine": "Seafood", "location": "Fort", "avg_cost_per_person": 1500, "rating": 4.7, "must_try": "Butter Garlic Crab"},
            {"name": "Leopold Cafe", "cuisine": "Multi-cuisine", "location": "Colaba", "avg_cost_per_person": 800, "rating": 4.3, "must_try": "Chicken Schnitzel"},
            {"name": "Britannia & Co", "cuisine": "Parsi", "location": "Ballard Estate", "avg_cost_per_person": 600, "rating": 4.6, "must_try": "Berry Pulao"},
            {"name": "Juhu Beach Stalls", "cuisine": "Street Food", "location": "Juhu Beach", "avg_cost_per_person": 150, "rating": 4.4, "must_try": "Pav Bhaji & Bhel Puri"},
        ],
        "transport": [
            {"type": "Local Train", "provider": "Mumbai Suburban Railway", "price_per_day": 50, "note": "Fastest way to travel across Mumbai"},
            {"type": "Auto Rickshaw", "provider": "Metered Autos", "price_per_day": 400, "note": "Available in suburbs only"},
            {"type": "Taxi/Cab", "provider": "Ola/Uber", "price_per_day": 800, "note": "Best for South Mumbai"},
            {"type": "BEST Bus", "provider": "BEST Mumbai", "price_per_day": 80, "note": "Covers all of Mumbai"},
        ],
        "tourist_places": [
            {"name": "Gateway of India", "type": "Monument", "entry_fee": 0, "best_time": "Early morning or evening", "description": "Iconic 1924 archway overlooking the Arabian Sea"},
            {"name": "Marine Drive", "type": "Promenade", "entry_fee": 0, "best_time": "Sunset", "description": "3.6km boulevard known as Queen's Necklace at night"},
            {"name": "Elephanta Caves", "type": "Heritage", "entry_fee": 40, "best_time": "Morning", "description": "UNESCO site with rock-cut Shiva sculptures on island"},
            {"name": "Chhatrapati Shivaji Terminus", "type": "Heritage", "entry_fee": 0, "best_time": "Anytime", "description": "UNESCO listed Victorian Gothic railway station"},
            {"name": "Juhu Beach", "type": "Beach", "entry_fee": 0, "best_time": "Evening", "description": "Famous beach with bollywood celebrity bungalows nearby"},
        ]
    },

    "delhi": {
        "hotels": [
            {"name": "The Imperial New Delhi", "location": "Janpath", "price_per_night": 15000, "rating": 4.8, "amenities": ["pool", "spa", "wifi", "multiple restaurants"]},
            {"name": "Haveli Dharampura", "location": "Old Delhi", "price_per_night": 8000, "rating": 4.7, "amenities": ["heritage stay", "restaurant", "wifi", "rooftop"]},
            {"name": "Hotel Broadway", "location": "Daryaganj", "price_per_night": 3000, "rating": 4.0, "amenities": ["wifi", "restaurant", "AC"]},
            {"name": "Moustache Delhi Hostel", "location": "Karol Bagh", "price_per_night": 700, "rating": 4.3, "amenities": ["wifi", "common kitchen", "rooftop lounge"]},
        ],
        "restaurants": [
            {"name": "Karim's", "cuisine": "Mughlai", "location": "Jama Masjid, Old Delhi", "avg_cost_per_person": 400, "rating": 4.6, "must_try": "Mutton Korma & Seekh Kebab"},
            {"name": "Indian Accent", "cuisine": "Modern Indian", "location": "The Lodhi Hotel", "avg_cost_per_person": 3000, "rating": 4.9, "must_try": "Doda Barfi French Toast"},
            {"name": "Paranthe Wali Gali", "cuisine": "Street Food", "location": "Chandni Chowk", "avg_cost_per_person": 150, "rating": 4.4, "must_try": "Stuffed Paranthas"},
            {"name": "Saravana Bhavan", "cuisine": "South Indian", "location": "Connaught Place", "avg_cost_per_person": 300, "rating": 4.3, "must_try": "Ghee Roast Dosa"},
        ],
        "transport": [
            {"type": "Delhi Metro", "provider": "DMRC", "price_per_day": 100, "note": "Best way to avoid traffic, covers entire city"},
            {"type": "Auto Rickshaw", "provider": "Metered Autos", "price_per_day": 300, "note": "Good for short distances"},
            {"type": "Taxi/Cab", "provider": "Ola/Uber", "price_per_day": 700, "note": "Comfortable for longer routes"},
            {"type": "E-Rickshaw", "provider": "Local operators", "price_per_day": 100, "note": "Great for Old Delhi exploration"},
        ],
        "tourist_places": [
            {"name": "Red Fort", "type": "Heritage", "entry_fee": 35, "best_time": "Morning", "description": "17th century Mughal fort and UNESCO World Heritage Site"},
            {"name": "Qutub Minar", "type": "Heritage", "entry_fee": 35, "best_time": "Morning", "description": "Tallest brick minaret in the world, built in 1193"},
            {"name": "India Gate", "type": "Monument", "entry_fee": 0, "best_time": "Evening", "description": "War memorial and popular picnic spot on Rajpath"},
            {"name": "Humayun's Tomb", "type": "Heritage", "entry_fee": 35, "best_time": "Morning", "description": "First garden-tomb on Indian subcontinent, UNESCO site"},
            {"name": "Chandni Chowk", "type": "Market", "entry_fee": 0, "best_time": "Morning", "description": "One of oldest and busiest markets in India, Old Delhi"},
        ]
    },

    "jaipur": {
        "hotels": [
            {"name": "Rambagh Palace", "location": "Bhawani Singh Road", "price_per_night": 30000, "rating": 4.9, "amenities": ["pool", "spa", "polo ground", "wifi", "heritage stay"]},
            {"name": "Samode Haveli", "location": "Gangapole", "price_per_night": 10000, "rating": 4.7, "amenities": ["pool", "heritage stay", "restaurant", "wifi"]},
            {"name": "Hotel Pearl Palace", "location": "Hathroi Fort", "price_per_night": 1500, "rating": 4.5, "amenities": ["wifi", "rooftop restaurant", "AC"]},
            {"name": "Zostel Jaipur", "location": "Bani Park", "price_per_night": 600, "rating": 4.2, "amenities": ["wifi", "common area", "bicycle rental"]},
        ],
        "restaurants": [
            {"name": "Laxmi Mishtan Bhandar", "cuisine": "Rajasthani", "location": "Johari Bazaar", "avg_cost_per_person": 300, "rating": 4.5, "must_try": "Dal Baati Churma"},
            {"name": "Chokhi Dhani", "cuisine": "Rajasthani Village Cuisine", "location": "Tonk Road", "avg_cost_per_person": 800, "rating": 4.6, "must_try": "Rajasthani Thali"},
            {"name": "Niros Restaurant", "cuisine": "Multi-cuisine", "location": "MI Road", "avg_cost_per_person": 600, "rating": 4.3, "must_try": "Ghevar Dessert"},
            {"name": "Rawat Misthan Bhandar", "cuisine": "Street Food & Sweets", "location": "Station Road", "avg_cost_per_person": 200, "rating": 4.4, "must_try": "Pyaaz Kachori"},
        ],
        "transport": [
            {"type": "Auto Rickshaw", "provider": "Metered Autos", "price_per_day": 500, "note": "Widely available, negotiate fare"},
            {"type": "Taxi", "provider": "Ola/Uber/Local cabs", "price_per_day": 1200, "note": "Best for palace tours"},
            {"type": "Cycle Rickshaw", "provider": "Local operators", "price_per_day": 200, "note": "Great for Old City exploration"},
            {"type": "JCTSL Bus", "provider": "Jaipur City Transport", "price_per_day": 80, "note": "Budget option, covers major spots"},
        ],
        "tourist_places": [
            {"name": "Amber Fort", "type": "Fort", "entry_fee": 100, "best_time": "Morning", "description": "Magnificent Rajput fort with elephant rides and mirror palace"},
            {"name": "Hawa Mahal", "type": "Heritage", "entry_fee": 50, "best_time": "Morning", "description": "Palace of Winds with 953 small windows, iconic Jaipur landmark"},
            {"name": "City Palace", "type": "Heritage", "entry_fee": 200, "best_time": "Morning", "description": "Royal palace complex with museum and Chandra Mahal"},
            {"name": "Jantar Mantar", "type": "Heritage", "entry_fee": 50, "best_time": "Morning", "description": "UNESCO listed 18th century astronomical observatory"},
            {"name": "Johari Bazaar", "type": "Market", "entry_fee": 0, "best_time": "Afternoon", "description": "Famous for jewelry, gems, textiles and Rajasthani handicrafts"},
        ]
    }
}


def get_city_data(city: str) -> dict:
    """Returns mock data for a given city. Case-insensitive."""
    return MOCK_DATA.get(city.lower(), {})


def get_available_cities() -> list:
    """Returns list of all supported cities."""
    return list(MOCK_DATA.keys())


def get_hotels(city: str) -> list:
    """Returns hotel list for a city."""
    return MOCK_DATA.get(city.lower(), {}).get("hotels", [])


def get_restaurants(city: str) -> list:
    """Returns restaurant list for a city."""
    return MOCK_DATA.get(city.lower(), {}).get("restaurants", [])


def get_transport(city: str) -> list:
    """Returns transport options for a city."""
    return MOCK_DATA.get(city.lower(), {}).get("transport", [])


def get_tourist_places(city: str) -> list:
    """Returns tourist places for a city."""
    return MOCK_DATA.get(city.lower(), {}).get("tourist_places", [])


