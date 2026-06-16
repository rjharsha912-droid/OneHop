# routes/auth.py

from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from database import users_collection
from models.user import SignupModel, LoginModel
from middleware.auth import verify_token
from dotenv import load_dotenv
from bson import ObjectId
import os

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def create_token(user_id: str) -> str:
    payload = {
        "id":  user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")


@router.post("/signup")
async def signup(data: SignupModel):
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = pwd_context.hash(data.password)
    user = {
        "name":       data.name,
        "email":      data.email,
        "password":   hashed,
        "created_at": datetime.utcnow()
    }
    result  = await users_collection.insert_one(user)
    user_id = str(result.inserted_id)
    token   = create_token(user_id)

    return {
        "token": token,
        "user": {"id": user_id, "name": data.name, "email": data.email}
    }


@router.post("/login")
async def login(data: LoginModel):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password")

    user_id = str(user["_id"])
    token   = create_token(user_id)

    return {
        "token": token,
        "user": {"id": user_id, "name": user["name"], "email": user["email"]}
    }


@router.get("/me")
async def get_me(user_id: str = Depends(verify_token)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
