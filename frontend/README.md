# 🎨 Frontend (React + Vite) — Task Flow Dashboard

A clean, modern, and beginner-friendly React application connected to a FastAPI backend with PostgreSQL.

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend
Ensure your backend virtual environment is active and running:
```bash
cd backend
# Windows
.\.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

uvicorn app.main:app --reload --port 8000
```
Your backend will be live at: `http://localhost:8000` (API documentation at `http://localhost:8000/docs`).

### 2. Start the React Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 📂 Project Structure for Junior Developers

```
frontend/
├── .env.example             # Template for API base URL configuration
├── index.html               # Main HTML shell with Google Fonts & Meta tags
├── package.json             # Scripts & dependencies
├── src/
│   ├── api.js               # 🌐 All backend API calls (getTasks, createTask, updateTask, deleteTask)
│   ├── App.jsx              # 🧠 Main state management, sorting, filtering & CRUD handlers
│   ├── App.css              # 🎨 Dashboard layout, cards, and animations
│   ├── index.css            # 🎨 Design tokens (:root CSS variables)
│   ├── main.jsx             # React entry point
│   └── components/
│       ├── Sidebar.jsx      # Navigation tabs (All, Today, Upcoming, Completed) & promo card
│       ├── TopNav.jsx       # Search bar, priority filter dropdown, "+ Add Task", notifications
│       ├── MetricCards.jsx  # Total, Completed, and Remaining counter cards
│       ├── TaskItem.jsx     # Task row card (checkbox, priority pill, due date, edit, delete)
│       └── TaskModal.jsx    # Modal dialog for creating & editing tasks
```

---

## 🛠️ How to Customize (Common Junior Developer Tasks)

### 1. Change Theme Colors
Open [`src/index.css`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/index.css) and edit the CSS variables in `:root`:
```css
:root {
  --primary: #2563eb;        /* Main brand blue */
  --bg-app: #f4f6fa;         /* App background color */
  --bg-card: #ffffff;        /* Task card background */
}
```

### 2. Change the Backend API URL
Open [`.env`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/.env) and change:
```env
VITE_API_BASE_URL=http://localhost:8000/taskItems
```

### 3. Adding New Features
- **API calls**: Add or update endpoint helper functions in [`src/api.js`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/api.js).
- **Form fields**: Add fields in [`src/components/TaskModal.jsx`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/components/TaskModal.jsx).
- **Row display**: Customize badges or buttons in [`src/components/TaskItem.jsx`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/components/TaskItem.jsx).
