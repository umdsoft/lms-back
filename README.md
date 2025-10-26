# LMS (Learning Management System) - Backend

**UMDSoft LMS Student Cabinet** - A comprehensive Learning Management System backend for managing mathematics and English language courses, built with Node.js, Express.js, and MySQL.

## Features

- **Authentication & Authorization**
  - Session-based authentication with secure cookies
  - CSRF protection for all state-changing operations
  - Role-Based Access Control (RBAC) - Student, Teacher, Admin
  - Password encryption with bcryptjs

- **Course Management**
  - Create, update, and manage courses
  - Course enrollment system
  - Progress tracking
  - Multi-level courses (Beginner, Intermediate, Advanced)
  - Support for Mathematics and English subjects

- **Learning Resources**
  - Lessons (Video, Text, Interactive, Quiz)
  - Quizzes with multiple attempts
  - Assignments with submissions and grading
  - Olympiads and competitions

- **User Management**
  - User profiles
  - Progress statistics
  - Notifications system
  - Multi-language support (Uzbek, Russian, English)

- **Security Features**
  - Helmet.js security headers
  - Rate limiting
  - Input validation and sanitization
  - Audit logging
  - SQL injection prevention

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+
- **Query Builder**: Knex.js
- **Authentication**: express-session + cookie-based
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint (Airbnb) + Prettier

## Project Structure

```
lms-backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── config/                   # Configuration files
│   ├── database/                 # Migrations and seeds
│   ├── controllers/              # Request handlers
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access layer
│   ├── middlewares/              # Express middlewares
│   ├── routes/                   # API routes
│   ├── validators/               # Request validation
│   ├── utils/                    # Utility functions
│   └── constants/                # Application constants
├── tests/                        # Test files
├── docs/                         # Documentation
├── uploads/                      # File uploads
└── logs/                         # Application logs
```

## Installation

### Prerequisites

- Node.js v18+ or v20+
- MySQL 8.0+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE lms_db;
   CREATE USER 'lms_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON lms_db.* TO 'lms_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Run migrations**
   ```bash
   npm run migrate:latest
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed:run
   ```

7. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `SESSION_SECRET` - Session secret key
- `FRONTEND_URL` - Frontend URL for CORS

## API Documentation

Once the server is running, access the API documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/api/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/csrf-token` - Get CSRF token

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/password` - Change password
- `GET /api/profile/enrollments` - Get user enrollments

## Database Schema

The system uses 15 database tables:
- `users` - User accounts
- `courses` - Course information
- `enrollments` - Course enrollments
- `lessons` - Course lessons
- `lesson_progress` - Lesson completion tracking
- `quizzes` - Quiz definitions
- `quiz_questions` - Quiz questions
- `quiz_attempts` - Quiz attempt records
- `assignments` - Assignment definitions
- `assignment_submissions` - Assignment submissions
- `olympiads` - Olympiad events
- `olympiad_registrations` - Olympiad registrations
- `notifications` - User notifications
- `sessions` - Session storage
- `audit_logs` - Audit trail

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm test -- --coverage
```

**Coverage Requirement**: 80%+ for all categories (branches, functions, lines, statements)

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Database Management

```bash
# Create new migration
npm run migrate:make migration_name

# Run migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new seed
npm run seed:make seed_name

# Run seeds
npm run seed:run
```

## Default Test Users

After running seeds, the following users are available:

| Email | Password | Role |
|-------|----------|------|
| admin@lms.com | Password123! | ADMIN |
| teacher@lms.com | Password123! | TEACHER |
| student@lms.com | Password123! | STUDENT |

## Security Best Practices

1. **Never commit sensitive data** - Keep `.env` file out of version control
2. **Use strong session secrets** - Generate random, long session secrets
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Keep dependencies updated** - Regularly run `npm audit` and update packages
5. **Review audit logs** - Monitor the `audit_logs` table for suspicious activity

## Architecture

The project follows:
- **Clean Architecture** principles
- **Repository Pattern** for data access
- **Service Layer Pattern** for business logic
- **SOLID Principles**
- **MVC (Model-View-Controller)** structure

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass (`npm test`)
4. Ensure linting passes (`npm run lint`)
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub or contact UMDSoft support.

---

**Built with ❤️ by UMDSoft**
