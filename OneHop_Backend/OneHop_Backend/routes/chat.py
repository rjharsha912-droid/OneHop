# routes/chat.py — Merged: Auth + MongoDB logging + AI Engine session

from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import verify_token
from models.conversation import ChatRequest
from database import conversations_collection
from datetime import datetime
from bson import ObjectId
from typing import Optional
import httpx
import os

router = APIRouter()

AI_ENGINE_URL = os.getenv("AI_ENGINE_URL", "http://localhost:8001")


# ──────────────────────────────────────────────
# Helper: call the AI engine (your friend's service)
# ──────────────────────────────────────────────

async def call_ai_engine(message: str, conversation_history: list, trip_data: dict) -> dict:
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{AI_ENGINE_URL}/chat",
                json={
                    "message":              message,
                    "conversation_history": conversation_history,
                    "trip_data":            trip_data
                }
            )
            if response.status_code == 200:
                return response.json()
            raise HTTPException(status_code=500, detail=f"AI Engine error: {response.text}")
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="AI Engine is not running. Start ai_engine/main.py on port 8001."
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="AI Engine took too long. Please try again."
        )


# ──────────────────────────────────────────────
# Helper: serialize MongoDB doc for JSON
# ──────────────────────────────────────────────

def serialize_conv(conv: dict) -> dict:
    conv["_id"] = str(conv["_id"])
    return conv


# ──────────────────────────────────────────────
# POST /api/chat/start
# Start a new conversation (requires login)
# ──────────────────────────────────────────────

@router.post("/start")
async def start_conversation(user_id: str = Depends(verify_token)):
    """
    Creates a new conversation in MongoDB and gets the greeting from the AI engine.
    Returns conversation_id — frontend must store this and send it on every /message call.
    """
    # Create blank conversation doc
    conv = {
        "user_id":    user_id,
        "messages":   [],
        "trip_data":  {},
        "is_complete": False,
        "created_at":  datetime.utcnow(),
        "updated_at":  datetime.utcnow()
    }
    result = await conversations_collection.insert_one(conv)
    conv_id = str(result.inserted_id)

    # Ask AI engine for the opening greeting
    ai_response = await call_ai_engine(
        message="",
        conversation_history=[],
        trip_data={}
    )

    greeting = ai_response.get("reply", "Namaste! Welcome to OneHop 🙏")

    # Save greeting into DB
    await conversations_collection.update_one(
        {"_id": ObjectId(conv_id)},
        {"$push": {"messages": {"role": "assistant", "content": greeting}},
         "$set":  {"updated_at": datetime.utcnow()}}
    )

    return {
        "conversation_id":  conv_id,
        "reply":            greeting,
        "next_question":    ai_response.get("next_question"),
        "question_index":   ai_response.get("question_index", 0),
        "trip_data":        {},
        "is_complete":      False
    }


# ──────────────────────────────────────────────
# POST /api/chat/message
# Send a message (requires login + conversation_id)
# ──────────────────────────────────────────────

@router.post("/message")
async def send_message(
    request: ChatRequest,
    user_id: str = Depends(verify_token)
):
    """
    Sends user message → AI engine → saves both turns to MongoDB → returns AI reply.
    """
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Require conversation_id from /start
    if not request.conversation_id:
        raise HTTPException(
            status_code=400,
            detail="conversation_id is required. Call /start first."
        )

    # Load conversation from DB
    conv = await conversations_collection.find_one(
        {"_id": ObjectId(request.conversation_id), "user_id": user_id}
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    if conv.get("is_complete"):
        return {
            "conversation_id": request.conversation_id,
            "reply":           "Your itinerary is ready! Start a new chat to plan another trip.",
            "is_complete":     True,
            "trip_data":       conv.get("trip_data", {})
        }

    # Build history list for AI engine
    history = conv.get("messages", [])

    # Call AI engine
    ai_response = await call_ai_engine(
        message=message,
        conversation_history=history,
        trip_data=conv.get("trip_data", {})
    )

    bot_reply  = ai_response.get("reply", "")
    trip_data  = ai_response.get("trip_data", conv.get("trip_data", {}))
    is_complete = ai_response.get("is_complete", False)

    # Persist both messages + updated trip_data to MongoDB
    new_messages = [
        {"role": "user",      "content": message},
        {"role": "assistant", "content": bot_reply}
    ]
    await conversations_collection.update_one(
        {"_id": ObjectId(request.conversation_id)},
        {
            "$push": {"messages": {"$each": new_messages}},
            "$set": {
                "trip_data":   trip_data,
                "is_complete": is_complete,
                "updated_at":  datetime.utcnow()
            }
        }
    )

    return {
        "conversation_id": request.conversation_id,
        "reply":           bot_reply,
        "next_question":   ai_response.get("next_question"),
        "question_index":  ai_response.get("question_index", 0),
        "trip_data":       trip_data,
        "itinerary":       ai_response.get("itinerary"),
        "is_complete":     is_complete
    }


# ──────────────────────────────────────────────
# GET /api/chat/history
# List all past conversations for logged-in user
# ──────────────────────────────────────────────

@router.get("/history")
async def get_history(user_id: str = Depends(verify_token)):
    cursor = conversations_collection.find(
        {"user_id": user_id}
    ).sort("updated_at", -1).limit(20)

    result = []
    async for conv in cursor:
        result.append(serialize_conv(conv))
    return result


# ──────────────────────────────────────────────
# GET /api/chat/history/{conversation_id}
# Get full details of one conversation
# ──────────────────────────────────────────────

@router.get("/history/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_id: str = Depends(verify_token)
):
    conv = await conversations_collection.find_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id}
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return serialize_conv(conv)


# ──────────────────────────────────────────────
# DELETE /api/chat/history/{conversation_id}
# Delete a conversation
# ──────────────────────────────────────────────

@router.delete("/history/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user_id: str = Depends(verify_token)
):
    await conversations_collection.delete_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id}
    )
    return {"message": "Conversation deleted."}


# ──────────────────────────────────────────────
# GET /api/chat/health
# Quick health check (no auth needed)
# ──────────────────────────────────────────────

@router.get("/health")
async def chat_health():
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(f"{AI_ENGINE_URL}/health")
            ai_status = r.json()
    except Exception:
        ai_status = {"status": "unreachable"}
    return {"chat_route": "healthy", "ai_engine": ai_status}


# ──────────────────────────────────────────────
# GET /api/chat/cities
# List supported cities (no auth needed)
# ──────────────────────────────────────────────

@router.get("/cities")
def get_cities():
    return {
        "cities": ["Goa", "Ooty", "Mumbai", "Delhi", "Jaipur"],
        "message": "OneHop currently supports these Indian cities."
    }
