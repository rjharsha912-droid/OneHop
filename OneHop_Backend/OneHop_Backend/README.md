# OneHop Backend 🚀

## Folder structure

```
OneHop_Backend/
├── main.py                  ← FastAPI app entry point
├── database.py              ← MongoDB connection (Motor async)
├── .env                     ← Secrets (never commit this!)
├── requirements.txt
│
├── middleware/
│   └── auth.py              ← JWT token verification
│
├── models/
│   ├── user.py              ← Signup / Login request models
│   └── conversation.py      ← ChatRequest, TripDetails models
│
├── routes/
│   ├── auth.py              ← /api/auth/*
│   └── chat.py              ← /api/chat/*
│
├── mock_data.py             ← City data (hotels, restaurants, transport)
└── ai_engine/
    └── main.py              ← Standalone AI service (port 8001)
```

---

## Setup

```bash
# 1. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 2. Install packages
pip install -r requirements.txt
```

---

## Run

You need **2 terminals**:

**Terminal 1 — AI Engine (port 8001)**
```bash
# Make sure Ollama is running first:
ollama pull phi3:mini
ollama serve

# Then start AI engine:
cd ai_engine
python main.py
```

**Terminal 2 — Main Backend (port 8000)**
```bash
uvicorn main:app --reload --port 8000
```

Open **http://localhost:8000/docs** to test all endpoints.

---

## API Endpoints for Frontend Team

### Auth

| Method | URL | Auth required | Description |
|--------|-----|---------------|-------------|
| POST | `/api/auth/signup` | No | Register new user → returns JWT token |
| POST | `/api/auth/login` | No | Login → returns JWT token |
| GET | `/api/auth/me` | Yes | Get logged-in user details |

### Chat

| Method | URL | Auth required | Description |
|--------|-----|---------------|-------------|
| POST | `/api/chat/start` | Yes | Start new conversation → returns `conversation_id` |
| POST | `/api/chat/message` | Yes | Send message, get AI reply |
| GET | `/api/chat/history` | Yes | List all past conversations |
| GET | `/api/chat/history/{id}` | Yes | Get one conversation with full messages |
| DELETE | `/api/chat/history/{id}` | Yes | Delete a conversation |
| GET | `/api/chat/cities` | No | List supported cities |
| GET | `/api/chat/health` | No | Health check |

---

## How to use from frontend

### Step 1: Signup / Login
```
POST /api/auth/signup
Body: { "name": "Raj", "email": "raj@email.com", "password": "pass123" }
Response: { "token": "eyJ...", "user": { "id": "...", "name": "Raj", ... } }
```
Save the `token`. Send it in every authenticated request as:
```
Authorization: Bearer eyJ...
```

### Step 2: Start a chat
```
POST /api/chat/start
Headers: Authorization: Bearer <token>
Response: { "conversation_id": "abc123", "reply": "Namaste! Welcome...", ... }
```
Save the `conversation_id`.

### Step 3: Keep chatting
```
POST /api/chat/message
Headers: Authorization: Bearer <token>
Body: { "message": "Goa", "conversation_id": "abc123" }
Response: { "reply": "Got it! How many days...", "question_index": 1, ... }
```
When `is_complete: true` is returned, the `itinerary` object contains the full trip plan.

---

## .env file
```
MONGO_PASSWORD=Dharshaan@2120
JWT_SECRET=onehop_secret_2024
AI_ENGINE_URL=http://localhost:8001
```
