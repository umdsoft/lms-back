# 📚 LESSONS API HUJJATLARI

## Umumiy Ma'lumot

Ushbu API modullar ichiga mavzalar (lessons) qo'shish, o'zgartirish va boshqarish uchun ishlatiladi.

### Tizim Strukturasi
```
Yo'nalish (Direction)
    └── Kurs (Course)
        └── Modul (Module)
            └── Mavzu (Lesson) ← BU API
                ├── Video
                ├── Fayllar (LessonFiles)
                └── Testlar (Tests)
```

### Database Schema

**lessons** table:
```sql
CREATE TABLE lessons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module_id INT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  video_type ENUM('youtube', 'direct') DEFAULT 'youtube',
  video_url VARCHAR(500) NOT NULL,
  video_embed_url VARCHAR(500),
  duration INT DEFAULT 0,  -- sekund hisobida
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_module_id (module_id),
  INDEX idx_module_order (module_id, `order`)
);
```

---

## 📋 API ENDPOINTS

### 1. GET /api/v1/modules/:moduleId/lessons
**Modul ichidagi barcha mavzularni olish**

**Authentication:** Required (JWT Token)

**Request:**
```http
GET /api/v1/modules/1/lessons
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": 1,
        "moduleId": 1,
        "name": "Node.js ga kirish",
        "description": "Node.js asoslari va o'rnatish",
        "videoType": "youtube",
        "videoUrl": "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        "videoEmbedUrl": "https://www.youtube.com/embed/TlB_eWDSMt4",
        "duration": 900,
        "order": 0,
        "filesCount": 2,
        "testsCount": 1,
        "createdAt": "2025-11-20T10:00:00.000Z",
        "updatedAt": "2025-11-20T10:00:00.000Z",
        "files": [
          {
            "id": 1,
            "name": "nodejs-kirish.pdf",
            "url": "https://example.com/files/nodejs-kirish.pdf",
            "fileType": "pdf",
            "fileSize": 1048576
          }
        ],
        "tests": [
          {
            "id": 1,
            "name": "Node.js asoslari testi",
            "status": "ACTIVE"
          }
        ]
      }
    ]
  }
}
```

---

### 2. POST /api/v1/modules/:moduleId/lessons
**Yangi mavzu yaratish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
POST /api/v1/modules/1/lessons
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Express.js bilan ishlash",
  "description": "Express.js framework asoslari va routing",
  "video_url": "https://www.youtube.com/watch?v=L72fhGm1tfE",
  "duration": 1200
}
```

**Request Body (Minimal):**
```json
{
  "name": "Mavzu nomi",
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Request Body (To'liq):**
```json
{
  "name": "Mavzu nomi",
  "description": "Mavzu haqida batafsil ma'lumot",
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "duration": 900,
  "order": 5
}
```

**Video URL Formatlari:**
- YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
- YouTube Short: `https://youtu.be/VIDEO_ID`
- YouTube Embed: `https://www.youtube.com/embed/VIDEO_ID`
- To'g'ridan-to'g'ri video: `https://example.com/video.mp4`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "lesson": {
      "id": 2,
      "moduleId": 1,
      "name": "Express.js bilan ishlash",
      "description": "Express.js framework asoslari va routing",
      "videoType": "youtube",
      "videoUrl": "https://www.youtube.com/watch?v=L72fhGm1tfE",
      "videoEmbedUrl": "https://www.youtube.com/embed/L72fhGm1tfE",
      "duration": 1200,
      "order": 1,
      "filesCount": 0,
      "testsCount": 0,
      "createdAt": "2025-11-20T11:00:00.000Z",
      "updatedAt": "2025-11-20T11:00:00.000Z",
      "module": {
        "id": 1,
        "name": "Backend dasturlash",
        "courseId": 1,
        "course": {
          "id": 1,
          "name": "Node.js Full Course",
          "slug": "nodejs-full-course"
        }
      }
    }
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Module not found"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Lesson name is required"
    }
  ]
}
```

---

### 3. GET /api/v1/lessons/:id
**Bitta mavzuni ID bo'yicha olish**

**Authentication:** Required (JWT Token)

**Request:**
```http
GET /api/v1/lessons/2
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": 2,
      "moduleId": 1,
      "name": "Express.js bilan ishlash",
      "description": "Express.js framework asoslari va routing",
      "videoType": "youtube",
      "videoUrl": "https://www.youtube.com/watch?v=L72fhGm1tfE",
      "videoEmbedUrl": "https://www.youtube.com/embed/L72fhGm1tfE",
      "duration": 1200,
      "order": 1,
      "filesCount": 1,
      "testsCount": 1,
      "createdAt": "2025-11-20T11:00:00.000Z",
      "updatedAt": "2025-11-20T11:00:00.000Z",
      "module": {
        "id": 1,
        "name": "Backend dasturlash",
        "courseId": 1,
        "course": {
          "id": 1,
          "name": "Node.js Full Course",
          "slug": "nodejs-full-course"
        }
      },
      "files": [
        {
          "id": 1,
          "lessonId": 2,
          "name": "express-routing.pdf",
          "url": "https://example.com/files/express-routing.pdf",
          "fileType": "pdf",
          "fileSize": 2097152,
          "createdAt": "2025-11-20T11:30:00.000Z",
          "updatedAt": "2025-11-20T11:30:00.000Z"
        }
      ],
      "tests": [
        {
          "id": 1,
          "lessonId": 2,
          "name": "Express.js asoslari testi",
          "status": "ACTIVE",
          "createdAt": "2025-11-20T11:45:00.000Z",
          "updatedAt": "2025-11-20T11:45:00.000Z"
        }
      ]
    }
  }
}
```

---

### 4. PUT /api/v1/lessons/:id
**Mavzuni yangilash**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
PUT /api/v1/lessons/2
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Express.js bilan ishlash (yangilangan)",
  "description": "Express.js framework asoslari, routing va middleware",
  "video_url": "https://www.youtube.com/watch?v=NEW_VIDEO_ID",
  "duration": 1500
}
```

**Note:** `order` ni o'zgartirish uchun `/api/v1/lessons/:id/reorder` endpointidan foydalaning.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "lesson": {
      "id": 2,
      "moduleId": 1,
      "name": "Express.js bilan ishlash (yangilangan)",
      "description": "Express.js framework asoslari, routing va middleware",
      "videoType": "youtube",
      "videoUrl": "https://www.youtube.com/watch?v=NEW_VIDEO_ID",
      "videoEmbedUrl": "https://www.youtube.com/embed/NEW_VIDEO_ID",
      "duration": 1500,
      "order": 1,
      "filesCount": 1,
      "testsCount": 1,
      "createdAt": "2025-11-20T11:00:00.000Z",
      "updatedAt": "2025-11-20T12:00:00.000Z"
    }
  }
}
```

---

### 5. DELETE /api/v1/lessons/:id
**Mavzuni o'chirish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
DELETE /api/v1/lessons/2
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lesson deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Lesson not found"
}
```

---

### 6. PATCH /api/v1/lessons/:id/reorder
**Bitta mavzuni tartibini o'zgartirish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
PATCH /api/v1/lessons/2/reorder
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "order": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lesson reordered successfully",
  "data": {
    "lesson": {
      "id": 2,
      "moduleId": 1,
      "name": "Express.js bilan ishlash",
      "order": 5,
      "createdAt": "2025-11-20T11:00:00.000Z",
      "updatedAt": "2025-11-20T12:30:00.000Z"
    }
  }
}
```

---

### 7. POST /api/v1/modules/:moduleId/lessons/reorder-bulk
**Ko'plab mavzularni tartibini bir vaqtda o'zgartirish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
POST /api/v1/modules/1/lessons/reorder-bulk
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

[
  { "lessonId": 3, "order": 0 },
  { "lessonId": 1, "order": 1 },
  { "lessonId": 2, "order": 2 },
  { "lessonId": 4, "order": 3 }
]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lessons reordered successfully",
  "data": {
    "lessons": [
      {
        "id": 3,
        "name": "Birinchi mavzu",
        "order": 0
      },
      {
        "id": 1,
        "name": "Ikkinchi mavzu",
        "order": 1
      },
      {
        "id": 2,
        "name": "Uchinchi mavzu",
        "order": 2
      },
      {
        "id": 4,
        "name": "To'rtinchi mavzu",
        "order": 3
      }
    ]
  }
}
```

---

### 8. GET /api/v1/lessons/:id/files
**Mavzu fayllarini olish**

**Authentication:** Required (JWT Token)

**Request:**
```http
GET /api/v1/lessons/2/files
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": 1,
        "lessonId": 2,
        "name": "express-routing.pdf",
        "url": "https://example.com/files/express-routing.pdf",
        "fileType": "pdf",
        "fileSize": 2097152,
        "createdAt": "2025-11-20T11:30:00.000Z",
        "updatedAt": "2025-11-20T11:30:00.000Z"
      },
      {
        "id": 2,
        "lessonId": 2,
        "name": "code-examples.zip",
        "url": "https://example.com/files/code-examples.zip",
        "fileType": "zip",
        "fileSize": 512000,
        "createdAt": "2025-11-20T11:35:00.000Z",
        "updatedAt": "2025-11-20T11:35:00.000Z"
      }
    ]
  }
}
```

---

### 9. POST /api/v1/lessons/:id/files
**Mavzuga fayl qo'shish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
POST /api/v1/lessons/2/files
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "homework.pdf",
  "url": "https://example.com/files/homework.pdf",
  "fileType": "pdf",
  "fileSize": 1048576
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "File added successfully",
  "data": {
    "file": {
      "id": 3,
      "lessonId": 2,
      "name": "homework.pdf",
      "url": "https://example.com/files/homework.pdf",
      "fileType": "pdf",
      "fileSize": 1048576,
      "createdAt": "2025-11-20T13:00:00.000Z",
      "updatedAt": "2025-11-20T13:00:00.000Z"
    }
  }
}
```

---

### 10. DELETE /api/v1/lessons/files/:fileId
**Mavzu faylini o'chirish**

**Authentication:** Required (JWT Token)
**Authorization:** Admin only

**Request:**
```http
DELETE /api/v1/lessons/files/3
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## 🔐 Authentication

Barcha endpointlar JWT token autentifikatsiyasini talab qiladi.

**Token olish (Login):**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@lms.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "email": "admin@lms.com",
      "role": "admin"
    }
  }
}
```

**Token ishlatish:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Frontend uchun To'liq Misol

### Mavzu Yaratish (Admin Panel)

**Kiruvchi ma'lumotlar (Frontend Form):**
```javascript
const lessonData = {
  name: "Node.js Event Loop tushunchasi",
  description: "Event Loop qanday ishlaydi va asinxron dasturlash",
  video_url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
  video_type: "youtube",
  video_embed_url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
  duration: 900,
  module_id: 1
};

// API so'rovi
const response = await fetch('/api/v1/modules/1/lessons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(lessonData)
});
```

**API Javobi:**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "lesson": {
      "id": 5,
      "moduleId": 1,
      "name": "Node.js Event Loop tushunchasi",
      "description": "Event Loop qanday ishlaydi va asinxron dasturlash",
      "videoType": "youtube",
      "videoUrl": "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
      "videoEmbedUrl": "https://www.youtube.com/embed/8aGhZQkoFbQ",
      "duration": 900,
      "order": 4,
      "filesCount": 0,
      "testsCount": 0,
      "createdAt": "2025-11-20T14:00:00.000Z",
      "updatedAt": "2025-11-20T14:00:00.000Z"
    }
  }
}
```

---

## ⚠️ Xatoliklar

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Lesson name is required"
    },
    {
      "field": "video_url",
      "message": "Video URL must be valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Module not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🎯 Frontend Integration Qo'llanma

### 1. Modulga Mavzu Qo'shish Forma

```vue
<template>
  <form @submit.prevent="createLesson">
    <input v-model="form.name" placeholder="Mavzu nomi" required />
    <textarea v-model="form.description" placeholder="Tavsif"></textarea>
    <input v-model="form.video_url" placeholder="YouTube URL" required />
    <input v-model="form.duration" type="number" placeholder="Davomiyligi (sekund)" />
    <button type="submit">Yaratish</button>
  </form>
</template>

<script setup>
const form = ref({
  name: '',
  description: '',
  video_url: '',
  duration: 0
});

const createLesson = async () => {
  try {
    const response = await $fetch(`/api/v1/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form.value
    });

    if (response.success) {
      console.log('Mavzu yaratildi:', response.data.lesson);
      // Formani tozalash
      form.value = { name: '', description: '', video_url: '', duration: 0 };
    }
  } catch (error) {
    console.error('Xatolik:', error);
  }
};
</script>
```

### 2. Mavzular Ro'yxatini Ko'rsatish

```vue
<template>
  <div v-for="lesson in lessons" :key="lesson.id">
    <h3>{{ lesson.name }}</h3>
    <p>{{ lesson.description }}</p>
    <iframe :src="lesson.videoEmbedUrl" width="560" height="315"></iframe>
    <p>Fayllar: {{ lesson.filesCount }} | Testlar: {{ lesson.testsCount }}</p>
  </div>
</template>

<script setup>
const lessons = ref([]);

const fetchLessons = async () => {
  const response = await $fetch(`/api/v1/modules/${moduleId}/lessons`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  lessons.value = response.data.lessons;
};

onMounted(() => {
  fetchLessons();
});
</script>
```

---

## 📝 Muhim Eslatmalar

1. **Video URL Processing**: API avtomatik ravishda YouTube URL larini embed formatga o'zgartiradi
2. **Order Management**: Yangi mavzu yaratilganda avtomatik ravishda oxirgi tartib raqami beriladi
3. **Cascade Delete**: Modul o'chirilganda uning barcha mavzulari ham o'chiriladi
4. **File Size**: fileSize baytlarda saqlanadi (1MB = 1048576 bytes)
5. **Duration**: Davomiylik sekund hisobida saqlanadi

---

## 🔄 Video URL Konversiya Qo'llanmasi

API avtomatik ravishda turli YouTube URL formatlarini qayta ishlaydi:

| Kiruvchi Format | Chiquvchi Embed URL |
|-----------------|---------------------|
| `https://www.youtube.com/watch?v=VIDEO_ID` | `https://www.youtube.com/embed/VIDEO_ID` |
| `https://youtu.be/VIDEO_ID` | `https://www.youtube.com/embed/VIDEO_ID` |
| `https://www.youtube.com/embed/VIDEO_ID` | `https://www.youtube.com/embed/VIDEO_ID` |
| `https://example.com/video.mp4` | `https://example.com/video.mp4` |

---

## 💡 Best Practices

1. **Video davomiyligini to'g'ri kiriting**: Foydalanuvchilar uchun muhim
2. **Tartibni boshqaring**: Mantiqiy tartibda mavzularni joylashtiring
3. **Tavsif yozing**: SEO va foydalanuvchi tajribasi uchun zarur
4. **Fayllarni qo'shing**: Qo'shimcha materiallar o'quv jarayonini yaxshilaydi
5. **Testlar qo'shing**: Bilim tekshirish uchun

---

**Muallif:** LMS Backend Team
**Versiya:** 1.0
**Oxirgi yangilanish:** 2025-11-20
