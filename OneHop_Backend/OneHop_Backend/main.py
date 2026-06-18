# main.py — OneHop Backend (Merged)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.weather import router as weather_router
from routes.cab import router as cab_router
from routes.hotels import router as hotels_router
from routes.food import router as food_router
from routes.profile import router as profile_router

app = FastAPI(title="OneHop Backend 🚀", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])
app.include_router(cab_router, prefix="/api/cab", tags=["Cab"])
app.include_router(hotels_router, prefix="/api/hotels", tags=["Hotels"])
app.include_router(food_router, prefix="/api/food", tags=["Food"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])

@app.get("/")
def root():
    return {"status": "OneHop Backend Running 🚀", "docs": "/docs"}