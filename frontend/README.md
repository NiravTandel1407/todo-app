# To-Do Application — Frontend (React + Vite)

A modern, clean, and beginner-friendly React application connected to a FastAPI backend with PostgreSQL.

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend
Ensure your backend virtual environment is active and running:
```bash
cd backend
# Windows
.\.venv\Scripts\activate
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
├── .env                     # API Base URL configuration
├── index.html               # Main HTML shell with Google Fonts & Meta tags
├── package.json             # Scripts & dependencies
├── src/
│   ├── api.js               # 🌐 All backend API calls (getTasks, createTask, updateTask, deleteTask)
│   ├── App.jsx              # 🧠 Main state management & CRUD handlers
│   ├── App.css              # 🎨 Layout, card styles, and animations
│   ├── index.css            # 🎨 Global CSS variables (Colors, typography, resets)
│   ├── main.jsx             # React entry point
│   └── components/
│       ├── Header.jsx       # App title, backend status badge & progress bar
│       ├── TaskForm.jsx     # Form to add new tasks (Title & Description)
│       ├── TaskFilter.jsx   # Filter tabs (All, Active, Completed) + Search bar
│       └── TaskItem.jsx     # Individual task card (checkbox, inline edit, delete)
```

---

## 🛠️ How to Customize (Common Junior Developer Tasks)

### 1. Change Theme Colors
Open [`src/index.css`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/index.css) and edit the CSS variables in `:root`:
```css
:root {
  --primary: #6366f1;        /* Change button and focus color */
  --bg-main: #0b0f19;        /* Change background color */
  --surface-card: rgba(...); /* Change task card color */
}
```

### 2. Change the Backend API URL
Open [`.env`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/.env) and change:
```env
VITE_API_BASE_URL=http://localhost:8000/taskItems
```

### 3. Add a New Field (e.g. Priority or Due Date)
1. Add the column in your backend model [`TaskItem.py`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/backend/app/models/TaskItem.py) & schema.
2. In [`src/components/TaskForm.jsx`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/components/TaskForm.jsx), add an `<input>` or `<select>`.
3. In [`src/api.js`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/api.js), pass the new field in `createTask` and `updateTask`.
4. In [`src/components/TaskItem.jsx`](file:///d:/Nirav/My%20Workspace/Projects/Websites/To-Do%20App/frontend/src/components/TaskItem.jsx), render the badge or text!
