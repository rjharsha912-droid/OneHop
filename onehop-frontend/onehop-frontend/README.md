# OneHop Frontend

React 18 + TypeScript + Tailwind CSS v4 frontend for the **OneHop** AI travel planning app.

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (@tailwindcss/vite) |
| Routing | React Router v6 |
| State | Zustand (with persist) |
| HTTP | Axios |
| Icons | Lucide React |

## Pages

| Route | Page | Description |
|---|---|---|
| `/onboarding` | Onboarding | 3-slide carousel (shows once) |
| `/auth` | Auth | Login + Signup with email |
| `/home` | Home | Dashboard with live updates, quick actions, destinations |
| `/chat` | Chat | 10-question AI trip planner, connects to backend |
| `/trip` | Itinerary | Full day-by-day plan with stay / travel / budget tabs |
| `/hotels` | Hotels | Filtered hotel browsing |
| `/food` | Food | Restaurant recommendations |
| `/transport` | Transport | Flights, trains, cabs, local transport tabs |
| `/commute` | Commute | Daily commuter scenario with cab comparison |
| `/trips` | Trips | Past conversation history (from backend) |
| `/inbox` | Inbox | Notifications / bookings / offers |
| `/profile` | Profile | User profile, bookings summary, settings |
| `/booking-confirmation` | BookingConfirmation | Post-booking success screen |

## Setup

### 1. Configure backend URL

```bash
cp .env.example .env
# Edit .env and set:
#   VITE_API_BASE_URL=http://localhost:8000/api
```

Or simply start the OneHop backend on `http://localhost:8000` — the frontend defaults to that.

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Production build

```bash
npm run build
npm run preview   # preview the build locally
```

## Backend connection

The frontend expects the OneHop backend at `VITE_API_BASE_URL` (default `http://localhost:8000/api`).

**Required backend services:**

1. **FastAPI** (`main.py`) on port `8000` — provides `/api/auth/*` and `/api/chat/*`
2. **AI Engine** (`ai_engine/main.py`) on port `8001` — provides the `/chat` route called internally by FastAPI

Start the backend:

```bash
cd OneHop_Backend
pip install -r requirements.txt

# Terminal 1 — main API
uvicorn main:app --reload --port 8000

# Terminal 2 — AI engine (also needs Ollama running)
cd ai_engine
uvicorn main:app --reload --port 8001

# Terminal 3 — Ollama (for LLM responses)
ollama serve
ollama pull phi3:mini
```

## Design tokens

All brand colours, shadows, and typography are defined in `src/index.css` as Tailwind v4 `@theme` tokens:

- **Primary orange**: `#ff6a00`
- **Accent purple**: `#7c5cfc`
- **Font**: Plus Jakarta Sans (headings) + Inter (body)

## Responsive design

- **Mobile** (< 768 px): bottom navigation bar (5 tabs + floating AI button)
- **Desktop** (≥ 768 px): left sidebar with navigation, wider content area
