# Modules CRUD API Documentation

## Database o'zgarishlari

### Yaratilgan migrationlar:
1. **20251120000001_create_modules_table.js** - Modules jadvali yaratish
2. **20251120000002_update_lessons_add_module_id.js** - Lessons jadvalini yangilash (course_id → module_id)

### Migrationlarni ishga tushirish:
```bash
npm run migrate:latest
```

---

## API Endpoints

### Base URL: `/api/v1/courses/:courseId/modules`

---

## 1. Barcha modullarni olish (GET)

**Endpoint:** `GET /api/v1/courses/:courseId/modules`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Kiruvchi ma'lumot:**
- `courseId` (path parameter) - Kurs ID

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "name": "1-modul: Kirish",
      "description": "Kursga kirish moduli",
      "order": 0,
      "lessonCount": 5,
      "totalDuration": 3600,
      "lessons": [
        {
          "id": 1,
          "name": "Birinchi dars",
          "duration": 600,
          "order": 0
        }
      ],
      "createdAt": "2025-11-20T10:00:00.000Z",
      "updatedAt": "2025-11-20T10:00:00.000Z"
    }
  ],
  "message": "Modules retrieved successfully"
}
```

**Xatolar:**
- `404` - Kurs topilmadi
- `401` - Autentifikatsiya talab qilinadi

---

## 2. Yangi modul yaratish (POST)

**Endpoint:** `POST /api/v1/courses/:courseId/modules`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

**Kiruvchi ma'lumot:**
```json
{
  "name": "Test 1 modul",
  "description": "Bu test modul",
  "order": 0
}
```

**Maydonlar:**
- `name` (string, required) - Modul nomi (3-200 belgi)
- `description` (string, optional) - Modul tavsifi
- `order` (integer, optional) - Tartiblash raqami (avtomatik belgilanadi agar berilmasa)

**MUHIM:** Agar frontenddan `course_id` kelsa, uni o'chirish kerak chunki u path parameterdan olinadi.

**Chiquvchi ma'lumot (Success 201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "courseId": 1,
    "name": "Test 1 modul",
    "description": "Bu test modul",
    "order": 0,
    "lessonCount": 0,
    "totalDuration": 0,
    "lessons": [],
    "course": {
      "id": 1,
      "name": "JavaScript Asoslari",
      "slug": "javascript-asoslari"
    },
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  },
  "message": "Module created successfully"
}
```

**Xatolar:**
- `400` - Validation xatosi (name bo'sh yoki qisqa)
- `403` - Faqat admin uchun
- `404` - Kurs topilmadi
- `401` - Autentifikatsiya talab qilinadi

---

## 3. Modulni yangilash (PUT)

**Endpoint:** `PUT /api/v1/modules/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

**Kiruvchi ma'lumot:**
```json
{
  "name": "Yangilangan modul nomi",
  "description": "Yangilangan tavsif"
}
```

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "courseId": 1,
    "name": "Yangilangan modul nomi",
    "description": "Yangilangan tavsif",
    "order": 0,
    "lessonCount": 5,
    "totalDuration": 3600,
    "lessons": [...],
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T11:00:00.000Z"
  },
  "message": "Module updated successfully"
}
```

**Xatolar:**
- `400` - Validation xatosi
- `403` - Faqat admin uchun
- `404` - Modul topilmadi

---

## 4. Modulni o'chirish (DELETE)

**Endpoint:** `DELETE /api/v1/modules/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": null,
  "message": "Module deleted successfully"
}
```

**MUHIM:** Module o'chirilganda, unga tegishli barcha lessonlar ham o'chiriladi (CASCADE).

**Xatolar:**
- `403` - Faqat admin uchun
- `404` - Modul topilmadi

---

## 5. Bitta modulni qayta tartiblash (PATCH)

**Endpoint:** `PATCH /api/v1/modules/:id/reorder`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

**Kiruvchi ma'lumot:**
```json
{
  "order": 2
}
```

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "courseId": 1,
    "name": "Test modul",
    "order": 2,
    ...
  },
  "message": "Module reordered successfully"
}
```

---

## 6. Ommaviy qayta tartiblash (POST)

**Endpoint:** `POST /api/v1/courses/:courseId/modules/reorder-bulk`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

**Kiruvchi ma'lumot:**
```json
[
  { "moduleId": 3, "order": 0 },
  { "moduleId": 1, "order": 1 },
  { "moduleId": 2, "order": 2 }
]
```

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "order": 0,
      ...
    },
    {
      "id": 1,
      "order": 1,
      ...
    }
  ],
  "message": "Modules reordered successfully"
}
```

---

## 7. Modulni ID bo'yicha olish (GET)

**Endpoint:** `GET /api/v1/modules/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Chiquvchi ma'lumot (Success 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "courseId": 1,
    "name": "Test modul",
    "description": "Tavsif",
    "order": 0,
    "lessonCount": 5,
    "totalDuration": 3600,
    "course": {
      "id": 1,
      "name": "JavaScript Asoslari",
      "slug": "javascript-asoslari"
    },
    "lessons": [...]
  },
  "message": "Module retrieved successfully"
}
```

---

## Frontend Integration

### Modul yaratish uchun kod namunasi:

```javascript
// Frontend (React/Vue/Angular)
const createModule = async (courseId, moduleData) => {
  try {
    const response = await fetch(`/api/v1/courses/${courseId}/modules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: moduleData.name,
        description: moduleData.description
        // course_id NI YUBORMASLIK KERAK - path parameterda bor!
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Modul yaratildi:', result.data);
      return result.data;
    } else {
      console.error('Xato:', result.message);
    }
  } catch (error) {
    console.error('Tarmoq xatosi:', error);
  }
};

// Qo'llash:
createModule(1, {
  name: 'Test 1 modul',
  description: 'Bu test modul'
});
```

### Modullarni olish:

```javascript
const getModules = async (courseId) => {
  try {
    const response = await fetch(`/api/v1/courses/${courseId}/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log('Modullar:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Xato:', error);
  }
};
```

---

## Database Schema

### `modules` table:
```sql
CREATE TABLE modules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id INT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  INDEX idx_course_order (course_id, order)
);
```

---

## Testing

### cURL namunalari:

**1. Modul yaratish:**
```bash
curl -X POST http://localhost:3000/api/v1/courses/1/modules \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test 1 modul",
    "description": "Bu test modul"
  }'
```

**2. Modullarni olish:**
```bash
curl -X GET http://localhost:3000/api/v1/courses/1/modules \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**3. Modulni yangilash:**
```bash
curl -X PUT http://localhost:3000/api/v1/modules/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yangilangan modul",
    "description": "Yangilangan tavsif"
  }'
```

**4. Modulni o'chirish:**
```bash
curl -X DELETE http://localhost:3000/api/v1/modules/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## MUHIM Eslatmalar:

1. ✅ **Barcha operatsiyalar uchun JWT token talab qilinadi**
2. ✅ **POST, PUT, DELETE operatsiyalari faqat admin uchun**
3. ✅ **Frontend `course_id` ni body da yubormasligi kerak** - bu path parameterdan olinadi
4. ✅ **Module o'chirilganda barcha lessons ham o'chiriladi** (CASCADE)
5. ✅ **order field optional** - agar berilmasa avtomatik belgilanadi
6. ✅ **Validation:** name 3-200 belgi bo'lishi kerak

---

## Error Handling

Barcha xatolar quyidagi formatda qaytariladi:

```json
{
  "success": false,
  "message": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized
- `403` - Forbidden (Admin only)
- `404` - Not Found
- `500` - Internal Server Error
