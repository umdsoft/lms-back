# 📖 LMS Platform - Complete API Testing Guide

Barcha API endpoint'lar uchun to'liq qo'llanma - Frontend integration bilan

**Base URL:** `http://localhost:5000`
**Swagger UI:** `http://localhost:5000/api-docs`

---

## 📑 Table of Contents

1. [Authentication API](#1-authentication-api)
2. [Directions API](#2-directions-api)
3. [Courses API](#3-courses-api)
4. [Modules API](#4-modules-api)
5. [Lessons API](#5-lessons-api)
6. [Profile API](#6-profile-api)
7. [Users API](#7-users-api-admin)
8. [Common Errors](#8-common-errors)
9. [Frontend Integration](#9-frontend-integration)

---

## 1. Authentication API

### 1.1. Register - POST /api/v1/auth/register

Yangi foydalanuvchi ro'yxatdan o'tkazish

**Endpoint:** `POST /api/v1/auth/register`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Password123!",
  "firstName": "Ali",
  "lastName": "Valiyev",
  "phone": "+998901234567"
}
```

**Majburiy Maydonlar:**
- `email` - Valid email format
- `password` - Min 8 characters, 1 uppercase, 1 lowercase, 1 number
- `firstName` - 2-50 characters
- `lastName` - 2-50 characters

**Ixtiyoriy Maydonlar:**
- `phone` - Telefon raqam

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "role": "student",
      "isActive": true,
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**

```json
// 400 - Email already exists
{
  "success": false,
  "message": "Email already registered"
}

// 400 - Validation error
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

**Nuxt 3 Example:**
```typescript
// composables/useAuth.ts
const register = async (userData: RegisterData) => {
  const { $api } = useNuxtApp()

  try {
    const response = await $api('/api/v1/auth/register', {
      method: 'POST',
      body: userData
    })

    // Save tokens
    const authToken = useCookie('authToken')
    const refreshToken = useCookie('refreshToken')

    authToken.value = response.data.tokens.accessToken
    refreshToken.value = response.data.tokens.refreshToken

    return response.data.user
  } catch (error) {
    throw error
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password123!",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "phone": "+998901234567"
  }'
```

---

### 1.2. Login - POST /api/v1/auth/login

Tizimga kirish

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Password123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "firstName": "Ali",
      "lastName": "Valiyev",
      "role": "student",
      "avatar": null,
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// 403 - Account blocked
{
  "success": false,
  "message": "Account is blocked"
}
```

**Nuxt 3 Example:**
```typescript
const login = async (email: string, password: string) => {
  const { $api } = useNuxtApp()

  const response = await $api('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password }
  })

  // Save tokens
  const authToken = useCookie('authToken', { maxAge: 86400 }) // 1 day
  const refreshToken = useCookie('refreshToken', { maxAge: 172800 }) // 2 days

  authToken.value = response.data.tokens.accessToken
  refreshToken.value = response.data.tokens.refreshToken

  return response.data.user
}
```

---

### 1.3. Refresh Token - POST /api/v1/auth/refresh

Token yangilash

**Endpoint:** `POST /api/v1/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Nuxt 3 Auto-Refresh:**
```typescript
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const authToken = useCookie('authToken')
  const refreshToken = useCookie('refreshToken')

  const api = $fetch.create({
    baseURL: 'http://localhost:5000',

    async onResponseError({ response }) {
      if (response.status === 401 && refreshToken.value) {
        // Try to refresh token
        try {
          const newTokens = await $fetch('/api/v1/auth/refresh', {
            method: 'POST',
            body: { refreshToken: refreshToken.value }
          })

          authToken.value = newTokens.data.accessToken
          refreshToken.value = newTokens.data.refreshToken
        } catch (error) {
          // Refresh failed - logout
          authToken.value = null
          refreshToken.value = null
          navigateTo('/login')
        }
      }
    }
  })

  return { provide: { api } }
})
```

---

### 1.4. Logout - POST /api/v1/auth/logout

Tizimdan chiqish

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Nuxt 3 Example:**
```typescript
const logout = async () => {
  const { $api } = useNuxtApp()
  const authToken = useCookie('authToken')
  const refreshToken = useCookie('refreshToken')

  try {
    await $api('/api/v1/auth/logout', {
      method: 'POST'
    })
  } finally {
    // Clear tokens and redirect
    authToken.value = null
    refreshToken.value = null
    navigateTo('/login')
  }
}
```

---

## 2. Directions API

### 2.1. Get All Directions - GET /api/v1/directions

Barcha yo'nalishlarni olish (filter va pagination bilan)

**Endpoint:** `GET /api/v1/directions`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
page          (optional) - Sahifa raqami (default: 1)
limit         (optional) - Har sahifada nechta (default: 10)
search        (optional) - Qidiruv (name bo'yicha)
status        (optional) - active | inactive
sortBy        (optional) - Saralash maydoni (default: displayOrder)
sortOrder     (optional) - asc | desc (default: asc)
```

**Example Request:**
```http
GET /api/v1/directions?status=active&sortBy=displayOrder&sortOrder=asc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "directions": [
      {
        "id": 1,
        "name": "Programming",
        "slug": "programming",
        "description": "Learn programming languages and software development",
        "color": "blue",
        "icon": "Code",
        "status": "active",
        "displayOrder": 1,
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Mathematics",
        "slug": "mathematics",
        "description": "Master mathematical concepts and problem solving",
        "color": "purple",
        "icon": "Calculator",
        "status": "active",
        "displayOrder": 2,
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z"
      }
    ],
    "total": 8,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

**Nuxt 3 Example:**
```typescript
// composables/useDirections.ts
export const useDirections = (filters?: DirectionFilters) => {
  const { $api } = useNuxtApp()

  const queryString = computed(() => {
    if (!filters) return ''
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })

    return params.toString() ? `?${params.toString()}` : ''
  })

  const { data, pending, error, refresh } = useAsyncData(
    `directions${queryString.value}`,
    () => $api(`/api/v1/directions${queryString.value}`)
  )

  const directions = computed(() => data.value?.data?.directions || [])

  return {
    directions,
    total: computed(() => data.value?.data?.total || 0),
    loading: pending,
    error,
    refresh
  }
}

// Usage
const { directions, loading } = useDirections({ status: 'active' })
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/directions?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2.2. Get Direction by ID - GET /api/v1/directions/:id

Bitta yo'nalish ma'lumotlari

**Endpoint:** `GET /api/v1/directions/:id`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Programming",
    "slug": "programming",
    "description": "Learn programming languages and software development",
    "color": "blue",
    "icon": "Code",
    "status": "active",
    "displayOrder": 1,
    "createdAt": "2025-11-16T10:00:00.000Z",
    "updatedAt": "2025-11-16T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Direction not found"
}
```

---

## 3. Courses API

### 3.1. Get All Courses - GET /api/v1/courses

Barcha kurslarni olish (filter va pagination bilan)

**Endpoint:** `GET /api/v1/courses`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
page          (optional) - Sahifa raqami (default: 1)
limit         (optional) - Har sahifada nechta (default: 10)
directionId   (optional) - Yo'nalish ID filter
level         (optional) - beginner | elementary | intermediate | upper-intermediate | advanced | proficiency
status        (optional) - draft | active | inactive
pricingType   (optional) - subscription | individual
teacherId     (optional) - O'qituvchi ID filter
```

**Example Request:**
```http
GET /api/v1/courses?directionId=1&level=beginner&status=active&page=1&limit=10
```

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
        "teacherId": 2,
        "thumbnail": "https://example.com/js.jpg",
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
          "avatar": null
        },
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z"
      }
    ],
    "total": 25,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

**Nuxt 3 Example with Filters:**
```typescript
// composables/useCourses.ts
export const useCourses = (filters?: CourseFilters) => {
  const { $api } = useNuxtApp()

  const queryString = computed(() => {
    if (!filters) return ''
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    return params.toString() ? `?${params.toString()}` : ''
  })

  const { data, pending, error, refresh } = useAsyncData(
    `courses${queryString.value}`,
    () => $api(`/api/v1/courses${queryString.value}`)
  )

  return {
    courses: computed(() => data.value?.data?.courses || []),
    pagination: computed(() => ({
      total: data.value?.data?.total || 0,
      totalPages: data.value?.data?.totalPages || 0,
      currentPage: data.value?.data?.currentPage || 1
    })),
    loading: pending,
    error,
    refresh
  }
}

// Usage in component
<script setup>
const filters = ref({
  directionId: 1,
  level: 'beginner',
  status: 'active',
  page: 1,
  limit: 10
})

const { courses, pagination, loading } = useCourses(filters.value)

// Watch for filter changes
watch(filters, () => {
  // Auto-refresh
}, { deep: true })
</script>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/courses?directionId=1&status=active&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3.2. Get Course by ID - GET /api/v1/courses/:id

Kurs detallari (modules, lessons, stats)

**Endpoint:** `GET /api/v1/courses/:id`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

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
    "description": "JavaScript dasturlash tilini o'rganish",
    "pricingType": "subscription",
    "price": 0,
    "teacherId": 2,
    "thumbnail": "https://example.com/js.jpg",
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
      "avatar": null,
      "email": "ali@example.com"
    },
    "modules": [
      {
        "id": 1,
        "courseId": 1,
        "name": "Kirish",
        "description": "JavaScript ga kirish",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "name": "Birinchi dars",
            "duration": 600,
            "order": 1
          },
          {
            "id": 2,
            "name": "Ikkinchi dars",
            "duration": 900,
            "order": 2
          }
        ],
        "createdAt": "2025-11-16T10:00:00.000Z",
        "updatedAt": "2025-11-16T10:00:00.000Z"
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

**Error Response (404):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**Nuxt 3 Example:**
```typescript
// composables/useCourse.ts
export const useCourse = (courseId: MaybeRef<number>) => {
  const { $api } = useNuxtApp()
  const id = computed(() => unref(courseId))

  const { data, pending, error, refresh } = useAsyncData(
    `course-${id.value}`,
    () => $api(`/api/v1/courses/${id.value}`)
  )

  return {
    course: computed(() => data.value?.data || null),
    loading: pending,
    error,
    refresh
  }
}

// Usage in page
<script setup>
const route = useRoute()
const courseId = computed(() => Number(route.params.id))

const { course, loading, error } = useCourse(courseId)
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error loading course</div>
  <div v-else-if="course">
    <h1>{{ course.name }}</h1>
    <p>{{ course.description }}</p>

    <!-- Course Stats -->
    <div class="stats">
      <div>{{ course.stats.totalModules }} modules</div>
      <div>{{ course.stats.totalLessons }} lessons</div>
      <div>{{ course.stats.totalDurationFormatted }}</div>
    </div>

    <!-- Modules -->
    <div v-for="module in course.modules" :key="module.id">
      <h3>{{ module.name }}</h3>
      <ul>
        <li v-for="lesson in module.lessons" :key="lesson.id">
          {{ lesson.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

---

### 3.3. Get Courses by Direction - GET /api/v1/courses/directions/:directionId/courses

Yo'nalish bo'yicha kurslar

**Endpoint:** `GET /api/v1/courses/directions/:directionId/courses`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
page    (optional) - Sahifa raqami (default: 1)
limit   (optional) - Har sahifada nechta (default: 10)
```

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
        "level": "beginner",
        "direction": {
          "id": 1,
          "name": "Programming"
        }
      }
    ],
    "total": 5,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

**Nuxt 3 Example:**
```typescript
// composables/useCoursesByDirection.ts
export const useCoursesByDirection = (directionId: MaybeRef<number>) => {
  const { $api } = useNuxtApp()
  const id = computed(() => unref(directionId))

  const { data, pending, error, refresh } = useAsyncData(
    `courses-direction-${id.value}`,
    () => $api(`/api/v1/courses/directions/${id.value}/courses`)
  )

  return {
    courses: computed(() => data.value?.data?.courses || []),
    loading: pending,
    error,
    refresh
  }
}
```

---

### 3.4. Create Course - POST /api/v1/courses

Yangi kurs yaratish (Admin only)

**Endpoint:** `POST /api/v1/courses`

**Headers:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "JavaScript Asoslari",
  "directionId": 1,
  "level": "beginner",
  "description": "JavaScript dasturlash tilini o'rganish",
  "pricingType": "subscription",
  "price": 0,
  "teacherId": 2,
  "thumbnail": "https://example.com/js.jpg"
}
```

**Majburiy Maydonlar:**
- `name` (string, 3-200 characters)
- `level` (enum: beginner, elementary, intermediate, upper-intermediate, advanced, proficiency)

**Ixtiyoriy Maydonlar:**
- `directionId` (number) - Optional, default: Programming (ID: 1)
- `description` (string)
- `pricingType` (enum: subscription | individual, default: subscription)
- `price` (number) - Required if pricingType is 'individual'
- `teacherId` (number)
- `thumbnail` (string URL)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Asoslari",
    "slug": "javascript-asoslari",
    "directionId": 1,
    "level": "beginner",
    "status": "draft",
    "direction": {
      "id": 1,
      "name": "Programming"
    },
    "modules": [],
    "stats": {
      "totalModules": 0,
      "totalLessons": 0
    }
  }
}
```

**Error Responses:**
```json
// 400 - Missing name
{
  "success": false,
  "message": "Course name is required"
}

// 400 - Invalid level
{
  "success": false,
  "message": "Invalid level. Must be one of: beginner, elementary, intermediate, upper-intermediate, advanced, proficiency"
}

// 400 - Invalid pricing
{
  "success": false,
  "message": "Price is required for individual pricing type"
}

// 403 - Not admin
{
  "success": false,
  "message": "Access denied. Admin role required"
}

// 404 - Direction not found
{
  "success": false,
  "message": "Direction not found"
}
```

**Nuxt 3 Example:**
```typescript
const createCourse = async (courseData: CourseCreateData) => {
  const { $api } = useNuxtApp()

  try {
    const response = await $api('/api/v1/courses', {
      method: 'POST',
      body: courseData
    })

    // Redirect to new course
    navigateTo(`/courses/${response.data.id}`)

    return response.data
  } catch (error: any) {
    if (error.data?.message) {
      throw new Error(error.data.message)
    }
    throw error
  }
}
```

---

### 3.5. Update Course - PUT /api/v1/courses/:id

Kursni yangilash (Admin only)

**Endpoint:** `PUT /api/v1/courses/:id`

**Headers:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "JavaScript Advanced",
  "level": "advanced",
  "description": "Yangilangan tavsif",
  "pricingType": "individual",
  "price": 299000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Advanced",
    "level": "advanced",
    // ... updated fields
  }
}
```

---

### 3.6. Update Course Status - PATCH /api/v1/courses/:id/status

Kurs holatini o'zgartirish (Admin only)

**Endpoint:** `PATCH /api/v1/courses/:id/status`

**Request Body:**
```json
{
  "status": "active"
}
```

**Status Options:** `draft` | `active` | `inactive`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "active",
    // ... other fields
  }
}
```

---

### 3.7. Delete Course - DELETE /api/v1/courses/:id

Kursni o'chirish (Admin only)

**Endpoint:** `DELETE /api/v1/courses/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 4. Modules API

### 4.1. Get All Modules for Course - GET /api/v1/courses/:courseId/modules

Kursning barcha modullarini olish

**Endpoint:** `GET /api/v1/courses/:courseId/modules`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "id": 1,
        "courseId": 1,
        "name": "Kirish",
        "description": "JavaScript ga kirish",
        "order": 1,
        "lessonsCount": 5,
        "createdAt": "2025-11-16T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Lessons API

### 5.1. Get All Lessons for Module - GET /api/v1/modules/:moduleId/lessons

Modulning barcha darslarini olish

**Endpoint:** `GET /api/v1/modules/:moduleId/lessons`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": 1,
        "moduleId": 1,
        "name": "Birinchi dars",
        "description": "JavaScript kirish",
        "content": "Dars matni...",
        "duration": 600,
        "videoUrl": "https://...",
        "order": 1,
        "createdAt": "2025-11-16T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 6. Profile API

### 6.1. Get Profile - GET /api/v1/profile

Joriy foydalanuvchi profili

**Endpoint:** `GET /api/v1/profile`

**Headers:**
```http
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "phone": "+998901234567",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "role": "student",
    "avatar": null,
    "status": "active",
    "isActive": true,
    "isEmailVerified": false,
    "lastLoginAt": "2025-11-16T10:00:00.000Z",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-16T10:00:00.000Z"
  }
}
```

**Nuxt 3 Example:**
```typescript
// composables/useProfile.ts
export const useProfile = () => {
  const { $api } = useNuxtApp()

  const { data, pending, error, refresh } = useAsyncData(
    'profile',
    () => $api('/api/v1/profile')
  )

  const profile = computed(() => data.value?.data || null)

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isTeacher = computed(() => profile.value?.role === 'teacher')
  const isStudent = computed(() => profile.value?.role === 'student')

  return {
    profile,
    isAdmin,
    isTeacher,
    isStudent,
    loading: pending,
    error,
    refresh
  }
}

// Usage
const { profile, isAdmin } = useProfile()
```

---

### 6.2. Update Profile - PUT /api/v1/profile

Profilni yangilash

**Endpoint:** `PUT /api/v1/profile`

**Request Body:**
```json
{
  "firstName": "Vali",
  "lastName": "Aliyev",
  "phone": "+998901234567",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Vali",
    "lastName": "Aliyev",
    // ... updated fields
  }
}
```

---

## 7. Users API (Admin)

### 7.1. Get All Users - GET /api/v1/users

Barcha foydalanuvchilar (Admin only)

**Endpoint:** `GET /api/v1/users`

**Query Parameters:**
```
page        (optional) - Sahifa raqami
limit       (optional) - Har sahifada nechta
role        (optional) - admin | teacher | student
status      (optional) - active | blocked
search      (optional) - Email yoki ism bo'yicha
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "student@example.com",
        "firstName": "Ali",
        "lastName": "Valiyev",
        "role": "student",
        "status": "active",
        "isActive": true,
        "createdAt": "2025-11-15T10:00:00.000Z"
      }
    ],
    "total": 100,
    "totalPages": 10,
    "currentPage": 1
  }
}
```

---

## 8. Common Errors

### 8.1. Authentication Errors

```json
// 401 - Token missing or invalid
{
  "success": false,
  "message": "Authentication required"
}

// 401 - Token expired
{
  "success": false,
  "message": "Token expired"
}

// 403 - Insufficient permissions
{
  "success": false,
  "message": "Access denied"
}
```

### 8.2. Validation Errors

```json
// 400 - Validation failed
{
  "success": false,
  "message": "Validation error message"
}
```

### 8.3. Not Found Errors

```json
// 404 - Resource not found
{
  "success": false,
  "message": "Resource not found"
}
```

---

## 9. Frontend Integration

### 9.1. API Plugin Setup

```typescript
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authToken = useCookie('authToken')

  const api = $fetch.create({
    baseURL: config.public.apiBase || 'http://localhost:5000',

    onRequest({ options }) {
      if (authToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authToken.value}`
        }
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        authToken.value = null
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
```

### 9.2. Environment Variables

```bash
# .env
NUXT_PUBLIC_API_BASE=http://localhost:5000
```

### 9.3. Complete Example - Course List Page

```vue
<!-- pages/courses/index.vue -->
<script setup lang="ts">
const { directions } = useDirections({ status: 'active' })

const filters = ref({
  directionId: null as number | null,
  level: null as string | null,
  status: 'active',
  page: 1,
  limit: 12
})

const { courses, pagination, loading } = useCourses(filters.value)

const setDirection = (id: number | null) => {
  filters.value.directionId = id
  filters.value.page = 1
}

const setLevel = (level: string | null) => {
  filters.value.level = level
  filters.value.page = 1
}

const nextPage = () => {
  if (filters.value.page < pagination.value.totalPages) {
    filters.value.page++
  }
}

const prevPage = () => {
  if (filters.value.page > 1) {
    filters.value.page--
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Kurslar</h1>

    <!-- Filters -->
    <div class="filters mb-8">
      <!-- Direction Filter -->
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Yo'nalish</h3>
        <div class="flex gap-2 flex-wrap">
          <button
            @click="setDirection(null)"
            :class="[
              'px-4 py-2 rounded',
              !filters.directionId ? 'bg-blue-600 text-white' : 'bg-gray-200'
            ]"
          >
            Barchasi
          </button>
          <button
            v-for="dir in directions"
            :key="dir.id"
            @click="setDirection(dir.id)"
            :class="[
              'px-4 py-2 rounded',
              filters.directionId === dir.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
            ]"
          >
            {{ dir.name }}
          </button>
        </div>
      </div>

      <!-- Level Filter -->
      <div>
        <h3 class="font-semibold mb-2">Daraja</h3>
        <select
          v-model="filters.level"
          class="px-4 py-2 border rounded"
        >
          <option :value="null">Barchasi</option>
          <option value="beginner">Boshlang'ich</option>
          <option value="elementary">Elementar</option>
          <option value="intermediate">O'rta</option>
          <option value="upper-intermediate">O'rta-Yuqori</option>
          <option value="advanced">Yuqori</option>
          <option value="proficiency">Professional</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      Yuklanmoqda...
    </div>

    <!-- Courses Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="course in courses"
        :key="course.id"
        :to="`/courses/${course.id}`"
        class="border rounded-lg overflow-hidden hover:shadow-lg transition"
      >
        <img
          :src="course.thumbnail || '/default-course.jpg'"
          :alt="course.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ course.name }}</h3>
          <p class="text-gray-600 text-sm mb-2 line-clamp-2">
            {{ course.description }}
          </p>
          <div class="flex justify-between items-center text-sm">
            <span class="text-blue-600">{{ course.direction.name }}</span>
            <span class="text-gray-500">{{ course.level }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center gap-4 mt-8">
      <button
        @click="prevPage"
        :disabled="filters.page === 1"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Oldingi
      </button>
      <span class="px-4 py-2">
        {{ filters.page }} / {{ pagination.totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="filters.page === pagination.totalPages"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Keyingi
      </button>
    </div>
  </div>
</template>
```

---

## 🔗 Additional Resources

- **Swagger UI**: http://localhost:5000/api-docs
- **Nuxt 3 Integration**: [NUXT3_GET_APIS_GUIDE.md](./NUXT3_GET_APIS_GUIDE.md)
- **Course Creation**: [NUXT3_FRONTEND_PROMPT.txt](./NUXT3_FRONTEND_PROMPT.txt)

---

**Last Updated:** 2025-11-16
**API Version:** 1.0.0
**Status:** ✅ Production Ready
