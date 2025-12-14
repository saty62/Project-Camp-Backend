Project Camp Backend 🚀

A RESTful Backend API for collaborative project management, built using Node.js, Express.js, MongoDB, and JWT authentication.
The system supports secure authentication, role-based access control, project/task management, subtasks, notes, and file uploads.

📌 Product Overview

Product Name: Project Camp Backend
Version: 1.0.0
Type: Backend API (REST)

Project Camp Backend is designed to support teams working on projects by providing structured management of projects, tasks, subtasks, notes, and members with clearly defined roles and permissions.

👥 Target Users

Admin

Full system access

Manage projects and members

Project Admin

Manage tasks and subtasks within assigned projects

Member

View projects

Update task and subtask status

✨ Core Features
🔐 Authentication & Authorization

User registration with email verification

Secure login using JWT (access & refresh tokens)

Logout with token invalidation

Forgot & reset password

Change password (authenticated)

Role-based access control (RBAC)

📁 Project Management

Create, update, delete projects (Admin only)

View projects accessible to user

Fetch project details

👨‍👩‍👧 Team Member Management

Add members to projects

Update member roles

Remove members (Admin only)

✅ Task Management

Create, update, delete tasks

Assign tasks to members

Track task status:

todo

in_progress

done

Upload multiple file attachments

🧩 Subtask Management

Create subtasks under tasks

Update completion status

Role-based permissions

📝 Project Notes

Admin-only note creation

View, update, delete notes

❤️ System Health

Health check endpoint for monitoring

🧠 Role Permission Matrix
Feature	Admin	Project Admin	Member
Create Project	✅	❌	❌
Update/Delete Project	✅	❌	❌
Manage Project Members	✅	❌	❌
Create/Update/Delete Tasks	✅	✅	❌
View Tasks	✅	✅	✅
Update Subtask Status	✅	✅	✅
Create/Delete Subtasks	✅	✅	❌
Create/Update/Delete Notes	✅	❌	❌
View Notes	✅	✅	✅
📘 API Endpoint Documentation

All endpoints are prefixed with:

/api/v1


Authentication is handled using JWT tokens stored in HTTP-only cookies.

🔐 Authentication (/auth)
Register
POST /api/v1/auth/register

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}

Login
POST /api/v1/auth/login

{
  "email": "user@example.com",
  "password": "password123"
}

Logout (Protected)
POST /api/v1/auth/logout

Get Current User (Protected)
GET /api/v1/auth/current-user

Refresh Access Token
POST /api/v1/auth/refresh-token

Verify Email
GET /api/v1/auth/verify-email/:verificationToken

Forgot Password
POST /api/v1/auth/forgot-password

{
  "email": "user@example.com"
}

Reset Password
POST /api/v1/auth/reset-password/:resetToken

{
  "newPassword": "newPassword123"
}

📁 Projects (/projects)
Method	Endpoint	Access
GET	/projects	Auth
POST	/projects	Admin
GET	/projects/:projectId	Role-based
PUT	/projects/:projectId	Admin
DELETE	/projects/:projectId	Admin
❤️ Health Check
GET /api/v1/healthcheck

🗂️ Project Structure Explanation
src/
├── controllers/
│   └── auth.controllers.js
├── routes/
│   └── auth.routes.js
├── models/
│   └── user.models.js
├── middlewares/
│   ├── auth.middlewares.js
│   └── validate.js
├── validators/
│   ├── user.validators.js
│   └── index.js
├── utils/
│   ├── api-error.js
│   ├── api-response.js
│   ├── async-handler.js
│   └── mail.js
├── db/
│   └── index.js
├── app.js
└── index.js

Folder Responsibilities

controllers/ – Business logic for APIs

routes/ – API routes and middleware binding

models/ – MongoDB schemas

middlewares/ – Authentication & validation logic

validators/ – Input validation rules

utils/ – Reusable helper utilities

db/ – Database connection

index.js – Application entry point

🧩 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt

express-validator

Multer (file uploads)

Mailgen & Nodemailer

dotenv

🔐 Security Features

JWT access & refresh tokens

HTTP-only secure cookies

Password hashing with bcrypt

Email verification

Role-based authorization middleware

Input validation on all routes

🚀 Getting Started
Clone Repository
git clone https://github.com/your-username/project-camp-backend.git
cd project-camp-backend

Install Dependencies
npm install

Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password

Run Development Server
npm run dev

📌 Future Enhancements

Swagger / OpenAPI documentation

Real-time notifications

Activity logs

WebSocket support

👨‍💻 Author

Priyadarshan Satyam
Backend Developer – Node.js | Express | MongoDB | JWT
