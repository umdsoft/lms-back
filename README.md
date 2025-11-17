# LMS Platform - Backend API

> Zamonaviy Learning Management System platformasi uchun Professional Backend API

**O'zbekistonda eng yaxshi onlayn ta'lim platformasini yaratish!** 🚀

---

## 📋 Loyiha Haqida

Bu LMS (Learning Management System) platformasi **3 ta asosiy yo'nalishda** professional ta'lim berish uchun yaratilgan:

1. **Matematika** - testlar, olimpiadalar va progress tracking
2. **Ingiliz tili** - 4 ta ko'nikma (Speaking, Writing, Reading, Listening)
3. **Dasturlash** - algoritmlar, contestlar va real vazifalar

### Asosiy Xususiyatlar

- ✅ **Hierarchical Course System**: Direction → Course → Module → Lesson → Test
- ✅ **JWT Authentication**: Access va Refresh token tizimi
- ✅ **Role-Based Access Control (RBAC)**: Student, Teacher, Admin rollari
- ✅ **Olimpiada va Contest System**: Ballar to'plash, reyting
- ✅ **Progress Tracking**: O'quvchi progressini kuzatish
- ✅ **API Documentation**: Swagger/OpenAPI
- ✅ **Security**: Helmet, CORS, Rate Limiting, Input Validation
- ✅ **Testing**: Jest + Supertest
- ✅ **Logging**: Winston logger

---

## 🛠 Tech Stack

| Kategoriya | Texnologiya | Versiya |
|------------|-------------|---------|
| **Runtime** | Node.js | >= 14.x |
| **Framework** | Express.js | 4.18.2 |
| **Language** | JavaScript | ES6+ |
| **Database** | MySQL | >= 8.0 |
| **ORM** | Sequelize | 6.35.2 |
| **Migrations** | Knex.js | 3.1.0 |
| **Authentication** | JWT | 9.0.2 |
| **Validation** | Joi | 17.11.0 |
| **Security** | Helmet | 7.1.0 |
| **Rate Limiting** | express-rate-limit | 7.1.5 |
| **Password Hashing** | bcryptjs | 2.4.3 |
| **Logging** | Winston | 3.11.0 |
| **API Docs** | Swagger UI Express | 5.0.0 |
| **Testing** | Jest + Supertest | 29.7.0 |

---

## 📦 Prerequisites

Loyihani ishga tushirishdan oldin quyidagilar o'rnatilgan bo'lishi kerak:

- **Node.js** >= 14.x ([Download](https://nodejs.org/))
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** yoki **yarn** (Node.js bilan birga keladi)
- **Git** (optional, versiya boshqarish uchun)

---

## 🚀 Installation & Setup

### 1. Repository'ni Clone Qiling

```bash
git clone https://github.com/umdsoft/lms-back.git
cd lms-back
```

### 2. Dependencies O'rnating

```bash
npm install
```

Yoki yarn bilan:

```bash
yarn install
```

### 3. Environment Variables Sozlang

`.env.example` faylidan `.env` yarating:

```bash
cp .env.example .env
```

`.env` faylni o'zingizga moslab sozlang:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_platform
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-this
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=2d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 daqiqa (millisekundlarda)
RATE_LIMIT_MAX_REQUESTS=100      # 15 daqiqada maksimal 100 ta request
```

**⚠️ MUHIM:** Production muhitda `JWT_ACCESS_SECRET` va `JWT_REFRESH_SECRET` ni juda kuchli qiymatlar bilan almashtiring!

### 4. Database Setup

#### A. MySQL'da Database Yarating

**Option 1: MySQL CLI orqali**

```bash
# MySQL'ga kiring
mysql -u root -p

# Database yarating
CREATE DATABASE lms_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Database'ni tekshiring
SHOW DATABASES;

# MySQL'dan chiqing
exit;
```

**Option 2: Docker orqali MySQL**

```bash
docker run -d \
  --name mysql-lms \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=lms_platform \
  -p 3306:3306 \
  mysql:8.0

# Container'ni tekshirish
docker ps

# Container loglarini ko'rish
docker logs mysql-lms
```

#### B. Migratsiyalarni Ishga Tushiring

```bash
# Barcha migratsiyalarni ishga tushirish
npm run migrate:latest

# Yoki Knex CLI to'g'ridan-to'g'ri
npx knex migrate:latest
```

**Migratsiya holati:**

```bash
# Joriy migratsiya holatini ko'rish
npx knex migrate:status

# Migratsiyani bekor qilish (oxirgi migratsiya)
npm run migrate:rollback
```

#### C. Seeders (Boshlang'ich Ma'lumotlar)

```bash
# Barcha seeder'larni ishga tushirish
npm run seed:run

# Yoki Knex CLI
npx knex seed:run
```

**Seeder ma'lumotlari:**
- Demo admin foydalanuvchi
- Demo student foydalanuvchi
- Demo teacher foydalanuvchi

### 5. Serverni Ishga Tushiring

#### Development Mode (Auto-reload)

```bash
npm run dev
```

Server `http://localhost:5000` da ishga tushadi va fayl o'zgarishlarini avtomatik kuzatadi (nodemon).

#### Production Mode

```bash
npm start
```

### 6. API Dokumentatsiyasini Ochish

Browser'da quyidagi URL'ni oching:

```
http://localhost:5000/api-docs
```

Swagger UI interaktiv API dokumentatsiyasini ko'rasiz.

---

## 📁 Project Structure

```
lms-back/
├── src/                           # Asosiy manba kodlar
│   ├── __tests__/                 # Test fayllari
│   │   ├── setup.js               # Test sozlamalari
│   │   ├── auth.test.js           # Autentifikatsiya testlari
│   │   ├── user.test.js           # Foydalanuvchi testlari
│   │   └── direction.test.js      # Yo'nalish testlari
│   ├── config/                    # Konfiguratsiya fayllari
│   │   ├── constants.js           # Global konstantalar
│   │   ├── database.js            # Sequelize DB config
│   │   ├── logger.js              # Winston logger config
│   │   ├── session.js             # Session config
│   │   └── swagger.js             # Swagger/OpenAPI config
│   ├── constants/                 # Konstantalar
│   │   ├── permissions.js         # RBAC ruxsatnomalari
│   │   ├── roles.js               # Foydalanuvchi rollari
│   │   └── status.js              # Status enum'lari (12+ enum)
│   ├── controllers/               # Route controller'lar
│   │   ├── auth.controller.js     # Autentifikatsiya
│   │   ├── user.controller.js     # Foydalanuvchi boshqaruvi
│   │   ├── direction.controller.js # Yo'nalishlar
│   │   ├── course.controller.js   # Kurslar
│   │   ├── module.controller.js   # Modullar
│   │   ├── lesson.controller.js   # Darslar
│   │   ├── test.controller.js     # Testlar (Lesson uchun)
│   │   ├── quiz.controller.js     # Testlar (global)
│   │   ├── olympiad.controller.js # Olimpiadalar
│   │   └── profile.controller.js  # Profil
│   ├── database/                  # Database fayllari
│   │   ├── migrations/            # Knex migratsiyalar (17 ta)
│   │   │   ├── 20250101000001_create_users_table.js
│   │   │   ├── 20250101000002_create_courses_table.js
│   │   │   ├── ... (15 ta yana)
│   │   │   └── 20250101000017_add_user_status_fields.js
│   │   ├── seeds/                 # Seed fayllari
│   │   │   └── 001_initial_users.js
│   │   └── knex.js                # Knex instance
│   ├── middlewares/               # Express middleware'lar
│   │   ├── auth.middleware.js     # JWT autentifikatsiya
│   │   ├── rbac.middleware.js     # Role-based access control
│   │   ├── validation.middleware.js # Barcha validatorlar
│   │   ├── error.middleware.js    # Error handling
│   │   ├── requestLogger.middleware.js # Request logging
│   │   ├── rate-limit.middleware.js # Rate limiting
│   │   ├── csrf.middleware.js     # CSRF himoyasi
│   │   └── validate.js            # Validation wrapper
│   ├── models/                    # Sequelize models
│   │   ├── index.js               # Model assosiatsiyalari
│   │   ├── User.js                # Foydalanuvchi
│   │   ├── RefreshToken.js        # Refresh token
│   │   ├── Direction.js           # Yo'nalish
│   │   ├── DirectionSubject.js    # Yo'nalish fanlari
│   │   ├── DirectionTeacher.js    # Yo'nalish o'qituvchilari
│   │   ├── Course.js              # Kurs
│   │   ├── Module.js              # Modul
│   │   ├── Lesson.js              # Dars
│   │   ├── LessonFile.js          # Dars fayllari
│   │   └── Test.js                # Test
│   ├── repositories/              # Repository pattern (Data Access Layer)
│   │   ├── base.repository.js     # Base repository
│   │   ├── user.repository.js     # Foydalanuvchi repo
│   │   ├── course.repository.js   # Kurs repo
│   │   ├── lesson.repository.js   # Dars repo
│   │   ├── lesson-progress.repository.js # Dars jarayoni
│   │   ├── enrollment.repository.js # Enrollment repo
│   │   ├── quiz.repository.js     # Test repo
│   │   ├── quiz-attempt.repository.js # Test urinishlari
│   │   ├── quiz-question.repository.js # Test savollari
│   │   ├── olympiad.repository.js # Olimpiada repo
│   │   └── olympiad-registration.repository.js
│   ├── routes/                    # API routes
│   │   ├── index.js               # Asosiy router
│   │   ├── auth.routes.js         # Auth routes
│   │   ├── user.routes.js         # User routes
│   │   ├── direction.routes.js    # Direction routes
│   │   ├── course.routes.js       # Course routes
│   │   ├── module.routes.js       # Module routes
│   │   ├── lesson.routes.js       # Lesson routes
│   │   ├── test.routes.js         # Test routes
│   │   ├── quiz.routes.js         # Quiz routes
│   │   ├── olympiad.routes.js     # Olympiad routes
│   │   └── profile.routes.js      # Profile routes
│   ├── services/                  # Business logic qatlami
│   │   ├── auth.service.js        # Autentifikatsiya servisi
│   │   ├── user.service.js        # Foydalanuvchi servisi
│   │   ├── direction.service.js   # Yo'nalish servisi
│   │   ├── course.service.js      # Kurs servisi
│   │   ├── module.service.js      # Modul servisi
│   │   ├── lesson.service.js      # Dars servisi
│   │   ├── test.service.js        # Test servisi
│   │   ├── quiz.service.js        # Quiz servisi
│   │   └── olympiad.service.js    # Olimpiada servisi
│   ├── utils/                     # Utility funksiyalar
│   │   ├── jwt.js                 # JWT token utilities
│   │   ├── logger.js              # Winston logger
│   │   ├── response.util.js       # Standart response format
│   │   ├── pagination.util.js     # Pagination helper
│   │   ├── sanitizer.util.js      # Input sanitization
│   │   ├── encryption.util.js     # Ma'lumot shifrlash
│   │   ├── slugGenerator.js       # URL slug yaratish
│   │   ├── videoProcessor.js      # Video URL processor
│   │   ├── direction.util.js      # Direction utilities
│   │   └── token.util.js          # Token utilities
│   ├── validators/                # Joi validation sxemalari
│   │   ├── auth.validator.js      # Auth validation
│   │   ├── course.validator.js    # Course validation
│   │   ├── lesson.validator.js    # Lesson validation
│   │   ├── olympiad.validator.js  # Olympiad validation
│   │   └── quiz.validator.js      # Quiz validation
│   ├── app.js                     # Express app konfiguratsiyasi
│   └── server.js                  # Server entry point
├── migrations/                    # Eski migratsiya (1 ta)
│   └── 20251101055522-create-directions-tables.js
├── tests/                         # Test fayllari (bo'sh)
├── uploads/                       # Fayl yuklash katalogi
├── node_modules/                  # NPM dependencies
├── .env                           # Environment variables (git ignore)
├── .env.example                   # Environment variables namunasi
├── .eslintrc.js                   # ESLint konfiguratsiyasi
├── .prettierrc                    # Prettier konfiguratsiyasi
├── .gitignore                     # Git ignore
├── jest.config.js                 # Jest test konfiguratsiyasi
├── knexfile.js                    # Knex migratsiya konfiguratsiyasi
├── package.json                   # NPM dependencies va scripts
├── package-lock.json              # NPM lock file
├── PROJECT_GOALS.md               # Loyiha maqsadlari (O'zbek tilida)
└── README.md                      # Bu fayl
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### 1. Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Yangi foydalanuvchi ro'yxatdan o'tkazish | ❌ |
| POST | `/login` | Tizimga kirish (phone + password) | ❌ |
| POST | `/refresh` | Access token yangilash | ❌ |
| POST | `/logout` | Tizimdan chiqish (bitta qurilma) | ❌ |
| POST | `/logout-all` | Barcha qurilmalardan chiqish | ✅ |
| GET | `/me` | Joriy foydalanuvchi ma'lumotlari | ✅ |

### 2. User Management Routes (`/api/v1/users`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/statistics` | Foydalanuvchilar statistikasi | ✅ | Admin |
| GET | `/` | Barcha foydalanuvchilar (filters, pagination) | ✅ | Admin |
| POST | `/` | Yangi foydalanuvchi yaratish | ✅ | Admin |
| GET | `/:id` | Foydalanuvchi ID orqali | ✅ | All |
| PUT | `/:id` | Foydalanuvchini yangilash | ✅ | All |
| PATCH | `/:id/role` | Role o'zgartirish | ✅ | Admin |
| PATCH | `/:id/status` | Status o'zgartirish | ✅ | Admin |
| PATCH | `/:id/password` | Parol o'zgartirish | ✅ | Self |
| DELETE | `/:id` | Foydalanuvchini o'chirish | ✅ | Admin |

### 3. Direction Routes (`/api/v1/directions`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Barcha yo'nalishlar | ✅ | All |
| POST | `/` | Yangi yo'nalish yaratish | ✅ | Admin |
| GET | `/:id` | Yo'nalish ID orqali | ✅ | All |
| PUT | `/:id` | Yo'nalishni yangilash | ✅ | Admin |
| PATCH | `/:id/status` | Status o'zgartirish | ✅ | Admin |
| DELETE | `/:id` | Yo'nalishni o'chirish | ✅ | Admin |

### 4. Course Routes (`/api/v1/courses`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Barcha kurslar (filters) | ✅ | All |
| GET | `/directions/:directionId/courses` | Direction bo'yicha kurslar | ✅ | All |
| POST | `/` | Yangi kurs yaratish | ✅ | Admin |
| GET | `/:id` | Kurs ID orqali (full details) | ✅ | All |
| PUT | `/:id` | Kursni yangilash | ✅ | Admin |
| DELETE | `/:id` | Kursni o'chirish | ✅ | Admin |

### 5. Module Routes (`/api/v1/modules`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/courses/:courseId/modules` | Kurs modullari | ✅ | All |
| POST | `/courses/:courseId/modules` | Yangi modul yaratish | ✅ | Admin |
| GET | `/:id` | Modul ID orqali | ✅ | All |
| PUT | `/:id` | Modulni yangilash | ✅ | Admin |
| DELETE | `/:id` | Modulni o'chirish | ✅ | Admin |

### 6. Lesson Routes (`/api/v1/lessons`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/modules/:moduleId/lessons` | Modul darslari | ✅ | All |
| POST | `/modules/:moduleId/lessons` | Yangi dars yaratish | ✅ | Admin |
| GET | `/:id` | Dars ID orqali (video bilan) | ✅ | All |
| PUT | `/:id` | Darsni yangilash | ✅ | Admin |
| DELETE | `/:id` | Darsni o'chirish | ✅ | Admin |

### 7. Olympiad Routes (`/api/v1/olympiads`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Barcha olimpiadalar | ✅ | All |
| POST | `/` | Yangi olimpiada yaratish | ✅ | Admin |
| GET | `/:id` | Olimpiada ID orqali | ✅ | All |
| PUT | `/:id` | Olimpiadani yangilash | ✅ | Admin |
| DELETE | `/:id` | Olimpiadani o'chirish | ✅ | Admin |
| POST | `/:id/register` | Olimpiadaga ro'yxatdan o'tish | ✅ | Student |

### 8. Profile Routes (`/api/v1/profile`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Joriy foydalanuvchi profili | ✅ | All |
| PUT | `/` | Profilni yangilash | ✅ | All |
| PATCH | `/password` | Parolni o'zgartirish | ✅ | All |

### 9. Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | API ma'lumotlari | ❌ |
| GET | `/api/v1/health` | Server holati | ❌ |
| GET | `/api-docs` | Swagger UI | ❌ |

**To'liq API hujjatlari:** [docs/API.md](docs/API.md)

---

## 🗄 Database Schema

### Hierarchical Course System

```
Direction (Yo'nalish: Matematika, English, Programming)
    ↓ 1:N
Course (Kurs: Beginner, Elementary, Intermediate, etc.)
    ↓ 1:N
Module (Modul: Module 1, Module 2, ...)
    ↓ 1:N
Lesson (Dars: Video, Description, Files)
    ↓ 1:N
Test (Test: Questions, Answers)
```

### Asosiy Jadvallar (17 ta migratsiya)

1. **users** - Foydalanuvchilar (Student, Teacher, Admin)
2. **refresh_tokens** - JWT refresh tokenlar
3. **courses** - Kurslar
4. **enrollments** - Kursga yozilish
5. **lessons** - Darslar
6. **lesson_progress** - Dars jarayoni
7. **quizzes** - Testlar
8. **quiz_questions** - Test savollari
9. **quiz_attempts** - Test urinishlari
10. **assignments** - Topshiriqlar
11. **assignment_submissions** - Topshiriq javoblari
12. **olympiads** - Olimpiadalar
13. **olympiad_registrations** - Olimpiada ro'yxati
14. **notifications** - Bildirishnomalar
15. **sessions** - Sessiyalar
16. **audit_logs** - Audit loglar
17. **directions** - Yo'nalishlar (Sequelize model)

**To'liq database hujjatlari:** [docs/DATABASE.md](docs/DATABASE.md)

---

## 🔐 Authentication

### JWT Token Tizimi

**Access Token:**
- Muddati: 1 kun (JWT_ACCESS_EXPIRES_IN)
- Payload: `{ userId, email, phone, role }`
- Header'da yuboriladi: `Authorization: Bearer <access_token>`

**Refresh Token:**
- Muddati: 2 kun (JWT_REFRESH_EXPIRES_IN)
- Payload: `{ userId, email, phone, role }`
- Database'da saqlanadi (refresh_tokens jadvali)
- Token yangilash uchun ishlatiladi

### Authentication Flow

```
1. Register/Login → Access Token + Refresh Token qaytadi
2. Protected Endpoint → Access Token header'da yuboriladi
3. Access Token muddati tugasa → Refresh Token bilan yangilanadi
4. Logout → Refresh Token database'dan o'chiriladi
5. Logout All → Barcha Refresh Token'lar o'chiriladi
```

### User Roles

```javascript
ROLES = {
  STUDENT: 'STUDENT',    // O'quvchi
  TEACHER: 'TEACHER',    // O'qituvchi
  ADMIN: 'ADMIN'         // Administrator
}
```

---

## 📝 API Usage Examples

### 1. Ro'yxatdan O'tish

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "phone": "+998901234567",
    "password": "password123",
    "firstName": "Ali",
    "lastName": "Valiyev",
    "role": "STUDENT"
  }'
```

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
      "createdAt": "2025-01-16T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Tizimga Kirish

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "password123"
  }'
```

### 3. Protected Endpoint (Joriy Foydalanuvchi)

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Token Yangilash

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 5. Barcha Yo'nalishlarni Olish

```bash
curl -X GET http://localhost:5000/api/v1/directions \
  -H "Authorization: Bearer <access_token>"
```

### 6. Kurs Yaratish (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_access_token>" \
  -d '{
    "directionId": 1,
    "title": "Beginner Mathematics",
    "description": "Basic mathematics course for beginners",
    "level": "BEGINNER",
    "status": "PUBLISHED"
  }'
```

---

## 🧪 Testing

### Test Environment

Test fayllari `src/__tests__/` katalogida joylashgan:
- `setup.js` - Test muhiti sozlamalari
- `auth.test.js` - Autentifikatsiya testlari
- `user.test.js` - Foydalanuvchi testlari
- `direction.test.js` - Yo'nalish testlari

### Running Tests

```bash
# Barcha testlarni ishga tushirish
npm test

# Coverage bilan
npm test -- --coverage

# Watch mode (avtomatik qayta ishga tushirish)
npm run test:watch

# Bitta test file
npm test -- auth.test.js
```

### Test Database

Test muhitida alohida database ishlatiladi:
- Database nomi: `lms_platform_test`
- Har bir test suit'dan keyin tozalanadi
- Migration va seed'lar avtomatik ishlaydi

**Test Coverage:**

```bash
npm test -- --coverage
```

Coverage hisoboti `coverage/` katalogida yaratiladi.

---

## 📊 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **start** | `npm start` | Production mode |
| **dev** | `npm run dev` | Development mode (nodemon) |
| **test** | `npm test` | Testlarni ishga tushirish |
| **test:watch** | `npm run test:watch` | Test watch mode |
| **migrate:latest** | `npm run migrate:latest` | Migratsiyalarni ishga tushirish |
| **migrate:rollback** | `npm run migrate:rollback` | Oxirgi migratsiyani bekor qilish |
| **migrate:make** | `npm run migrate:make <name>` | Yangi migratsiya yaratish |
| **seed:run** | `npm run seed:run` | Seeder'larni ishga tushirish |

---

## 🐛 Troubleshooting

### 1. Database Connection Error

**Xato:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Yechim:**
- MySQL server ishga tushganligini tekshiring:
  ```bash
  # Windows
  net start MySQL80

  # Linux/Mac
  sudo systemctl start mysql

  # Docker
  docker start mysql-lms
  ```
- `.env` faylda database ma'lumotlarini tekshiring

### 2. Migration Failed

**Xato:**
```
Migration failed with error: ER_ACCESS_DENIED_ERROR
```

**Yechim:**
- MySQL user va password to'g'riligini tekshiring
- User database yaratish huquqiga ega ekanligini tekshiring:
  ```sql
  GRANT ALL PRIVILEGES ON lms_platform.* TO 'your_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### 3. JWT Token Invalid

**Xato:**
```
{"success": false, "message": "Invalid token"}
```

**Yechim:**
- Access token muddati tugagan bo'lsa, refresh token bilan yangilang
- JWT_ACCESS_SECRET `.env` faylda to'g'ri sozlanganligini tekshiring
- Token header'da to'g'ri formatda yuborilganligini tekshiring:
  ```
  Authorization: Bearer <token>
  ```

### 4. Port Already in Use

**Xato:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Yechim:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

Yoki `.env` faylda `PORT` ni o'zgartiring.

### 5. NPM Install Failed

**Yechim:**
```bash
# Cache tozalash
npm cache clean --force

# node_modules va package-lock.json o'chirish
rm -rf node_modules package-lock.json

# Qayta o'rnatish
npm install
```

---

## 🚀 Deployment

### Production Environment Variables

Production muhitda quyidagi o'zgaruvchilarni to'g'ri sozlang:

```env
NODE_ENV=production
PORT=5000

DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=lms_platform_production
DB_USER=your_db_user
DB_PASSWORD=your_strong_db_password

JWT_ACCESS_SECRET=your-very-strong-secret-min-32-chars-production
JWT_REFRESH_SECRET=your-very-strong-refresh-secret-min-32-chars-production

CORS_ORIGIN=https://your-frontend-domain.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Build

```bash
# Production muhitda
NODE_ENV=production npm start
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Dependencies o'rnatish
COPY package*.json ./
RUN npm ci --only=production

# Source code nusxalash
COPY . .

# Port ochish
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Server ishga tushirish
CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: lms-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - lms-network

  backend:
    build: .
    container_name: lms-backend
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${DB_NAME}
      DB_USER: root
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    networks:
      - lms-network

volumes:
  mysql_data:

networks:
  lms-network:
    driver: bridge
```

**Docker Commands:**

```bash
# Build va ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f backend

# To'xtatish
docker-compose down

# Database bilan birga to'xtatish
docker-compose down -v
```

---

## 📚 Qo'shimcha Hujjatlar

- **[PROJECT_GOALS.md](PROJECT_GOALS.md)** - Loyiha maqsadlari va viziyasi
- **[docs/API.md](docs/API.md)** - To'liq API dokumentatsiyasi
- **[docs/DATABASE.md](docs/DATABASE.md)** - Database schema va ERD
- **[docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md)** - Security audit hisoboti

---

## 🤝 Contributing

Loyihaga hissa qo'shish uchun:

1. Repository'ni fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlaringizni commit qiling (`git commit -m 'Add some amazing feature'`)
4. Branch'ingizni push qiling (`git push origin feature/amazing-feature`)
5. Pull Request oching

**Code Style:**
- ESLint va Prettier konfiguratsiyasiga rioya qiling
- O'zbek tilida izohlar yozing
- Test yozing (Jest)

---

## 📄 License

MIT License - [LICENSE](LICENSE) faylida batafsil.

---

## 👥 Authors

- **LMS Platform Team** - Initial work
- **UMDSOFT** - [GitHub](https://github.com/umdsoft)

---

## 📞 Contact

Savollar va takliflar uchun:
- **Email**: support@lms-platform.uz
- **GitHub Issues**: [Issues](https://github.com/umdsoft/lms-back/issues)

---

**🚀 O'zbekistonda eng yaxshi onlayn ta'lim platformasini yaratamiz!**

**API Docs**: http://localhost:5000/api-docs
**Version**: 1.0.0
**Last Updated**: 2025-01-16
