# LMS Platform Backend

Zamonaviy Learning Management System (LMS) platformasi uchun Backend API - JWT authentication bilan.

## Texnologiyalar

- **Node.js** + **Express** - Backend framework
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication (Access & Refresh tokens)
- **Swagger** - API Documentation
- **Jest** + **Supertest** - Testing
- **Winston** - Logging
- **Helmet** - Security
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - API protection

## Asosiy Xususiyatlar

### JWT Authentication

- **Access Token** - 1 kun muddatli
- **Refresh Token** - 2 kun muddatli
- Token refresh mexanizmi
- Logout (single device)
- Logout all (all devices)
- `/me` endpoint - current user ma'lumotlari

### Security

- Password hashing (bcrypt)
- JWT token validation
- Middleware-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Helmet security headers
- Input validation

### API Documentation

- Swagger/OpenAPI documentation
- Interactive API explorer
- Available at `/api-docs`

## O'rnatish

### 1. Repository'ni clone qiling

```bash
git clone <repository-url>
cd lms-back
```

### 2. Dependencies o'rnating

```bash
npm install
```

### 3. Environment variables sozlang

`.env` fayl yarating (`.env.example` dan nusxa oling):

```bash
cp .env.example .env
```

### 4. MongoDB'ni ishga tushiring

```bash
# MongoDB local'da o'rnatilgan bo'lsa:
mongod

# Yoki Docker bilan:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Serverni ishga tushiring

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/v1/auth/register` | Yangi foydalanuvchi ro'yxatdan o'tkazish | No |
| POST | `/api/v1/auth/login` | Tizimga kirish | No |
| POST | `/api/v1/auth/refresh` | Access token yangilash | No |
| POST | `/api/v1/auth/logout` | Tizimdan chiqish (bir qurilma) | No |
| POST | `/api/v1/auth/logout-all` | Barcha qurilmalardan chiqish | Yes |
| GET | `/api/v1/auth/me` | Joriy foydalanuvchi ma'lumotlari | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server holatini tekshirish |
| GET | `/` | API ma'lumotlari |
| GET | `/api-docs` | Swagger dokumentatsiyasi |

## API Ishlatish Misollari

### 1. Ro'yxatdan o'tish

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

### 2. Tizimga kirish

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Joriy foydalanuvchi ma'lumotlari

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Token yangilash

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Scripts

```bash
npm run dev         # Development mode
npm run build       # Production build
npm start           # Production mode
npm test            # Run tests
npm run test:watch  # Watch mode
npm run lint        # Lint code
npm run lint:fix    # Fix lint errors
```

## User Roles

- **student** - Oddiy o'quvchi (default)
- **teacher** - O'qituvchi
- **admin** - Administrator

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Keyingi Qadamlar

Loyihaning to'liq maqsadi va rejalarini [PROJECT_GOALS.md](PROJECT_GOALS.md) faylida ko'ring.

- Email verification
- Password reset
- Course management CRUD
- Enrollment system
- Assignment submission
- Progress tracking
- Olimpiada va contest sistema
- Payment integration

## License

MIT License

---

**API Documentation**: http://localhost:5000/api-docs

**Development**: `npm run dev`

**Test**: `npm test`
