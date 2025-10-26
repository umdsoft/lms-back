# LMS Platform Backend

Zamonaviy Learning Management System (LMS) platformasi uchun Backend API - **JavaScript + MySQL** bilan.

## Texnologiyalar

- **Node.js** + **Express** - Backend framework
- **JavaScript (ES6+)** - Programming language
- **MySQL** + **Sequelize** - Database & ORM
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

### Database

- MySQL relational database
- Sequelize ORM
- Auto-sync in development mode
- Database migrations support
- Foreign key constraints
- Indexes for performance

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

`.env` faylni o'zingizga moslab sozlang.

### 4. MySQL'ni ishga tushiring

```bash
# MySQL local'da o'rnatilgan bo'lsa:
mysql -u root -p

# Database yaratish:
CREATE DATABASE lms_platform;

# Yoki Docker bilan:
docker run -d \
  --name mysql-lms \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=lms_platform \
  -p 3306:3306 \
  mysql:8.0
```

### 5. Serverni ishga tushiring

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server `http://localhost:5000` da ishga tushadi.

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
npm start           # Production mode
npm run dev         # Development mode (nodemon)
npm test            # Run tests
npm run test:watch  # Watch mode
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);
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

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests use in-memory SQLite database for speed.

## Project Structure

```
lms-back/
├── src/
│   ├── __tests__/          # Test fayllari
│   │   ├── setup.js
│   │   └── auth.test.js
│   ├── config/             # Konfiguratsiya
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/        # Route controller'lar
│   │   └── auth.controller.js
│   ├── middlewares/        # Express middleware'lar
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/             # Sequelize modellar
│   │   ├── index.js
│   │   ├── User.js
│   │   └── RefreshToken.js
│   ├── routes/             # API route'lar
│   │   ├── index.js
│   │   └── auth.routes.js
│   ├── services/           # Business logic
│   │   └── auth.service.js
│   ├── utils/              # Utility funksiyalar
│   │   ├── jwt.js
│   │   └── logger.js
│   ├── app.js              # Express app
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── .env.example            # Environment variables misol
├── .gitignore
├── package.json
├── jest.config.js
├── PROJECT_GOALS.md        # Loyiha maqsadi
└── README.md
```

## Deployment

### Production Build

```bash
NODE_ENV=production npm start
```

### Environment Variables (Production)

Production muhitda quyidagi o'zgaruvchilarni to'g'ri sozlang:

- `NODE_ENV=production`
- `DB_HOST` - MySQL server host
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_ACCESS_SECRET` - kuchli secret key
- `JWT_REFRESH_SECRET` - kuchli secret key
- `CORS_ORIGIN` - frontend URL

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
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
- Real-time notifications

## License

MIT License

---

**Tech Stack**: JavaScript + MySQL + Sequelize + Express

**API Documentation**: http://localhost:5000/api-docs

**Development**: `npm run dev`

**Test**: `npm test`
