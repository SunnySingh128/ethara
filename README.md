# 🚀 Team Task Manager (Full-Stack)

A premium, high-performance project management application designed for seamless team collaboration. Built with a modern tech stack, it features role-based access control, real-time statistics, and a sleek, animated user interface.

## 🌐 Links
- **GitHub Repository**: [https://github.com/SunnySingh128/ethara.git](https://github.com/SunnySingh128/ethara.git)
- **Live URL**: *(Insert Railway Deployment URL here)*

---

## ✨ Features

### 🔐 Authentication & Security
- **Signup/Login**: Secure user registration and authentication using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Create projects, manage team members, and assign tasks.
  - **Member**: View assigned projects and update task progress.

### 📊 Project & Team Management
- **Project Creation**: Admins can create projects with custom descriptions and assign multiple members.
- **Member Assignment**: Granular control over project visibility and task assignment.
- **Dashboard Statistics**: Real-time overview of:
  - Total Tasks
  - Completed Tasks
  - Pending Tasks
  - Overdue Tasks

### 📋 Task Tracking (Kanban Style)
- **Dynamic Board**: Interactive task columns (Todo, In Progress, Done).
- **Task Creation**: Assign tasks with priority (Low, Medium, High) and due dates.
- **Instant Updates**: Change task status via a simple dropdown with immediate UI feedback.

---

## 🎨 Design Aesthetics
- **Sleek UI**: Modern dark-mode aesthetic with **glassmorphism** effects.
- **Premium Typography**: Uses 'Plus Jakarta Sans' for a professional look.
- **Smooth Animations**: Powered by **Framer Motion** for a responsive and alive interface.

---

## ⚙️ Tech Stack

### Frontend
- **React (Vite)**: Fast SPA framework.
- **Framer Motion**: Premium UI animations.
- **Lucide React**: High-quality iconography.
- **Axios**: API communication.
- **Vanilla CSS**: Custom design system for maximum flexibility.

### Backend
- **Node.js & Express.js**: Robust RESTful API architecture.
- **MongoDB & Mongoose**: Scalable NoSQL database and modeling.
- **JSON Web Tokens (JWT)**: Secure session management.
- **Bcryptjs**: Advanced password hashing.

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Fetch all users (Admin only)

### Projects
- `GET /api/projects` - Get projects (Filtered by role)
- `POST /api/projects` - Create new project (Admin only)
- `GET /api/projects/:id` - Get project details

### Tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks/project/:projectId` - Get tasks for a project
- `PUT /api/tasks/:id` - Update task status
- `GET /api/tasks/stats` - Get user dashboard stats

---

## 🚀 Deployment (Railway)
This application is fully configured for deployment on **Railway**. 
1. Connect your GitHub repository to Railway.
2. Add the environment variables from your `.env` file to the Railway dashboard.
3. The platform will automatically detect the Node.js backend and React frontend for a zero-config deployment.

---
Built with ❤️ by Antigravity for Sunny Singh.
