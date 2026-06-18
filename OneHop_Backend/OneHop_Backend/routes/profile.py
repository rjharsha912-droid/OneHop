# routes/profile.py — User profile and stats

from fastapi import APIRouter, HTTPException, Depends
from middleware.auth import verify_token
from database import users_collection, conversations_collection
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()

class UpdateProfileModel(BaseModel):
    name: str

# ──────────────────────────────────────────────
# GET /api/profile/stats
# Get user travel stats
# ──────────────────────────────────────────────

@router.get("/stats")
async def get_stats(user_id: str = Depends(verify_token)):
    # Count completed trips from MongoDB
    total_trips = await conversations_collection.count_documents({
        "user_id": user_id,
        "is_complete": True
    })

    total_chats = await conversations_collection.count_documents({
        "user_id": user_id
    })

    # Travel points = 100 per completed trip
    travel_points = total_trips * 100

    return {
        "total_trips": total_trips,
        "total_chats": total_chats,
        "travel_points": travel_points,
        "wallet_balance": 0,
        "flights_booked": 0,
        "hotels_booked": 0,
        "cabs_booked": 0,
    }


# ──────────────────────────────────────────────
# PUT /api/profile/update
# Update user name
# ──────────────────────────────────────────────

@router.put("/update")
async def update_profile(
    data: UpdateProfileModel,
    user_id: str = Depends(verify_token)
):
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty.")

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"name": data.name.strip()}}
    )
    return {"message": "Profile updated successfully", "name": data.name.strip()}