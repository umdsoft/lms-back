# 📘 Courses API - Frontend Integration Guide

**Base URL:** `http://localhost:5000`
**Version:** v1
**Authentication:** Bearer Token (JWT)

---

## 📑 Table of Contents

1. [GET /api/v1/courses - Barcha Kurslar](#1-get-apiv1courses---barcha-kurslar)
2. [GET /api/v1/courses/:id - Kurs Detallari](#2-get-apiv1coursesid---kurs-detallari)
3. [GET /api/v1/courses/directions/:directionId/courses - Yo'nalish bo'yicha](#3-get-apiv1coursesdirectionsdirectionidcourses---yonalish-boyicha)
4. [POST /api/v1/courses - Yangi Kurs Yaratish](#4-post-apiv1courses---yangi-kurs-yaratish)
5. [PUT /api/v1/courses/:id - Kursni Yangilash](#5-put-apiv1coursesid---kursni-yangilash)
6. [PATCH /api/v1/courses/:id/status - Status O'zgartirish](#6-patch-apiv1coursesidstatus---status-ozgartirish)
7. [DELETE /api/v1/courses/:id - Kursni O'chirish](#7-delete-apiv1coursesid---kursni-ochirish)

---

## 1. GET /api/v1/courses - Barcha Kurslar

Barcha kurslarni olish (filter, pagination, search)

### 📥 Request

**Method:** `GET`
**Endpoint:** `/api/v1/courses`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| `page` | integer | No | 1 | Sahifa raqami | `1`, `2`, `3` |
| `limit` | integer | No | 10 | Har sahifada nechta element | `10`, `20`, `50` |
| `directionId` | integer | No | - | Yo'nalish bo'yicha filter | `1`, `2`, `3` |
| `level` | string | No | - | Daraja bo'yicha filter | `beginner`, `intermediate` |
| `status` | string | No | - | Status bo'yicha filter | `active`, `draft`, `inactive` |
| `pricingType` | string | No | - | Narx turi bo'yicha filter | `subscription`, `individual` |
| `teacherId` | integer | No | - | O'qituvchi bo'yicha filter | `2`, `5` |

**Level Options:**
- `beginner` - Boshlang'ich
- `elementary` - Elementar
- `intermediate` - O'rta
- `upper-intermediate` - O'rta-Yuqori
- `advanced` - Yuqori
- `proficiency` - Professional

**Status Options:**
- `draft` - Qoralama
- `active` - Faol
- `inactive` - Nofaol

**Example Requests:**

```http
# Barcha active kurslar
GET /api/v1/courses?status=active

# Programming yo'nalishi, beginner darajasi
GET /api/v1/courses?directionId=1&level=beginner

# 2-sahifa, har sahifada 20 ta
GET /api/v1/courses?page=2&limit=20

# Bitta o'qituvchining barcha kurslari
GET /api/v1/courses?teacherId=2&status=active

# Pullik kurslar
GET /api/v1/courses?pricingType=individual&status=active
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "name": "JavaScript Asoslari",
        "slug": "javascript-asoslari",
        "directionId": 1,
        "level": "beginner",
        "description": "JavaScript dasturlash tilini o'rganish. Noldan boshlab professional darajaga yetish.",
        "pricingType": "subscription",
        "price": 0,
        "teacherId": 2,
        "thumbnail": "https://example.com/thumbnails/js-basics.jpg",
        "status": "active",
        "direction": {
          "id": 1,
          "name": "Programming",
          "slug": "programming",
          "color": "blue",
          "icon": "Code"
        },
        "teacher": {
          "id": 2,
          "firstName": "Ali",
          "lastName": "Valiyev",
          "avatar": "https://example.com/avatars/ali.jpg"
        },
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Python for Beginners",
        "slug": "python-for-beginners",
        "directionId": 1,
        "level": "beginner",
        "description": "Python dasturlash tilini boshlang'ichlardan o'rganish kursi.",
        "pricingType": "individual",
        "price": 299000,
        "teacherId": 3,
        "thumbnail": "https://example.com/thumbnails/python.jpg",
        "status": "active",
        "direction": {
          "id": 1,
          "name": "Programming",
          "slug": "programming",
          "color": "blue",
          "icon": "Code"
        },
        "teacher": {
          "id": 3,
          "firstName": "Sardor",
          "lastName": "Karimov",
          "avatar": null
        },
        "createdAt": "2025-11-15T08:30:00.000Z",
        "updatedAt": "2025-11-15T08:30:00.000Z"
      },
      {
        "id": 3,
        "name": "IELTS Preparation Course",
        "slug": "ielts-preparation-course",
        "directionId": 3,
        "level": "intermediate",
        "description": "IELTS imtihoniga tayyorgarlik kursi. 6.5+ ball olish uchun.",
        "pricingType": "subscription",
        "price": 0,
        "teacherId": 5,
        "thumbnail": "https://example.com/thumbnails/ielts.jpg",
        "status": "active",
        "direction": {
          "id": 3,
          "name": "English Language",
          "slug": "english-language",
          "color": "green",
          "icon": "Globe"
        },
        "teacher": {
          "id": 5,
          "firstName": "John",
          "lastName": "Smith",
          "avatar": "https://example.com/avatars/john.jpg"
        },
        "createdAt": "2025-11-14T12:00:00.000Z",
        "updatedAt": "2025-11-16T09:00:00.000Z"
      }
    ],
    "total": 25,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

**Pagination Ma'lumotlari:**
- `courses` - Joriy sahifadagi kurslar ro'yxati
- `total` - Jami kurslar soni (barcha sahifalarda)
- `totalPages` - Jami sahifalar soni
- `currentPage` - Joriy sahifa raqami

**Empty Result (200):**

```json
{
  "success": true,
  "data": {
    "courses": [],
    "total": 0,
    "totalPages": 0,
    "currentPage": 1
  }
}
```

---

### ❌ Error Responses

**401 Unauthorized - Token yo'q yoki noto'g'ri:**

```json
{
  "success": false,
  "message": "Authentication required"
}
```

**401 Unauthorized - Token muddati tugagan:**

```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## 2. GET /api/v1/courses/:id - Kurs Detallari

Bitta kursning to'liq ma'lumotlari (modules, lessons, stats bilan)

### 📥 Request

**Method:** `GET`
**Endpoint:** `/api/v1/courses/:id`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | integer | Yes | Kurs ID | `1`, `5`, `12` |

**Example Requests:**

```http
GET /api/v1/courses/1
GET /api/v1/courses/25
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Asoslari",
    "slug": "javascript-asoslari",
    "directionId": 1,
    "level": "beginner",
    "description": "JavaScript dasturlash tilini o'rganish. Noldan boshlab professional darajaga yetish. Kursda HTML, CSS va JavaScript asoslari, DOM manipulation, Event handling va boshqa ko'plab mavzular o'rganiladi.",
    "pricingType": "subscription",
    "price": 0,
    "teacherId": 2,
    "thumbnail": "https://example.com/thumbnails/js-basics.jpg",
    "status": "active",
    "direction": {
      "id": 1,
      "name": "Programming",
      "slug": "programming",
      "description": "Learn programming languages and software development",
      "color": "blue",
      "icon": "Code",
      "status": "active"
    },
    "teacher": {
      "id": 2,
      "firstName": "Ali",
      "lastName": "Valiyev",
      "email": "ali@example.com",
      "avatar": "https://example.com/avatars/ali.jpg",
      "role": "teacher"
    },
    "modules": [
      {
        "id": 1,
        "courseId": 1,
        "name": "JavaScript ga Kirish",
        "description": "JavaScript dasturlash tilining asoslari va tarixi",
        "order": 1,
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z",
        "lessons": [
          {
            "id": 1,
            "moduleId": 1,
            "name": "JavaScript nima?",
            "description": "JavaScript dasturlash tilining taqdimoti",
            "duration": 600,
            "order": 1,
            "createdAt": "2025-11-16T10:00:00.000Z"
          },
          {
            "id": 2,
            "moduleId": 1,
            "name": "Birinchi kod",
            "description": "Birinchi JavaScript kodini yozamiz",
            "duration": 900,
            "order": 2,
            "createdAt": "2025-11-16T10:00:00.000Z"
          },
          {
            "id": 3,
            "moduleId": 1,
            "name": "O'zgaruvchilar",
            "description": "var, let, const o'rganamiz",
            "duration": 1200,
            "order": 3,
            "createdAt": "2025-11-16T10:00:00.000Z"
          }
        ]
      },
      {
        "id": 2,
        "courseId": 1,
        "name": "Ma'lumot Turlari",
        "description": "JavaScript da ma'lumot turlari bilan ishlash",
        "order": 2,
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z",
        "lessons": [
          {
            "id": 4,
            "moduleId": 2,
            "name": "String (Matn)",
            "description": "String bilan ishlash",
            "duration": 1500,
            "order": 1,
            "createdAt": "2025-11-16T10:00:00.000Z"
          },
          {
            "id": 5,
            "moduleId": 2,
            "name": "Number (Raqam)",
            "description": "Raqamlar bilan ishlash",
            "duration": 1200,
            "order": 2,
            "createdAt": "2025-11-16T10:00:00.000Z"
          }
        ]
      },
      {
        "id": 3,
        "courseId": 1,
        "name": "Funksiyalar",
        "description": "JavaScript funksiyalarini o'rganamiz",
        "order": 3,
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z",
        "lessons": [
          {
            "id": 6,
            "moduleId": 3,
            "name": "Funksiya yaratish",
            "description": "Function declaration va expression",
            "duration": 1800,
            "order": 1,
            "createdAt": "2025-11-16T10:00:00.000Z"
          }
        ]
      }
    ],
    "stats": {
      "totalModules": 5,
      "totalLessons": 25,
      "totalDuration": 15000,
      "totalDurationFormatted": "4h 10m"
    },
    "createdAt": "2025-11-16T10:00:00.000Z",
    "updatedAt": "2025-11-16T10:00:00.000Z"
  }
}
```

**Stats Ma'lumotlari:**
- `totalModules` - Jami modullar soni
- `totalLessons` - Jami darslar soni
- `totalDuration` - Jami davomiyligi (soniyalarda)
- `totalDurationFormatted` - Formatlangan davomiylik (4h 10m)

---

### ❌ Error Responses

**404 Not Found - Kurs topilmadi:**

```json
{
  "success": false,
  "message": "Course not found"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## 3. GET /api/v1/courses/directions/:directionId/courses - Yo'nalish bo'yicha

Ma'lum bir yo'nalishdagi barcha kurslar

### 📥 Request

**Method:** `GET`
**Endpoint:** `/api/v1/courses/directions/:directionId/courses`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `directionId` | integer | Yes | Yo'nalish ID | `1`, `2`, `3` |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Sahifa raqami |
| `limit` | integer | No | 10 | Har sahifada nechta |

**Example Requests:**

```http
# Programming yo'nalishidagi barcha kurslar
GET /api/v1/courses/directions/1/courses

# Mathematics yo'nalishi, 2-sahifa
GET /api/v1/courses/directions/2/courses?page=2&limit=15

# English yo'nalishidagi kurslar
GET /api/v1/courses/directions/3/courses?status=active
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "name": "JavaScript Asoslari",
        "slug": "javascript-asoslari",
        "directionId": 1,
        "level": "beginner",
        "description": "JavaScript dasturlash tilini o'rganish",
        "pricingType": "subscription",
        "price": 0,
        "status": "active",
        "thumbnail": "https://example.com/thumbnails/js-basics.jpg",
        "direction": {
          "id": 1,
          "name": "Programming",
          "slug": "programming",
          "color": "blue",
          "icon": "Code"
        },
        "teacher": {
          "id": 2,
          "firstName": "Ali",
          "lastName": "Valiyev",
          "avatar": "https://example.com/avatars/ali.jpg"
        },
        "createdAt": "2025-11-16T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Python for Beginners",
        "slug": "python-for-beginners",
        "directionId": 1,
        "level": "beginner",
        "description": "Python dasturlash tilini boshlang'ichlardan o'rganish",
        "pricingType": "individual",
        "price": 299000,
        "status": "active",
        "thumbnail": "https://example.com/thumbnails/python.jpg",
        "direction": {
          "id": 1,
          "name": "Programming",
          "slug": "programming",
          "color": "blue",
          "icon": "Code"
        },
        "teacher": {
          "id": 3,
          "firstName": "Sardor",
          "lastName": "Karimov",
          "avatar": null
        },
        "createdAt": "2025-11-15T08:30:00.000Z"
      }
    ],
    "total": 12,
    "totalPages": 2,
    "currentPage": 1
  }
}
```

---

### ❌ Error Responses

**404 Not Found - Yo'nalish topilmadi:**

```json
{
  "success": false,
  "message": "Direction not found"
}
```

---

## 4. POST /api/v1/courses - Yangi Kurs Yaratish

Yangi kurs yaratish (faqat Admin)

### 📥 Request

**Method:** `POST`
**Endpoint:** `/api/v1/courses`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | string | **Yes** | Kurs nomi (3-200 belgi) | "JavaScript Asoslari" |
| `level` | string | **Yes** | Kurs darajasi | "beginner" |
| `directionId` | integer | No | Yo'nalish ID (default: 1 - Programming) | `1`, `2`, `3` |
| `description` | string | No | Kurs tavsifi | "JavaScript..." |
| `pricingType` | string | No | Narx turi (default: subscription) | "subscription" |
| `price` | number | No | Narx (individual uchun majburiy) | `299000` |
| `teacherId` | integer | No | O'qituvchi ID | `2`, `5` |
| `thumbnail` | string | No | Rasm URL | "https://..." |

**Level Values:**
- `beginner`
- `elementary`
- `intermediate`
- `upper-intermediate`
- `advanced`
- `proficiency`

**Pricing Type Values:**
- `subscription` - Obuna orqali
- `individual` - Alohida sotib olish

**Example Request Body 1 - Minimal (faqat majburiy maydonlar):**

```json
{
  "name": "React Asoslari",
  "level": "intermediate"
}
```

**Example Request Body 2 - To'liq ma'lumot:**

```json
{
  "name": "JavaScript Advanced Course",
  "directionId": 1,
  "level": "advanced",
  "description": "JavaScript dasturlash tilining ilg'or mavzularini o'rganish. Async/await, Promises, Closures, Prototypes va boshqa murakkab mavzular.",
  "pricingType": "subscription",
  "price": 0,
  "teacherId": 2,
  "thumbnail": "https://example.com/thumbnails/js-advanced.jpg"
}
```

**Example Request Body 3 - Pullik kurs:**

```json
{
  "name": "Node.js Backend Development",
  "directionId": 1,
  "level": "intermediate",
  "description": "Node.js va Express.js yordamida backend development o'rganish",
  "pricingType": "individual",
  "price": 399000,
  "teacherId": 5,
  "thumbnail": "https://example.com/thumbnails/nodejs.jpg"
}
```

---

### 📤 Response

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "JavaScript Advanced Course",
    "slug": "javascript-advanced-course",
    "directionId": 1,
    "level": "advanced",
    "description": "JavaScript dasturlash tilining ilg'or mavzularini o'rganish. Async/await, Promises, Closures, Prototypes va boshqa murakkab mavzular.",
    "pricingType": "subscription",
    "price": 0,
    "teacherId": 2,
    "thumbnail": "https://example.com/thumbnails/js-advanced.jpg",
    "status": "draft",
    "direction": {
      "id": 1,
      "name": "Programming",
      "slug": "programming",
      "color": "blue",
      "icon": "Code"
    },
    "teacher": {
      "id": 2,
      "firstName": "Ali",
      "lastName": "Valiyev",
      "avatar": "https://example.com/avatars/ali.jpg"
    },
    "modules": [],
    "stats": {
      "totalModules": 0,
      "totalLessons": 0,
      "totalDuration": 0,
      "totalDurationFormatted": "0m"
    },
    "createdAt": "2025-11-16T14:30:00.000Z",
    "updatedAt": "2025-11-16T14:30:00.000Z"
  }
}
```

**Default Status:** Yangi yaratilgan kurs avtomatik ravishda `draft` statusida bo'ladi.

---

### ❌ Error Responses

**400 Bad Request - Name yo'q:**

```json
{
  "success": false,
  "message": "Course name is required"
}
```

**400 Bad Request - Level yo'q:**

```json
{
  "success": false,
  "message": "Course level is required"
}
```

**400 Bad Request - Noto'g'ri level:**

```json
{
  "success": false,
  "message": "Invalid level. Must be one of: beginner, elementary, intermediate, upper-intermediate, advanced, proficiency"
}
```

**400 Bad Request - Individual uchun price yo'q:**

```json
{
  "success": false,
  "message": "Price is required for individual pricing type"
}
```

**400 Bad Request - Noto'g'ri pricing type:**

```json
{
  "success": false,
  "message": "Invalid pricing type. Must be: subscription or individual"
}
```

**403 Forbidden - Admin emas:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

**404 Not Found - Direction topilmadi:**

```json
{
  "success": false,
  "message": "Direction not found"
}
```

**404 Not Found - Teacher topilmadi:**

```json
{
  "success": false,
  "message": "Teacher not found"
}
```

---

## 5. PUT /api/v1/courses/:id - Kursni Yangilash

Mavjud kursni yangilash (faqat Admin)

### 📥 Request

**Method:** `PUT`
**Endpoint:** `/api/v1/courses/:id`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Kurs ID |

**Request Body:**

Barcha maydonlar **ixtiyoriy**. Faqat o'zgartirmoqchi bo'lgan maydonlarni yuboring.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Kurs nomi |
| `directionId` | integer | Yo'nalish ID |
| `level` | string | Kurs darajasi |
| `description` | string | Kurs tavsifi |
| `pricingType` | string | Narx turi |
| `price` | number | Narx |
| `teacherId` | integer | O'qituvchi ID |
| `thumbnail` | string | Rasm URL |

**Example Request 1 - Faqat nom va tavsif:**

```json
{
  "name": "JavaScript Pro - Updated",
  "description": "Yangilangan tavsif. Endi ko'proq amaliy mashqlar bilan."
}
```

**Example Request 2 - Narx turi va narxni o'zgartirish:**

```json
{
  "pricingType": "individual",
  "price": 499000
}
```

**Example Request 3 - Level va o'qituvchini o'zgartirish:**

```json
{
  "level": "advanced",
  "teacherId": 8
}
```

**Example Request 4 - To'liq yangilash:**

```json
{
  "name": "Full Stack JavaScript Developer",
  "directionId": 1,
  "level": "advanced",
  "description": "To'liq stack JavaScript developer bo'lish uchun kerakli barcha narsalar. React, Node.js, MongoDB va boshqalar.",
  "pricingType": "individual",
  "price": 599000,
  "teacherId": 5,
  "thumbnail": "https://example.com/thumbnails/fullstack.jpg"
}
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Full Stack JavaScript Developer",
    "slug": "full-stack-javascript-developer",
    "directionId": 1,
    "level": "advanced",
    "description": "To'liq stack JavaScript developer bo'lish uchun kerakli barcha narsalar. React, Node.js, MongoDB va boshqalar.",
    "pricingType": "individual",
    "price": 599000,
    "teacherId": 5,
    "thumbnail": "https://example.com/thumbnails/fullstack.jpg",
    "status": "active",
    "direction": {
      "id": 1,
      "name": "Programming",
      "slug": "programming",
      "color": "blue",
      "icon": "Code"
    },
    "teacher": {
      "id": 5,
      "firstName": "Bobur",
      "lastName": "Toshmatov",
      "avatar": "https://example.com/avatars/bobur.jpg"
    },
    "modules": [
      // ... existing modules
    ],
    "stats": {
      "totalModules": 8,
      "totalLessons": 45,
      "totalDuration": 28000,
      "totalDurationFormatted": "7h 46m"
    },
    "createdAt": "2025-11-16T10:00:00.000Z",
    "updatedAt": "2025-11-16T15:20:00.000Z"
  }
}
```

---

### ❌ Error Responses

**404 Not Found - Kurs topilmadi:**

```json
{
  "success": false,
  "message": "Course not found"
}
```

**400 Bad Request - Validation xatosi:**

```json
{
  "success": false,
  "message": "Invalid level. Must be one of: beginner, elementary, intermediate, upper-intermediate, advanced, proficiency"
}
```

**403 Forbidden - Admin emas:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

---

## 6. PATCH /api/v1/courses/:id/status - Status O'zgartirish

Kurs statusini o'zgartirish (faqat Admin)

### 📥 Request

**Method:** `PATCH`
**Endpoint:** `/api/v1/courses/:id/status`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Kurs ID |

**Request Body:**

| Field | Type | Required | Description | Values |
|-------|------|----------|-------------|--------|
| `status` | string | **Yes** | Yangi status | `draft`, `active`, `inactive` |

**Status Values:**
- `draft` - Qoralama (hali nashr qilinmagan)
- `active` - Faol (studentlar ko'ra oladi)
- `inactive` - Nofaol (vaqtincha to'xtatilgan)

**Example Request 1 - Active qilish:**

```json
{
  "status": "active"
}
```

**Example Request 2 - Nofaol qilish:**

```json
{
  "status": "inactive"
}
```

**Example Request 3 - Draft qilish:**

```json
{
  "status": "draft"
}
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Asoslari",
    "slug": "javascript-asoslari",
    "status": "active",
    "directionId": 1,
    "level": "beginner",
    "description": "JavaScript dasturlash tilini o'rganish",
    "pricingType": "subscription",
    "price": 0,
    "teacherId": 2,
    "thumbnail": "https://example.com/thumbnails/js-basics.jpg",
    "direction": {
      "id": 1,
      "name": "Programming"
    },
    "teacher": {
      "id": 2,
      "firstName": "Ali",
      "lastName": "Valiyev"
    },
    "createdAt": "2025-11-16T10:00:00.000Z",
    "updatedAt": "2025-11-16T15:45:00.000Z"
  }
}
```

---

### ❌ Error Responses

**400 Bad Request - Status yo'q:**

```json
{
  "success": false,
  "message": "Status is required"
}
```

**400 Bad Request - Noto'g'ri status:**

```json
{
  "success": false,
  "message": "Invalid status. Must be one of: draft, active, inactive"
}
```

**404 Not Found - Kurs topilmadi:**

```json
{
  "success": false,
  "message": "Course not found"
}
```

**403 Forbidden - Admin emas:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

---

## 7. DELETE /api/v1/courses/:id - Kursni O'chirish

Kursni butunlay o'chirish (faqat Admin)

### 📥 Request

**Method:** `DELETE`
**Endpoint:** `/api/v1/courses/:id`

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | O'chiriladigan kurs ID |

**Request Body:** Yo'q (body yuborilmaydi)

**Example Requests:**

```http
DELETE /api/v1/courses/15
DELETE /api/v1/courses/42
```

---

### 📤 Response

**Success Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### ❌ Error Responses

**404 Not Found - Kurs topilmadi:**

```json
{
  "success": false,
  "message": "Course not found"
}
```

**403 Forbidden - Admin emas:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

**500 Server Error - O'chirishda xatolik:**

```json
{
  "success": false,
  "message": "Failed to delete course"
}
```

---

## 📋 Summary Table

| # | Method | Endpoint | Description | Auth | Role |
|---|--------|----------|-------------|------|------|
| 1 | GET | `/api/v1/courses` | Barcha kurslar (filter, pagination) | ✅ | All |
| 2 | GET | `/api/v1/courses/:id` | Kurs detallari (modules, lessons, stats) | ✅ | All |
| 3 | GET | `/api/v1/courses/directions/:directionId/courses` | Yo'nalish bo'yicha kurslar | ✅ | All |
| 4 | POST | `/api/v1/courses` | Yangi kurs yaratish | ✅ | Admin |
| 5 | PUT | `/api/v1/courses/:id` | Kursni yangilash | ✅ | Admin |
| 6 | PATCH | `/api/v1/courses/:id/status` | Status o'zgartirish | ✅ | Admin |
| 7 | DELETE | `/api/v1/courses/:id` | Kursni o'chirish | ✅ | Admin |

---

## 🎯 Frontend Integration Tips

### 1. Barcha kurslarni ko'rsatish

```
GET /api/v1/courses?status=active&page=1&limit=12
```

**Qachon ishlatiladi:**
- Bosh sahifada barcha kurslar
- Katalog sahifasida

---

### 2. Yo'nalish bo'yicha filter

```
GET /api/v1/courses?directionId=1&status=active
```

**Qachon ishlatiladi:**
- Programming kurslarini ko'rsatish
- Mathematics kurslarini ko'rsatish
- Direction sahifalarida

---

### 3. Level bo'yicha filter

```
GET /api/v1/courses?level=beginner&status=active
```

**Qachon ishlatiladi:**
- Boshlang'ichlar uchun kurslar
- Advanced kurslar sahifasida

---

### 4. Bitta kursning to'liq ma'lumotlari

```
GET /api/v1/courses/5
```

**Qachon ishlatiladi:**
- Kurs detail sahifasida
- Kurs modullari va darslarini ko'rsatish
- Kurs statistikasini ko'rsatish

---

### 5. Yo'nalish sahifasida kurslar

```
GET /api/v1/courses/directions/1/courses?page=1
```

**Qachon ishlatiladi:**
- `/directions/programming/courses` - Programming kurslari
- `/directions/mathematics/courses` - Mathematics kurslari

---

### 6. Yangi kurs yaratish (Admin)

```
POST /api/v1/courses
Body: { name, level, directionId, ... }
```

**Qachon ishlatiladi:**
- Admin panelda yangi kurs qo'shish
- Kurs yaratish formasi

---

### 7. Kursni tahrirlash (Admin)

```
PUT /api/v1/courses/5
Body: { name, description, ... }
```

**Qachon ishlatiladi:**
- Kurs tahrirlash sahifasida
- Kurs ma'lumotlarini yangilash

---

### 8. Kurs statusini o'zgartirish (Admin)

```
PATCH /api/v1/courses/5/status
Body: { status: "active" }
```

**Qachon ishlatiladi:**
- Kursni nashr qilish (draft → active)
- Kursni to'xtatish (active → inactive)
- Kursni qayta draft qilish

---

### 9. Kursni o'chirish (Admin)

```
DELETE /api/v1/courses/5
```

**Qachon ishlatiladi:**
- Noto'g'ri yaratilgan kursni o'chirish
- Eskirgan kursni butunlay olib tashlash

---

## 🔑 Common Scenarios

### Scenario 1: Course Catalog Page

**Step 1:** Directions olish
```
GET /api/v1/directions?status=active
```

**Step 2:** Kurslarni olish
```
GET /api/v1/courses?status=active&page=1&limit=12
```

**Step 3:** Filter bo'yicha yangilash
```
GET /api/v1/courses?directionId=1&level=beginner&status=active
```

---

### Scenario 2: Course Detail Page

**Step 1:** Kurs ma'lumotlari
```
GET /api/v1/courses/5
```

Response:
- Course info
- Direction info
- Teacher info
- Modules array (har bir module ichida lessons)
- Stats (totalModules, totalLessons, duration)

---

### Scenario 3: Admin - Create New Course

**Step 1:** Directions ro'yxati (dropdown uchun)
```
GET /api/v1/directions?status=active
```

**Step 2:** Teachers ro'yxati (dropdown uchun)
```
GET /api/v1/users?role=teacher&status=active
```

**Step 3:** Kurs yaratish
```
POST /api/v1/courses
Body: {
  "name": "New Course",
  "directionId": 1,
  "level": "beginner",
  "teacherId": 2
}
```

---

### Scenario 4: Admin - Publish Draft Course

**Step 1:** Kurs draft holatda yaratilgan
```json
{ "id": 10, "status": "draft", ... }
```

**Step 2:** Kursni active qilish
```
PATCH /api/v1/courses/10/status
Body: { "status": "active" }
```

---

## ⚠️ Important Notes

### 1. Authentication
- **Barcha API'lar** JWT token talab qiladi
- Token header'da yuboriladi: `Authorization: Bearer {token}`
- Token muddati: Access token - 1 kun, Refresh token - 2 kun

### 2. Pagination
- Default page = 1, default limit = 10
- Max limit = 100 (agar 100 dan ko'p yuborilsa, 100 ga o'zgaradi)
- Har doim `total`, `totalPages`, `currentPage` qaytadi

### 3. Filters
- Barcha filterlar ixtiyoriy
- Bo'sh filterlar e'tiborga olinmaydi
- Multiple filterlar birgalikda ishlaydi (AND logic)

### 4. Course Creation
- `name` va `level` - majburiy
- `directionId` - ixtiyoriy (default: 1 - Programming)
- Yangi kurs `draft` status bilan yaratiladi
- Slug avtomatik generatsiya qilinadi

### 5. Course Status
- `draft` - Hali studentlar ko'rmaydi
- `active` - Studentlar ro'yxatga olishlari mumkin
- `inactive` - Vaqtincha to'xtatilgan (eski studentlar ko'radi)

### 6. Pricing
- `subscription` - Obuna bilan kirish mumkin (price = 0)
- `individual` - Alohida sotib olish kerak (price > 0)

---

## 📞 Testing

### Swagger UI
```
http://localhost:5000/api-docs
```

Swagger UI da:
1. "Authorize" tugmasini bosing
2. JWT token kiriting
3. Har bir endpoint'ni "Try it out" bilan test qiling

---

**Date:** 2025-11-16
**Version:** 1.0.0
**Status:** ✅ Ready for Integration
