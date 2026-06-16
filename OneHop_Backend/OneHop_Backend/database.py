# database.py

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

load_dotenv()

username = quote_plus("onehop_user")
password = quote_plus(os.getenv("MONGO_PASSWORD", "Dharshaan@2120"))

MONGO_URI = (
    f"mongodb+srv://{username}:{password}"
    f"@onehop-cluster.dcpaspi.mongodb.net/onehop?appName=onehop-cluster"
)

client = AsyncIOMotorClient(MONGO_URI)
db = client.onehop

users_collection         = db.users
conversations_collection = db.conversations
