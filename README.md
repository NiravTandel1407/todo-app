# 📋 Modern Task Manager (FastAPI + React)

A full-stack, responsive to-do and task management application built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, and **React (Vite)**.

---

## ✨ Features

- **Dashboard Overview**: Metrics for Total, Completed, and Remaining tasks.
- **Priority Management**: Color-coded badges for `High`, `Medium`, and `Low` priority.
- **Due Dates & Overdue Alerts**: Interactive calendar selector with overdue/today notifications.
- **Tab Navigation**: Filter by *All Tasks*, *Today*, *Upcoming*, and *Completed*.
- **Live Search & Sorting**: Real-time search and sorting by due date, priority, title, or creation date.
- **RESTful API**: Clean backend architecture with FastAPI, Pydantic validation, and PostgreSQL persistence.

---

## 🛠️ Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints & routing
│   │   ├── config/         # Database and settings configuration
│   │   ├── models/         # SQLAlchemy ORM models
│   │   └── schema/         # Pydantic schemas (Request/Response)
│   ├── .env.example        # Environment variables template
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Sidebar, TopNav, MetricCards, TaskItem, TaskModal
│   │   ├── api.js          # Native fetch API client
│   │   ├── App.jsx         # State & main dashboard layout
│   │   └── App.css         # Modern, lightweight vanilla CSS design
│   ├── .env.example        # Frontend environment template
│   └── package.json        # Node dependencies
│
└── .gitignore              # Protects secrets, node_modules, and virtualenvs
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd "To-Do App"
```

### 2. Backend Setup (FastAPI)
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL

# Start server
uvicorn app.main:app --reload --port 8000
```
- API is live at `http://localhost:8000`
- Interactive docs available at `http://localhost:8000/docs`

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- Application is live at `http://localhost:5173`

---

## 🔒 Security Note
Never commit `.env` files to git. The `.gitignore` is pre-configured to ignore `.env`, `.venv`, and `node_modules`.
