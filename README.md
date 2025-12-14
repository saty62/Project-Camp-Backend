Project Camp Backend 🚀

A robust RESTful Backend API for collaborative project management, built with Node.js, Express, MongoDB, and JWT authentication.
This backend supports secure user authentication, role-based access control, project/task management, and file attachments.

📌 Overview

Project Camp Backend enables teams to collaboratively manage projects with structured tasks, subtasks, notes, and role-based permissions.
It is designed to be scalable, secure, and production-ready.

Version: 1.0.0
Type: Backend API
Architecture: RESTful API

👥 Target Users

Admin

Full system access

Manage projects and members

Project Admin

Manage tasks and subtasks within assigned projects

Member

View projects, update task and subtask status

✨ Core Features
🔐 Authentication & Authorization

User registration with email verification

JWT-based login & logout

Refresh token mechanism

Forgot & reset password

Change password (authenticated)

Role-based access control (RBAC)

📁 Project Management

Create, update, delete projects (Admin only)

List user-accessible projects

View project details

Member management with role assignment

👨‍👩‍👧 Team Management

Add members to projects

Remove members (Admin only)

Update member roles

✅ Task Management

Create, update, delete tasks

Assign tasks to members

Track task status: todo, in_progress, done

Attach multiple files to tasks

🧩 Subtask Management

Create subtasks under tasks

Mark subtasks as completed

Role-based subtask permissions

📝 Project Notes

Admin-only notes creation

View, update, delete notes

❤️ System Health

Health check endpoint for uptime monitoring
