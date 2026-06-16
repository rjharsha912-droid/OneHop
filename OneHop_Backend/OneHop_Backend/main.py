# main.py — OneHop Backend (Merged)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.weather import router as weather_router

app = FastAPI(title="OneHop Backend 🚀", version="1.0.0")

# CORS — allows frontend (React/Flutter) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes  → /api/auth/signup, /api/auth/login, /api/auth/me
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

# Chat routes  → /api/chat/start, /api/chat/message, /api/chat/history …
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])

@app.get("/")
def root():
    return {"status": "OneHop Backend Running 🚀", "docs": "/docs"}
