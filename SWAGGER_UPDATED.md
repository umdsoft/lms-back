# ✅ Swagger Documentation Updated

## 🎯 Nima Bajarildi?

### 1. Course Routes - To'liq Swagger Documentation ✅

**Fayl:** `src/routes/course.routes.js`

**Qo'shilgan:**
- ✅ GET /api/v1/courses - Barcha kurslar (filter, pagination)
- ✅ GET /api/v1/courses/:id - Kurs detallari (modules, lessons, stats)
- ✅ GET /api/v1/courses/directions/:directionId/courses - Yo'nalish bo'yicha
- ✅ POST /api/v1/courses - Yangi kurs yaratish
- ✅ PUT /api/v1/courses/:id - Kursni yangilash
- ✅ PATCH /api/v1/courses/:id/status - Holat o'zgartirish
- ✅ DELETE /api/v1/courses/:id - Kursni o'chirish

**Har bir endpoint uchun:**
- Summary va description
- Parameters (path, query)
- Request body examples
- Response examples (success va error)
- Tags va security

### 2. Swagger Config Updated ✅

**Fayl:** `src/config/swagger.js`

**Qo'shilgan Tags:**
```javascript
{
  name: 'Directions',
  description: 'Yo\'nalishlar (Programming, Mathematics, English, etc.) CRUD operatsiyalari'
},
{
  name: 'Courses',
  description: 'Kurslar CRUD operatsiyalari - hierarchical structure: Course → Module → Lesson → Test'
},
{
  name: 'Modules',
  description: 'Kurs modullar CRUD operatsiyalari'
},
{
  name: 'Lessons',
  description: 'Darslar CRUD operatsiyalari'
},
{
  name: 'Tests',
  description: 'Testlar va quiz\'lar'
}
```

**Qo'shilgan Schemas:**
- `Direction` - To'liq schema with examples
- `Course` - To'liq schema with nested objects

### 3. Frontend Integration Guide ✅

**Fayl:** `NUXT3_GET_APIS_GUIDE.md`

**Mavzu:**
- Nuxt 3 Composables (useDirections, useCourses, useCourse)
- TypeScript types va interfaces
- Query parameters va filters
- Pagination
- Error handling
- Best practices
- Example pages

---

## 📊 API Endpoint'lar Ro'yxati

### Courses API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/courses | Barcha kurslar | ✅ | All |
| GET | /api/v1/courses/:id | Kurs detallari | ✅ | All |
| GET | /api/v1/courses/directions/:directionId/courses | Yo'nalish bo'yicha | ✅ | All |
| POST | /api/v1/courses | Yangi kurs | ✅ | Admin |
| PUT | /api/v1/courses/:id | Kursni yangilash | ✅ | Admin |
| PATCH | /api/v1/courses/:id/status | Holat o'zgartirish | ✅ | Admin |
| DELETE | /api/v1/courses/:id | Kursni o'chirish | ✅ | Admin |

### Directions API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/directions | Barcha yo'nalishlar | ✅ | All |
| GET | /api/v1/directions/:id | Direction detallari | ✅ | All |
| POST | /api/v1/directions | Yangi direction | ✅ | Admin |
| PUT | /api/v1/directions/:id | Yangilash | ✅ | Admin |
| DELETE | /api/v1/directions/:id | O'chirish | ✅ | Admin |

### Profile API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/profile | Profil ma'lumotlari | ✅ | All |
| PUT | /api/v1/profile | Profilni yangilash | ✅ | All |

---

## 🔍 Swagger UI

### Access

```
http://localhost:5000/api-docs
```

### Features

- ✅ Interactive API documentation
- ✅ Try it out functionality
- ✅ Request/Response examples
- ✅ Schema definitions
- ✅ Authentication support

### How to Use

1. Start server: `npm run dev`
2. Open browser: http://localhost:5000/api-docs
3. Click "Authorize" va JWT token kiriting
4. Try any endpoint!

---

## 📝 Examples from Swagger

### GET /api/v1/courses

**Query Parameters:**
```
page=1
limit=10
directionId=1
level=beginner
status=active
```

**Response Example:**
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
        }
      }
    ],
    "total": 25,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

### POST /api/v1/courses

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
  "thumbnail": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Asoslari",
    "slug": "javascript-asoslari",
    "directionId": 1,
    "level": "beginner",
    "status": "draft"
  }
}
```

### GET /api/v1/courses/:id

**Response with Full Details:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Asoslari",
    // ... basic fields
    "modules": [
      {
        "id": 1,
        "name": "Kirish",
        "description": "JavaScript ga kirish",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "name": "Birinchi dars",
            "duration": 600,
            "order": 1
          }
        ]
      }
    ],
    "stats": {
      "totalModules": 5,
      "totalLessons": 25,
      "totalDuration": 15000,
      "totalDurationFormatted": "4h 10m"
    }
  }
}
```

---

## 🚀 Frontend Integration

### Directions Composable

```typescript
// composables/useDirections.ts
const { directions, loading, error } = useDirections()

// Usage
<div v-for="direction in directions" :key="direction.id">
  {{ direction.name }}
</div>
```

### Courses Composable with Filters

```typescript
// composables/useCourses.ts
const filters = ref({
  directionId: 1,
  level: 'beginner',
  status: 'active',
  page: 1,
  limit: 10
})

const { courses, pagination, loading } = useCourses(filters.value)
```

### Single Course Detail

```typescript
// composables/useCourse.ts
const courseId = ref(1)
const { course, loading, error } = useCourse(courseId)

// course.modules, course.stats, etc.
```

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `NUXT3_GET_APIS_GUIDE.md` | To'liq frontend integration qo'llanmasi |
| `NUXT3_FRONTEND_PROMPT.txt` | Course yaratish form integratsiyasi |
| `API_TESTING_GUIDE.md` | API testing guide |
| `SWAGGER_UPDATED.md` | This file |

---

## ✅ Quality Checks

### Swagger Documentation
- ✅ All endpoints documented
- ✅ Request examples provided
- ✅ Response examples provided
- ✅ Error responses documented
- ✅ Parameters described
- ✅ Authentication configured

### Frontend Integration
- ✅ Composables created
- ✅ TypeScript types defined
- ✅ Error handling included
- ✅ Best practices documented
- ✅ Example code provided

### API Functionality
- ✅ Course CRUD working
- ✅ Direction ID optional (default fallback)
- ✅ Validation working
- ✅ Foreign keys working
- ✅ Pagination working
- ✅ Filters working

---

## 🎯 Next Steps for Frontend

1. **Install Dependencies** (if needed)
   ```bash
   npm install
   ```

2. **Configure API Base URL**
   ```bash
   # .env
   NUXT_PUBLIC_API_BASE=http://localhost:5000
   ```

3. **Create API Plugin**
   ```typescript
   // plugins/api.ts
   // See NUXT3_GET_APIS_GUIDE.md
   ```

4. **Create Composables**
   ```typescript
   // composables/useDirections.ts
   // composables/useCourses.ts
   // composables/useCourse.ts
   ```

5. **Use in Pages**
   ```vue
   <script setup>
   const { courses } = useCourses({ status: 'active' })
   </script>
   ```

---

## 🔗 Quick Links

- **Swagger UI**: http://localhost:5000/api-docs
- **API Base**: http://localhost:5000
- **Frontend Guide**: [NUXT3_GET_APIS_GUIDE.md](./NUXT3_GET_APIS_GUIDE.md)
- **Create Course**: [NUXT3_FRONTEND_PROMPT.txt](./NUXT3_FRONTEND_PROMPT.txt)

---

## 📞 Support

Savol yoki muammo bo'lsa:
- Swagger UI da "Try it out" ishlatib test qiling
- Frontend guide da example'larni ko'ring
- Error response'larni tekshiring

---

**Date:** 2025-11-16
**Status:** ✅ COMPLETED
**Swagger:** ✅ UPDATED
**Frontend Guide:** ✅ READY
