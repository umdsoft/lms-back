# LMS Platform - API Documentation

> RESTful API hujjatlari - Barcha endpoint'lar, request/response examples

**Base URL:** `http://localhost:5000/api/v1`

**API Versiya:** 1.0

**Last Updated:** 2025-01-16

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Pagination](#pagination)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#1-authentication-routes)
   - [User Management](#2-user-management-routes)
   - [Directions](#3-direction-routes)
   - [Courses](#4-course-routes)
   - [Modules](#5-module-routes)
   - [Lessons](#6-lesson-routes)
   - [Tests](#7-test-routes)
   - [Quizzes](#8-quiz-routes)
   - [Olympiads](#9-olympiad-routes)
   - [Profile](#10-profile-routes)
   - [Health Check](#11-health-check)

---

## 🌐 Overview

### Base URL

**Development:** `http://localhost:5000/api/v1`

**Production:** `https://api.lms-platform.uz/api/v1`

### Content Type

Barcha request va response'lar JSON formatda:

```
Content-Type: application/json
```

### API Versiyalash

Hozirda faqat `v1` versiyasi mavjud.

### Swagger UI

Interactive API documentation:

```
http://localhost:5000/api-docs
```

---

## 🔐 Authentication

### JWT Token Tizimi

API JWT (JSON Web Token) authentication ishlatadi.

**Token Types:**

1. **Access Token**
   - Muddati: 1 kun
   - Payload: `{ userId, email, phone, role }`
   - Header'da yuboriladi

2. **Refresh Token**
   - Muddati: 2 kun
   - Payload: `{ userId, email, phone, role }`
   - Database'da saqlanadi
   - Token yangilash uchun

### Authentication Header

Protected endpoint'larga kirish uchun:

```http
Authorization: Bearer <access_token>
```

### Authentication Flow

```
1. Register/Login → Access Token + Refresh Token
2. Protected Request → Access Token header'da
3. Token Expired → Refresh Token bilan yangilash
4. Logout → Refresh Token delete
```

---

## ❌ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 204 | No Content | Success, no content |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Not authenticated |
| `FORBIDDEN` | No permission |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `INVALID_TOKEN` | JWT token invalid |
| `TOKEN_EXPIRED` | JWT token expired |
| `INVALID_CREDENTIALS` | Email/password wrong |

---

## ⏱️ Rate Limiting

### Global Rate Limit

```
100 requests per 15 minutes
```

### Auth Endpoints

```
5 requests per 15 minutes
```

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### Rate Limit Exceeded

**Response (429):**

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## 📄 Pagination

### Query Parameters

```
?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Sahifa raqami |
| `limit` | integer | 10 | Har sahifada elementlar soni |
| `sortBy` | string | `createdAt` | Tartiblash field |
| `sortOrder` | string | `desc` | `asc` yoki `desc` |

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 📡 API Endpoints

## 1. Authentication Routes

Base: `/api/v1/auth`

### 1.1. Register

Yangi foydalanuvchi ro'yxatdan o'tkazish.

**Endpoint:** `POST /auth/register`

**Auth:** ❌ No

**Request Body:**

```json
{
  "email": "student@example.com",
  "phone": "+998901234567",
  "password": "password123",
  "firstName": "Ali",
  "lastName": "Valiyev",
  "role": "STUDENT"
}
```

**Validation:**
- `email` yoki `phone` kamida bittasi bo'lishi kerak
- `password` kamida 6 char
- `role` optional (default: STUDENT)

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "phone": "+998901234567",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "role": "STUDENT",
      "status": "ACTIVE",
      "isActive": true,
      "createdAt": "2025-01-16T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**

- `400` - Validation error
- `409` - Email/Phone already exists

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "phone": "+998901234567",
    "password": "password123",
    "firstName": "Ali",
    "lastName": "Valiyev"
  }'
```

---

### 1.2. Login

Tizimga kirish.

**Endpoint:** `POST /auth/login`

**Auth:** ❌ No

**Request Body:**

```json
{
  "phone": "+998901234567",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "phone": "+998901234567",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "role": "STUDENT",
      "status": "ACTIVE"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**

- `400` - Validation error
- `401` - Invalid credentials

---

### 1.3. Refresh Token

Access token yangilash.

**Endpoint:** `POST /auth/refresh`

**Auth:** ❌ No

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**

- `401` - Invalid or expired refresh token

---

### 1.4. Logout

Tizimdan chiqish (bitta qurilma).

**Endpoint:** `POST /auth/logout`

**Auth:** ❌ No

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.5. Logout All

Barcha qurilmalardan chiqish.

**Endpoint:** `POST /auth/logout-all`

**Auth:** ✅ Yes

**Request Headers:**

```http
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

---

### 1.6. Get Current User

Joriy foydalanuvchi ma'lumotlari.

**Endpoint:** `GET /auth/me`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "phone": "+998901234567",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "role": "STUDENT",
    "status": "ACTIVE",
    "avatar": null,
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2025-01-16T10:00:00.000Z"
  }
}
```

---

## 2. User Management Routes

Base: `/api/v1/users`

### 2.1. Get User Statistics

**Endpoint:** `GET /users/statistics`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total": 1500,
    "students": 1200,
    "teachers": 250,
    "admins": 50,
    "active": 1400,
    "inactive": 100,
    "newThisMonth": 120
  }
}
```

---

### 2.2. Get All Users

**Endpoint:** `GET /users`

**Auth:** ✅ Yes (Admin only)

**Query Parameters:**

```
?page=1&limit=10&search=ali&role=STUDENT&status=ACTIVE&sortBy=createdAt&sortOrder=desc
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Sahifa raqami |
| `limit` | integer | Har sahifada |
| `search` | string | Email, name bo'yicha qidiruv |
| `role` | string | STUDENT, TEACHER, ADMIN |
| `status` | string | ACTIVE, INACTIVE, SUSPENDED |
| `sortBy` | string | Field name |
| `sortOrder` | string | asc, desc |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "student@example.com",
      "phone": "+998901234567",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "role": "STUDENT",
      "status": "ACTIVE",
      "avatar": null,
      "createdAt": "2025-01-16T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### 2.3. Create User

**Endpoint:** `POST /users`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "phone": "+998901234568",
  "password": "password123",
  "firstName": "Vali",
  "lastName": "Aliyev",
  "role": "TEACHER"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "phone": "+998901234568",
    "firstName": "Vali",
    "lastName": "Aliyev",
    "role": "TEACHER",
    "status": "ACTIVE"
  }
}
```

---

### 2.4. Get User by ID

**Endpoint:** `GET /users/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "phone": "+998901234567",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "role": "STUDENT",
    "status": "ACTIVE",
    "avatar": null,
    "createdAt": "2025-01-16T10:00:00.000Z",
    "updatedAt": "2025-01-16T10:00:00.000Z"
  }
}
```

---

### 2.5. Update User

**Endpoint:** `PUT /users/:id`

**Auth:** ✅ Yes (Self or Admin)

**Request Body:**

```json
{
  "firstName": "Ali Updated",
  "lastName": "Valiyev Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "firstName": "Ali Updated",
    "lastName": "Valiyev Updated",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### 2.6. Update User Role

**Endpoint:** `PATCH /users/:id/role`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "role": "TEACHER"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": 1,
    "role": "TEACHER"
  }
}
```

---

### 2.7. Update User Status

**Endpoint:** `PATCH /users/:id/status`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "status": "SUSPENDED",
  "reason": "Policy violation"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 1,
    "status": "SUSPENDED",
    "blockedAt": "2025-01-16T10:00:00.000Z",
    "blockedReason": "Policy violation"
  }
}
```

---

### 2.8. Change Password

**Endpoint:** `PATCH /users/:id/password`

**Auth:** ✅ Yes (Self only)

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 2.9. Delete User

**Endpoint:** `DELETE /users/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 3. Direction Routes

Base: `/api/v1/directions`

### 3.1. Get All Directions

**Endpoint:** `GET /directions`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Matematika",
      "slug": "matematika",
      "description": "Matematika yo'nalishi",
      "icon": "https://example.com/math-icon.png",
      "status": "ACTIVE",
      "order": 1,
      "subjects": [
        {
          "id": 1,
          "subjectName": "Algebra",
          "order": 1
        }
      ],
      "teachers": [
        {
          "id": 2,
          "firstName": "Teacher",
          "lastName": "User",
          "email": "teacher@lms.uz"
        }
      ]
    }
  ]
}
```

---

### 3.2. Create Direction

**Endpoint:** `POST /directions`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "name": "Matematika",
  "description": "Matematika yo'nalishi",
  "icon": "https://example.com/math-icon.png",
  "status": "ACTIVE",
  "order": 1
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Direction created successfully",
  "data": {
    "id": 1,
    "name": "Matematika",
    "slug": "matematika",
    "description": "Matematika yo'nalishi",
    "status": "ACTIVE"
  }
}
```

---

### 3.3. Get Direction by ID

**Endpoint:** `GET /directions/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Matematika",
    "slug": "matematika",
    "description": "Matematika yo'nalishi",
    "icon": "https://example.com/math-icon.png",
    "status": "ACTIVE",
    "order": 1,
    "subjects": [...],
    "teachers": [...],
    "courses": [...]
  }
}
```

---

### 3.4. Update Direction

**Endpoint:** `PUT /directions/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "name": "Matematika Updated",
  "description": "Updated description"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Direction updated successfully",
  "data": {...}
}
```

---

### 3.5. Update Direction Status

**Endpoint:** `PATCH /directions/:id/status`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "status": "INACTIVE"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Direction status updated successfully"
}
```

---

### 3.6. Delete Direction

**Endpoint:** `DELETE /directions/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Direction deleted successfully"
}
```

---

### 3.7. Add Subjects to Direction

**Endpoint:** `POST /directions/:id/subjects`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "subjects": [
    {
      "subjectName": "Algebra",
      "order": 1
    },
    {
      "subjectName": "Geometry",
      "order": 2
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Subjects added successfully",
  "data": [...]
}
```

---

### 3.8. Remove Subject

**Endpoint:** `DELETE /directions/:id/subjects/:subjectId`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Subject removed successfully"
}
```

---

### 3.9. Assign Teachers

**Endpoint:** `POST /directions/:id/teachers`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "teacherIds": [2, 3, 4]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Teachers assigned successfully"
}
```

---

### 3.10. Remove Teacher

**Endpoint:** `DELETE /directions/:id/teachers/:teacherId`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Teacher removed successfully"
}
```

---

## 4. Course Routes

Base: `/api/v1/courses`

### 4.1. Get All Courses

**Endpoint:** `GET /courses`

**Auth:** ✅ Yes

**Query Parameters:**

```
?page=1&limit=10&subject=MATHEMATICS&level=BEGINNER&status=PUBLISHED&directionId=1
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Beginner Mathematics",
      "description": "Basic mathematics course",
      "subject": "MATHEMATICS",
      "level": "BEGINNER",
      "status": "PUBLISHED",
      "coverImageUrl": "https://example.com/cover.jpg",
      "durationWeeks": 8,
      "price": 299000,
      "order": 1,
      "direction": {
        "id": 1,
        "name": "Matematika"
      },
      "teacher": {
        "id": 2,
        "firstName": "Teacher",
        "lastName": "User"
      }
    }
  ],
  "pagination": {...}
}
```

---

### 4.2. Get Courses by Direction

**Endpoint:** `GET /courses/directions/:directionId/courses`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [...]
}
```

---

### 4.3. Create Course

**Endpoint:** `POST /courses`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "directionId": 1,
  "title": "Beginner Mathematics",
  "description": "Basic mathematics course for beginners",
  "subject": "MATHEMATICS",
  "level": "BEGINNER",
  "coverImageUrl": "https://example.com/cover.jpg",
  "durationWeeks": 8,
  "price": 299000,
  "teacherId": 2,
  "status": "PUBLISHED"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {...}
}
```

---

### 4.4. Get Course by ID

**Endpoint:** `GET /courses/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Beginner Mathematics",
    "description": "Basic mathematics course",
    "subject": "MATHEMATICS",
    "level": "BEGINNER",
    "status": "PUBLISHED",
    "direction": {...},
    "teacher": {...},
    "modules": [
      {
        "id": 1,
        "title": "Module 1",
        "description": "Introduction",
        "order": 1,
        "lessons": [...]
      }
    ]
  }
}
```

---

### 4.5. Update Course

**Endpoint:** `PUT /courses/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Updated Course Title",
  "description": "Updated description"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {...}
}
```

---

### 4.6. Update Course Status

**Endpoint:** `PATCH /courses/:id/status`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "status": "ARCHIVED"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Course status updated successfully"
}
```

---

### 4.7. Delete Course

**Endpoint:** `DELETE /courses/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 5. Module Routes

Base: `/api/v1/modules`

### 5.1. Get Modules by Course

**Endpoint:** `GET /modules/courses/:courseId/modules`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "title": "Module 1: Introduction",
      "description": "Module description",
      "order": 1,
      "status": "PUBLISHED",
      "lessons": [...]
    }
  ]
}
```

---

### 5.2. Create Module

**Endpoint:** `POST /modules/courses/:courseId/modules`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Module 1: Introduction",
  "description": "Module description",
  "order": 1,
  "status": "PUBLISHED"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {...}
}
```

---

### 5.3. Get Module by ID

**Endpoint:** `GET /modules/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Module 1: Introduction",
    "description": "Module description",
    "order": 1,
    "status": "PUBLISHED",
    "course": {...},
    "lessons": [...]
  }
}
```

---

### 5.4. Update Module

**Endpoint:** `PUT /modules/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Updated Module Title"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Module updated successfully",
  "data": {...}
}
```

---

### 5.5. Delete Module

**Endpoint:** `DELETE /modules/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

---

## 6. Lesson Routes

Base: `/api/v1/lessons`

### 6.1. Get Lessons by Module

**Endpoint:** `GET /lessons/modules/:moduleId/lessons`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "moduleId": 1,
      "title": "Lesson 1: Getting Started",
      "description": "Lesson description",
      "content": "Lesson text content",
      "videoUrl": "https://youtube.com/watch?v=xxx",
      "durationMinutes": 30,
      "order": 1,
      "status": "PUBLISHED",
      "files": [
        {
          "id": 1,
          "fileName": "lesson1.pdf",
          "fileUrl": "https://example.com/lesson1.pdf",
          "fileType": "PDF",
          "fileSize": 1024000
        }
      ],
      "tests": [...]
    }
  ]
}
```

---

### 6.2. Create Lesson

**Endpoint:** `POST /lessons/modules/:moduleId/lessons`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Lesson 1: Getting Started",
  "description": "Lesson description",
  "content": "Lesson text content",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "durationMinutes": 30,
  "order": 1,
  "status": "PUBLISHED"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {...}
}
```

---

### 6.3. Get Lesson by ID

**Endpoint:** `GET /lessons/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Lesson 1: Getting Started",
    "description": "Lesson description",
    "content": "Lesson text content",
    "videoUrl": "https://youtube.com/watch?v=xxx",
    "durationMinutes": 30,
    "order": 1,
    "status": "PUBLISHED",
    "module": {...},
    "files": [...],
    "tests": [...]
  }
}
```

---

### 6.4. Update Lesson

**Endpoint:** `PUT /lessons/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Updated Lesson Title",
  "videoUrl": "https://youtube.com/watch?v=yyy"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {...}
}
```

---

### 6.5. Delete Lesson

**Endpoint:** `DELETE /lessons/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Lesson deleted successfully"
}
```

---

### 6.6. Add Files to Lesson

**Endpoint:** `POST /lessons/:id/files`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "files": [
    {
      "fileName": "lesson1.pdf",
      "fileUrl": "https://example.com/lesson1.pdf",
      "fileType": "PDF",
      "fileSize": 1024000,
      "order": 1
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Files added successfully",
  "data": [...]
}
```

---

### 6.7. Remove File

**Endpoint:** `DELETE /lessons/:id/files/:fileId`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "File removed successfully"
}
```

---

## 7. Test Routes

Base: `/api/v1/tests`

### 7.1. Get Tests by Lesson

**Endpoint:** `GET /tests/lessons/:lessonId/tests`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "lessonId": 1,
      "title": "Lesson 1 Test",
      "description": "Test description",
      "durationMinutes": 15,
      "passingScore": 70,
      "maxAttempts": 3,
      "status": "PUBLISHED",
      "questions": [
        {
          "id": 1,
          "question": "2 + 2 nechaga teng?",
          "type": "MULTIPLE_CHOICE",
          "options": ["2", "3", "4", "5"],
          "correctAnswer": "4",
          "points": 10
        }
      ]
    }
  ]
}
```

---

### 7.2. Create Test

**Endpoint:** `POST /tests/lessons/:lessonId/tests`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Lesson 1 Test",
  "description": "Test description",
  "durationMinutes": 15,
  "passingScore": 70,
  "maxAttempts": 3,
  "status": "PUBLISHED",
  "questions": [
    {
      "question": "2 + 2 nechaga teng?",
      "type": "MULTIPLE_CHOICE",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "4",
      "points": 10
    }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {...}
}
```

---

### 7.3. Get Test by ID

**Endpoint:** `GET /tests/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Lesson 1 Test",
    "description": "Test description",
    "durationMinutes": 15,
    "passingScore": 70,
    "maxAttempts": 3,
    "status": "PUBLISHED",
    "questions": [...],
    "lesson": {...}
  }
}
```

---

### 7.4. Update Test

**Endpoint:** `PUT /tests/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Updated Test Title",
  "passingScore": 80
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Test updated successfully",
  "data": {...}
}
```

---

### 7.5. Delete Test

**Endpoint:** `DELETE /tests/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Test deleted successfully"
}
```

---

## 8. Quiz Routes

Base: `/api/v1/quizzes`

### 8.1. Get All Quizzes

**Endpoint:** `GET /quizzes`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "lessonId": null,
      "title": "Course Final Quiz",
      "description": "Quiz description",
      "durationMinutes": 30,
      "passingScore": 75,
      "maxAttempts": 2,
      "status": "PUBLISHED"
    }
  ]
}
```

---

### 8.2. Create Quiz

**Endpoint:** `POST /quizzes`

**Auth:** ✅ Yes (Teacher/Admin)

**Request Body:**

```json
{
  "courseId": 1,
  "lessonId": null,
  "title": "Course Final Quiz",
  "description": "Quiz description",
  "durationMinutes": 30,
  "passingScore": 75,
  "maxAttempts": 2,
  "status": "PUBLISHED"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {...}
}
```

---

### 8.3. Get Quiz by ID

**Endpoint:** `GET /quizzes/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Course Final Quiz",
    "description": "Quiz description",
    "durationMinutes": 30,
    "passingScore": 75,
    "maxAttempts": 2,
    "status": "PUBLISHED",
    "course": {...},
    "lesson": {...},
    "questions": [...]
  }
}
```

---

### 8.4. Update Quiz

**Endpoint:** `PUT /quizzes/:id`

**Auth:** ✅ Yes (Teacher/Admin)

**Request Body:**

```json
{
  "title": "Updated Quiz Title",
  "passingScore": 80
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Quiz updated successfully",
  "data": {...}
}
```

---

### 8.5. Delete Quiz

**Endpoint:** `DELETE /quizzes/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

---

## 9. Olympiad Routes

Base: `/api/v1/olympiads`

### 9.1. Get All Olympiads

**Endpoint:** `GET /olympiads`

**Auth:** ✅ Yes

**Query Parameters:**

```
?subject=MATHEMATICS&level=NATIONAL&status=REGISTRATION_OPEN
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "National Mathematics Olympiad 2025",
      "description": "Annual mathematics olympiad",
      "subject": "MATHEMATICS",
      "level": "NATIONAL",
      "startDate": "2025-03-01T09:00:00.000Z",
      "endDate": "2025-03-01T12:00:00.000Z",
      "registrationDeadline": "2025-02-20T23:59:59.000Z",
      "maxParticipants": 500,
      "durationMinutes": 180,
      "status": "REGISTRATION_OPEN"
    }
  ]
}
```

---

### 9.2. Create Olympiad

**Endpoint:** `POST /olympiads`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "National Mathematics Olympiad 2025",
  "description": "Annual mathematics olympiad",
  "subject": "MATHEMATICS",
  "level": "NATIONAL",
  "startDate": "2025-03-01T09:00:00.000Z",
  "endDate": "2025-03-01T12:00:00.000Z",
  "registrationDeadline": "2025-02-20T23:59:59.000Z",
  "maxParticipants": 500,
  "durationMinutes": 180,
  "status": "UPCOMING"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Olympiad created successfully",
  "data": {...}
}
```

---

### 9.3. Get Olympiad by ID

**Endpoint:** `GET /olympiads/:id`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "National Mathematics Olympiad 2025",
    "description": "Annual mathematics olympiad",
    "subject": "MATHEMATICS",
    "level": "NATIONAL",
    "startDate": "2025-03-01T09:00:00.000Z",
    "endDate": "2025-03-01T12:00:00.000Z",
    "registrationDeadline": "2025-02-20T23:59:59.000Z",
    "maxParticipants": 500,
    "durationMinutes": 180,
    "status": "REGISTRATION_OPEN",
    "registrations": [...]
  }
}
```

---

### 9.4. Update Olympiad

**Endpoint:** `PUT /olympiads/:id`

**Auth:** ✅ Yes (Admin only)

**Request Body:**

```json
{
  "title": "Updated Olympiad Title",
  "maxParticipants": 600
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Olympiad updated successfully",
  "data": {...}
}
```

---

### 9.5. Delete Olympiad

**Endpoint:** `DELETE /olympiads/:id`

**Auth:** ✅ Yes (Admin only)

**Response (200):**

```json
{
  "success": true,
  "message": "Olympiad deleted successfully"
}
```

---

### 9.6. Register for Olympiad

**Endpoint:** `POST /olympiads/:id/register`

**Auth:** ✅ Yes (Student only)

**Response (201):**

```json
{
  "success": true,
  "message": "Registered for olympiad successfully",
  "data": {
    "id": 1,
    "olympiadId": 1,
    "userId": 1,
    "status": "REGISTERED",
    "registeredAt": "2025-01-16T10:00:00.000Z"
  }
}
```

**Errors:**

- `409` - Already registered
- `400` - Registration deadline passed
- `400` - Maximum participants reached

---

## 10. Profile Routes

Base: `/api/v1/profile`

### 10.1. Get Profile

**Endpoint:** `GET /profile`

**Auth:** ✅ Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "phone": "+998901234567",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "role": "STUDENT",
    "status": "ACTIVE",
    "avatar": null,
    "enrollments": [...],
    "quizAttempts": [...],
    "olympiadRegistrations": [...]
  }
}
```

---

### 10.2. Update Profile

**Endpoint:** `PUT /profile`

**Auth:** ✅ Yes

**Request Body:**

```json
{
  "firstName": "Ali Updated",
  "lastName": "Valiyev Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {...}
}
```

---

### 10.3. Change Password

**Endpoint:** `PATCH /profile/password`

**Auth:** ✅ Yes

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 11. Health Check

### 11.1. API Info

**Endpoint:** `GET /`

**Auth:** ❌ No

**Response (200):**

```json
{
  "success": true,
  "message": "LMS Platform API",
  "version": "1.0.0",
  "environment": "development"
}
```

---

### 11.2. Health Check

**Endpoint:** `GET /api/v1/health`

**Auth:** ❌ No

**Response (200):**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-16T10:00:00.000Z",
  "uptime": 12345,
  "database": "connected"
}
```

---

### 11.3. Swagger UI

**Endpoint:** `GET /api-docs`

**Auth:** ❌ No

**Response:** HTML (Swagger UI)

---

## 📞 Support

### Resources

- **API Documentation:** http://localhost:5000/api-docs
- **GitHub Issues:** https://github.com/umdsoft/lms-back/issues
- **Email:** support@lms-platform.uz

---

**🚀 LMS Platform API v1.0**

**Last Updated:** 2025-01-16

**Total Endpoints:** 50+

**Base URL:** http://localhost:5000/api/v1
