# models/conversation.py

from pydantic import BaseModel
from typing import List, Optional


class Message(BaseModel):
    role: str
    content: str


class TripDetails(BaseModel):
    destination:    Optional[str] = None
    duration:       Optional[str] = None
    group_size:     Optional[str] = None
    budget:         Optional[str] = None
    transport:      Optional[str] = None
    accommodation:  Optional[str] = None
    food:           Optional[str] = None
    interests:      Optional[str] = None
    dates:          Optional[str] = None
    special_needs:  Optional[str] = None


class ChatRequest(BaseModel):
    message:         str
    conversation_id: Optional[str] = None
    session_id:      Optional[str] = None
    trip_details:    Optional[TripDetails] = None
