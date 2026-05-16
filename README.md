# Affordmed Full Stack Evaluation — Notification System

## 1. Project Overview
This project is a full-stack notification system built for the Affordmed hiring evaluation. It features a React frontend and a Node.js/Express backend that fetches notifications from an external API, prioritizes them based on type (Placement > Result > Event), and displays them in a clean, responsive UI.

## 2. Tech Stack
**Frontend:**
- React.js (Vite)
- Material UI (MUI) for styling
- Axios for API requests
- React Router DOM for routing
- Date-fns for time formatting

**Backend:**
- Node.js
- Express.js
- Axios for external API fetching
- CORS & custom logging middleware

---

## 3. Folder Structure
```text
ROOT/
│
├── notification_app_be/       # Express Backend Service (Port 3002)
│   ├── controllers/           # HTTP Request Handlers
│   ├── middleware/            # Logging & Error Handling
│   ├── routes/                # API Routing
│   ├── services/              # Business Logic & Priority Sorting
│   ├── utils/                 # Constants & Response Helpers
│   ├── server.js              # Entry Point
│   └── .env                   # Env Variables
│
├── notification_app_fe/       # React Frontend Application (Port 3000)
│   ├── src/
│   │   ├── components/        # Reusable UI (NotificationCard)
│   │   ├── hooks/             # State Management (useNotifications)
│   │   ├── pages/             # Layouts (Dashboard)
│   │   └── services/          # API Config & Interceptors
│   ├── vite.config.js         # Port configuration
│   └── package.json           # Dependencies
│
├── notification_system_design.md  # Comprehensive 7-Stage Design Document
├── postman_collection.json        # API Testing Collection
└── .gitignore                     # Git Exclusions
```

---

## 4. Installation & Setup

### Environment Variables
1. Navigate to the backend directory: `cd notification_app_be`
2. Create a `.env` file based on the provided `.env.example`:
   ```text
   PORT=3002
   NODE_ENV=development
   ACCESS_CODE=SfFuWg
   ```

### Running the Backend
1. Open a terminal.
2. `cd notification_app_be`
3. `npm install`
4. `npm start` (or `node server.js`)
5. The backend will run on `http://localhost:3002`.

### Running the Frontend
1. Open a second terminal.
2. `cd notification_app_fe`
3. `npm install`
4. `npm run dev`
5. The frontend will run strictly on `http://localhost:3000`.

---

## 5. API Usage (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Returns top 10 prioritized notifications. |
| GET | `/api/notifications/all` | Returns all notifications. |
| GET | `/api/notifications/type/placement` | Returns only placement notifications. |
| GET | `/api/notifications/type/result` | Returns only result notifications. |
| GET | `/api/notifications/type/event` | Returns only event notifications. |

*Note: A Postman collection (`postman_collection.json`) is included in the root directory for easy testing.*

---

## 6. Features Implemented
- **Dynamic Priority Engine:** Backend algorithm sorts data automatically in `O(n log n)` time.
- **Resilient Fetching:** Backend automatically falls back to mock data if the external Affordmed API is down or the access code expires.
- **Frontend Logging Middleware:** Axios interceptors log all requests and responses in the browser console.
- **Backend Logging Middleware:** Custom Express middleware logs colored HTTP status codes and response times.
- **Global Error Handling:** Clean JSON error responses instead of stack traces.
- **Responsive UI:** MUI ensures perfect rendering on mobile and desktop.
- **Pagination:** 5 items per page for optimal UX.
- **Read State:** Mark notifications as "viewed" to dim them visually.

---

## 7. Screenshots
*(Add screenshots here before submission)*
- `[Screenshot 1: Frontend Dashboard showing Top 10]`
- `[Screenshot 2: Backend Terminal showing Logging Middleware]`
- `[Screenshot 3: Filtered tab view]`

---

## 8. Assumptions Made
- If the external API fails (e.g., 401 Unauthorized due to access code limits), the backend uses an internal mock dataset to ensure the application remains testable and fully functional.
- The "viewed" state is maintained locally in React state for UI demonstration purposes (as no local database was requested for Stage 6/7).
- Placements are the highest priority (1), followed by Results (2), and Events (3).

---

## 9. Future Improvements
- Integrate **MongoDB** to persist the "viewed" state per user.
- Implement **BullMQ/RabbitMQ** (as designed in Stage 5) to handle millions of asynchronous notification deliveries.
- Add **WebSockets (Socket.io) or Server-Sent Events (SSE)** for real-time live notification pushing without refreshing.

---
---

# Pre-Submission Checklists & Guides

## ✅ Final Submission Checklist (Evaluation Requirements)
- [x] Backend runs on port 3002.
- [x] Frontend runs strictly on port 3000.
- [x] No `.DS_Store` or `node_modules` pushed to Git.
- [x] `notification_system_design.md` contains Stages 1 to 7 fully answered.
- [x] Logging middleware added to both frontend and backend.
- [x] Code contains professional, beginner-friendly comments.
- [x] Clean architecture used (Controllers, Services, Routes).
- [x] Application handles errors gracefully.

## ✅ Pre-Push Testing Checklist
1. **Start backend:** `node server.js` -> verify "Running on http://localhost:3002".
2. **Start frontend:** `npm run dev` -> verify "Running on http://localhost:3000".
3. **Open browser:** Go to `http://localhost:3000`.
4. **Test Tabs:** Click through All, Top Priority, Placements. Verify data changes.
5. **Test Pagination:** Click page 2 at the bottom of the "All" tab.
6. **Test UI:** Click the checkmark icon to mark a notification as viewed. Verify it dims.
7. **Test Error Handling:** Stop the backend server, refresh the frontend, and verify the red "Network Error" alert appears cleanly.

## 🚀 GitHub Push Instructions
1. Initialize repository:
   ```bash
   git init
   git add .
   ```
2. Commit your code using recommended messages (below).
3. Add your remote repository:
   ```bash
   git remote add origin https://github.com/yourusername/affordmed-evaluation.git
   ```
4. Push to main:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## 📝 Recommended Commit Messages
It is highly recommended to push this code in logical chunks rather than one massive commit. 

1. `git commit -m "chore: initial project setup and gitignore"`
2. `git commit -m "docs: complete system design documentation (Stages 1-5)"`
3. `git commit -m "feat(backend): implement priority engine and logging middleware (Stage 6)"`
4. `git commit -m "feat(frontend): build responsive MUI dashboard with pagination (Stage 7)"`
5. `git commit -m "docs: add final README, postman collection, and env templates"`
