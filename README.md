# Team Task Manager

A full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring role-based access control and a premium UI.

## 🚀 Features
- **Authentication**: Secure Signup/Login with JWT.
- **RBAC**: Admin can create projects and assign tasks; Members can view and update their tasks.
- **Project Management**: Create and track multiple team projects.
- **Task Board**: Kanban-style task management with status tracking (Todo, In Progress, Done).
- **Dashboard**: Real-time stats for total, pending, completed, and overdue tasks.
- **Premium UI**: Dark mode glassmorphism design with smooth Framer Motion animations.

## ⚙️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Styling**: Vanilla CSS (Custom Design System).

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB connection string

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Create a `.env` file (template provided in `backend/.env`)
4. Start server: `npm start`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 🌐 Deployment
This app is ready for deployment on **Railway**.
- Connect your GitHub repo.
- Set environment variables (`MONGO_URI`, `JWT_SECRET`).
- Railway will automatically detect the backend and frontend.

---
Built with ❤️ by Antigravity
