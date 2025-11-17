# 📖 Nuxt 3 - GET APIs Integration Guide

To'liq qo'llanma - Frontend uchun barcha GET API endpoint'larini ishlatish

## 🎯 Maqsad

Bu qo'llanma LMS platformasi frontendini backend API bilan bog'lash uchun tayyorlangan.
Nuxt 3 Composition API, TypeScript va best practices ishlatilgan.

---

## 📋 Mavjud GET API Endpoint'lar

### 1. Directions API
### 2. Courses API
### 3. Modules API
### 4. Lessons API
### 5. Profile API

---

## 1️⃣ DIRECTIONS API

### GET /api/v1/directions - Barcha yo'nalishlarni olish

**Query Parameters:**
- `page` (optional) - Sahifa raqami (default: 1)
- `limit` (optional) - Har sahifada nechta (default: 10)
- `search` (optional) - Qidiruv
- `status` (optional) - `active` | `inactive`
- `sortBy` (optional) - Saralash maydoni (default: displayOrder)
- `sortOrder` (optional) - `asc` | `desc`

**Response:**
```typescript
{
  success: true,
  data: {
    directions: [
      {
        id: 1,
        name: "Programming",
        slug: "programming",
        description: "Learn programming...",
        color: "blue",
        icon: "Code",
        status: "active",
        displayOrder: 1,
        createdAt: "2025-11-16T10:00:00.000Z",
        updatedAt: "2025-11-16T10:00:00.000Z"
      }
    ],
    total: 8,
    totalPages: 1,
    currentPage: 1
  }
}
```

### Nuxt 3 Composable

```typescript
// composables/useDirections.ts
export const useDirections = () => {
  const { $api } = useNuxtApp()

  // Get all directions
  const { data, pending, error, refresh } = useAsyncData(
    'directions',
    () => $api<DirectionsResponse>('/api/v1/directions'),
    {
      // Cache for 5 minutes
      getCachedData(key) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  )

  const directions = computed(() => data.value?.data?.directions || [])

  return {
    directions,
    loading: pending,
    error,
    refresh
  }
}

// Types
interface Direction {
  id: number
  name: string
  slug: string
  description: string
  color: string
  icon: string
  status: 'active' | 'inactive'
  displayOrder: number
  createdAt: string
  updatedAt: string
}

interface DirectionsResponse {
  success: boolean
  data: {
    directions: Direction[]
    total: number
    totalPages: number
    currentPage: number
  }
}
```

### Usage in Pages

```vue
<script setup lang="ts">
const { directions, loading, error } = useDirections()
</script>

<template>
  <div>
    <div v-if="loading">Yuklanmoqda...</div>
    <div v-else-if="error">Xatolik: {{ error.message }}</div>
    <div v-else>
      <div v-for="direction in directions" :key="direction.id">
        <h3>{{ direction.name }}</h3>
        <p>{{ direction.description }}</p>
      </div>
    </div>
  </div>
</template>
```

---

## 2️⃣ COURSES API

### GET /api/v1/courses - Barcha kurslarni olish

**Query Parameters:**
- `page` - Sahifa (default: 1)
- `limit` - Limit (default: 10)
- `directionId` - Yo'nalish ID filter
- `level` - Daraja filter (`beginner`, `elementary`, etc.)
- `status` - Holat filter (`draft`, `active`, `inactive`)
- `pricingType` - `subscription` | `individual`
- `teacherId` - O'qituvchi ID filter

**Response:**
```typescript
{
  success: true,
  data: {
    courses: [
      {
        id: 1,
        name: "JavaScript Asoslari",
        slug: "javascript-asoslari",
        directionId: 1,
        level: "beginner",
        description: "JavaScript dasturlash...",
        pricingType: "subscription",
        price: 0,
        teacherId: 2,
        thumbnail: "https://...",
        status: "active",
        direction: {
          id: 1,
          name: "Programming",
          slug: "programming",
          color: "blue",
          icon: "Code"
        },
        teacher: {
          id: 2,
          firstName: "Ali",
          lastName: "Valiyev",
          avatar: null
        },
        createdAt: "...",
        updatedAt: "..."
      }
    ],
    total: 25,
    totalPages: 3,
    currentPage: 1
  }
}
```

### Nuxt 3 Composable with Filters

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
    () => $api<CoursesResponse>(`/api/v1/courses${queryString.value}`)
  )

  const courses = computed(() => data.value?.data?.courses || [])
  const pagination = computed(() => ({
    total: data.value?.data?.total || 0,
    totalPages: data.value?.data?.totalPages || 0,
    currentPage: data.value?.data?.currentPage || 1
  }))

  return {
    courses,
    pagination,
    loading: pending,
    error,
    refresh
  }
}

// Types
interface CourseFilters {
  page?: number
  limit?: number
  directionId?: number
  level?: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficiency'
  status?: 'draft' | 'active' | 'inactive'
  pricingType?: 'subscription' | 'individual'
  teacherId?: number
}

interface Course {
  id: number
  name: string
  slug: string
  directionId: number
  level: string
  description: string
  pricingType: 'subscription' | 'individual'
  price: number
  teacherId: number | null
  thumbnail: string | null
  status: 'draft' | 'active' | 'inactive'
  direction: {
    id: number
    name: string
    slug: string
    color: string
    icon: string
  }
  teacher: {
    id: number
    firstName: string
    lastName: string
    avatar: string | null
  } | null
  createdAt: string
  updatedAt: string
}

interface CoursesResponse {
  success: boolean
  data: {
    courses: Course[]
    total: number
    totalPages: number
    currentPage: number
  }
}
```

### Usage with Filters

```vue
<script setup lang="ts">
const filters = ref<CourseFilters>({
  directionId: 1,  // Programming
  level: 'beginner',
  status: 'active',
  page: 1,
  limit: 10
})

const { courses, pagination, loading } = useCourses(filters.value)

// Filter o'zgarganda
watch(filters, (newFilters) => {
  // Auto-reload with new filters
}, { deep: true })
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="filters">
      <select v-model="filters.directionId">
        <option :value="null">Barcha yo'nalishlar</option>
        <!-- directions... -->
      </select>

      <select v-model="filters.level">
        <option :value="null">Barcha darajalar</option>
        <option value="beginner">Boshlang'ich</option>
        <option value="intermediate">O'rta</option>
        <!-- ... -->
      </select>
    </div>

    <!-- Courses List -->
    <div v-if="loading">Yuklanmoqda...</div>
    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <img :src="course.thumbnail || '/default.jpg'" :alt="course.name" />
        <h3>{{ course.name }}</h3>
        <p>{{ course.description }}</p>
        <div class="meta">
          <span>{{ course.direction.name }}</span>
          <span>{{ course.level }}</span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="filters.page = pagination.currentPage - 1"
        :disabled="pagination.currentPage === 1"
      >
        Oldingi
      </button>
      <span>{{ pagination.currentPage }} / {{ pagination.totalPages }}</span>
      <button
        @click="filters.page = pagination.currentPage + 1"
        :disabled="pagination.currentPage === pagination.totalPages"
      >
        Keyingi
      </button>
    </div>
  </div>
</template>
```

---

### GET /api/v1/courses/:id - Kurs detallari

**Response:**
```typescript
{
  success: true,
  data: {
    id: 1,
    name: "JavaScript Asoslari",
    slug: "javascript-asoslari",
    // ... basic fields
    modules: [
      {
        id: 1,
        courseId: 1,
        name: "Kirish",
        description: "JavaScript ga kirish",
        order: 1,
        lessons: [
          {
            id: 1,
            name: "Birinchi dars",
            duration: 600,
            order: 1
          }
        ],
        createdAt: "...",
        updatedAt: "..."
      }
    ],
    stats: {
      totalModules: 5,
      totalLessons: 25,
      totalDuration: 15000,
      totalDurationFormatted: "4h 10m"
    },
    // ... timestamps
  }
}
```

### Composable for Single Course

```typescript
// composables/useCourse.ts
export const useCourse = (courseId: MaybeRef<number>) => {
  const { $api } = useNuxtApp()
  const id = computed(() => unref(courseId))

  const { data, pending, error, refresh } = useAsyncData(
    `course-${id.value}`,
    () => $api<CourseDetailResponse>(`/api/v1/courses/${id.value}`)
  )

  const course = computed(() => data.value?.data || null)

  return {
    course,
    loading: pending,
    error,
    refresh
  }
}

interface CourseDetailResponse {
  success: boolean
  data: Course & {
    modules: Module[]
    stats: {
      totalModules: number
      totalLessons: number
      totalDuration: number
      totalDurationFormatted: string
    }
  }
}

interface Module {
  id: number
  courseId: number
  name: string
  description: string
  order: number
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

interface Lesson {
  id: number
  name: string
  duration: number
  order: number
}
```

### Usage - Course Detail Page

```vue
<script setup lang="ts">
const route = useRoute()
const courseId = computed(() => Number(route.params.id))

const { course, loading, error } = useCourse(courseId)
</script>

<template>
  <div>
    <div v-if="loading">Yuklanmoqda...</div>
    <div v-else-if="error">Kurs topilmadi</div>
    <div v-else-if="course">
      <h1>{{ course.name }}</h1>
      <p>{{ course.description }}</p>

      <!-- Course Info -->
      <div class="info">
        <div>Yo'nalish: {{ course.direction.name }}</div>
        <div>Daraja: {{ course.level }}</div>
        <div>O'qituvchi: {{ course.teacher?.firstName }} {{ course.teacher?.lastName }}</div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div>{{ course.stats.totalModules }} ta modul</div>
        <div>{{ course.stats.totalLessons }} ta dars</div>
        <div>{{ course.stats.totalDurationFormatted }}</div>
      </div>

      <!-- Modules -->
      <div class="modules">
        <div v-for="module in course.modules" :key="module.id">
          <h3>{{ module.name }}</h3>
          <p>{{ module.description }}</p>

          <!-- Lessons -->
          <ul>
            <li v-for="lesson in module.lessons" :key="lesson.id">
              {{ lesson.name }} ({{ formatDuration(lesson.duration) }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

### GET /api/v1/courses/directions/:directionId/courses - Yo'nalish bo'yicha kurslar

```typescript
// composables/useCoursesByDirection.ts
export const useCoursesByDirection = (directionId: MaybeRef<number>) => {
  const { $api } = useNuxtApp()
  const id = computed(() => unref(directionId))

  const { data, pending, error, refresh } = useAsyncData(
    `courses-direction-${id.value}`,
    () => $api<CoursesResponse>(
      `/api/v1/courses/directions/${id.value}/courses`
    )
  )

  const courses = computed(() => data.value?.data?.courses || [])

  return {
    courses,
    loading: pending,
    error,
    refresh
  }
}
```

---

## 3️⃣ PROFILE API

### GET /api/v1/profile - Joriy foydalanuvchi profili

**Response:**
```typescript
{
  success: true,
  data: {
    id: 1,
    email: "user@example.com",
    phone: "+998901234567",
    firstName: "Ali",
    lastName: "Valiyev",
    role: "student",
    avatar: "https://...",
    status: "active",
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2025-11-16T10:00:00.000Z",
    createdAt: "2025-11-15T10:00:00.000Z",
    updatedAt: "2025-11-16T10:00:00.000Z"
  }
}
```

### Composable

```typescript
// composables/useProfile.ts
export const useProfile = () => {
  const { $api } = useNuxtApp()

  const { data, pending, error, refresh } = useAsyncData(
    'profile',
    () => $api<ProfileResponse>('/api/v1/profile')
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

interface ProfileResponse {
  success: boolean
  data: {
    id: number
    email: string
    phone: string | null
    firstName: string
    lastName: string
    role: 'admin' | 'teacher' | 'student'
    avatar: string | null
    status: 'active' | 'blocked'
    isActive: boolean
    isEmailVerified: boolean
    lastLoginAt: string | null
    createdAt: string
    updatedAt: string
  }
}
```

---

## 🔧 Global API Setup

### 1. API Plugin

```typescript
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authToken = useCookie('authToken')

  const api = $fetch.create({
    baseURL: config.public.apiBase || 'http://localhost:5000',

    onRequest({ options }) {
      // Add auth token
      if (authToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authToken.value}`
        }
      }
    },

    onResponse({ response }) {
      // Handle successful responses
      if (response._data?.success === false) {
        console.error('API Error:', response._data.message)
      }
    },

    onResponseError({ response }) {
      // Handle error responses
      if (response.status === 401) {
        // Unauthorized - redirect to login
        authToken.value = null
        navigateTo('/login')
      } else if (response.status === 403) {
        // Forbidden
        console.error('Access denied')
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

### 2. Runtime Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000'
    }
  }
})
```

### 3. .env file

```bash
NUXT_PUBLIC_API_BASE=http://localhost:5000
```

---

## 📊 Utility Functions

### Format Duration

```typescript
// utils/formatDuration.ts
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
```

### Format Date

```typescript
// utils/formatDate.ts
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
```

---

## 🎨 Example Pages

### Home Page - All Courses

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
const { directions } = useDirections()
const { courses, loading } = useCourses({ status: 'active', limit: 6 })
</script>

<template>
  <div>
    <h1>LMS Platform</h1>

    <!-- Directions -->
    <section>
      <h2>Yo'nalishlar</h2>
      <div class="directions-grid">
        <NuxtLink
          v-for="dir in directions"
          :key="dir.id"
          :to="`/directions/${dir.slug}`"
        >
          {{ dir.name }}
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Courses -->
    <section>
      <h2>Ommabop Kurslar</h2>
      <div v-if="loading">Loading...</div>
      <div v-else class="courses-grid">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
        />
      </div>
    </section>
  </div>
</template>
```

### Direction Page

```vue
<!-- pages/directions/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { directions } = useDirections()

const currentDirection = computed(() =>
  directions.value.find(d => d.slug === route.params.slug)
)

const { courses, loading } = useCourses({
  directionId: currentDirection.value?.id,
  status: 'active'
})
</script>

<template>
  <div v-if="currentDirection">
    <h1>{{ currentDirection.name }}</h1>
    <p>{{ currentDirection.description }}</p>

    <div v-if="loading">Loading...</div>
    <div v-else class="courses-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
  </div>
</template>
```

---

## ✅ Best Practices

1. **Caching**: Use `useAsyncData` with caching strategy
2. **Error Handling**: Always handle loading and error states
3. **TypeScript**: Use proper types for better DX
4. **Composables**: Extract reusable logic
5. **Lazy Loading**: Use `useLazyAsyncData` for non-critical data
6. **Refresh**: Provide refresh functionality when needed

---

## 🔗 Foydali Linklar

- Swagger UI: http://localhost:5000/api-docs
- API Base URL: http://localhost:5000
- Frontend: http://localhost:3000

---

**Created:** 2025-11-16
**Backend:** Express.js + Sequelize
**Frontend:** Nuxt 3 + TypeScript
**Status:** ✅ Ready for Integration
