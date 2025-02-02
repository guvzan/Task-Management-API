# Task Management API

A lightweight and secure RESTful API for managing tasks, built without frameworks for full control over the implementation.

## Features
✅ CRUD operations for tasks (Create, Read, Update, Delete).  
✅ Each task contains:
   - Title
   - Description
   - Status ("Pending", "Completed", etc.)
   - Due date  
✅ Filtering tasks by status or due date.  
✅ **No framework used** – built with pure Node.js for maximum flexibility.  
✅ JWT-based authentication (token returned in response headers and cookies).  
✅ Role-based access control ('user', 'admin').  
✅ Users can only manage their own tasks.

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [MongoDB](https://www.mongodb.com/) (or any other preferred database)

### Clone the Repository
```sh
git clone https://github.com/guvzan/Task-Management-API
cd Task-Management-API
```

### Install Dependencies
```sh
npm install
```

### Configuration
Create a `.env` file in the root directory and set up environment variables:
```
PORT=3000
DB_URI=mongodb://localhost:27017/tasks
JWT_SECRET=your_secret_key
```

### Running the Server
```sh
npm start
```

---

## API Endpoints

### Authentication
#### 🔹 Register
```http
POST /api/register
```
Request Body:
```json
{
  "username": "user123",
  "password": "securepassword"
}
```
Response:
```json
{
  "message": "success",
  "user": "userObject"
}
```

#### 🔹 Login
```http
POST /api/login
```
Request Body:
```json
{
  "username": "user123",
  "password": "securepassword"
}
```
Response:
```json
{
  "message": "success",
  "user": "userObject"
}
```

### Task Management
#### 🔹 Create Task
```http
POST /api/tasks
Cookies: jwt=<JWT Token>
```
Request Body:
```json
{
  "title": "New Task",
  "description": "This is a sample task",
  "status": "Pending",
  "dueDate": "2025-02-15"
}
```

#### 🔹 Get User Tasks
```http
GET /api/tasks
Cookies: jwt=<JWT Token>
```

#### 🔹 Update Task
```http
PUT /api/tasks/:id
Cookies: jwt=<JWT Token>
```

#### 🔹 Delete Task
```http
DELETE /api/tasks/:id
Cookies: jwt=<JWT Token>
```

---

## Security
- Passwords are **hashed** before storage.
- JWT tokens are used for authentication and role management.
- Users can only access their own tasks.

---

## License
This project is open-source and available under the MIT License.

