const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'LMS Platform API',
    version: '1.0.0',
    description: `
# LMS Platform Backend API

Zamonaviy Learning Management System platformasi uchun RESTful API (JavaScript + MySQL).

## Asosiy Xususiyatlar

- **JWT Authentication** - Access va Refresh token'lar bilan
- **MySQL Database** - Sequelize ORM
- **3 ta asosiy yo'nalish**: Matematika, Ingiliz tili, Dasturlash
- **Obuna tizimi** - Oylik/yillik obunalar
- **Olimpiadalar** va contest'lar
- **O'qituvchilar bilan onlayn darslar** (marketplace)
- **AI-powered progress tracking**

## Authentication

Barcha himoyalangan (protected) API endpoint'lar JWT token talab qiladi.

### Token Olish

1. \`POST /api/v1/auth/register\` - Ro'yxatdan o'tish
2. \`POST /api/v1/auth/login\` - Tizimga kirish

Ikkala endpoint ham \`accessToken\` va \`refreshToken\` qaytaradi.

### Token Ishlatish

Access token'ni har bir so'rovda \`Authorization\` header'ida yuboring:

\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`

### Token Yangilash

Access token muddati tugaganida (\`401 Unauthorized\`), refresh token yordamida yangi tokenlar oling:

\`POST /api/v1/auth/refresh\`

## Token Muddatlari

- **Access Token**: 1 kun
- **Refresh Token**: 2 kun

## Error Responses

API xatoliklarni quyidagi formatda qaytaradi:

\`\`\`json
{
  "success": false,
  "message": "Error message"
}
\`\`\`
    `,
    contact: {
      name: 'API Support',
      email: 'support@lms-platform.uz',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://api.lms-platform.uz',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Foydalanuvchi autentifikatsiyasi (register, login, logout, token refresh)',
    },
    {
      name: 'Users',
      description: 'User management CRUD operatsiyalari (admin only)',
    },
    {
      name: 'Directions',
      description: 'Yo\'nalishlar (Programming, Mathematics, English, etc.) CRUD operatsiyalari',
    },
    {
      name: 'Courses',
      description: 'Kurslar CRUD operatsiyalari - hierarchical structure: Course → Module → Lesson → Test',
    },
    {
      name: 'Modules',
      description: 'Kurs modullar CRUD operatsiyalari',
    },
    {
      name: 'Lessons',
      description: 'Darslar CRUD operatsiyalari',
    },
    {
      name: 'Tests',
      description: 'Testlar va quiz\'lar',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Direction: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Programming',
          },
          slug: {
            type: 'string',
            example: 'programming',
          },
          description: {
            type: 'string',
            example: 'Learn programming languages and software development',
          },
          color: {
            type: 'string',
            example: 'blue',
          },
          icon: {
            type: 'string',
            example: 'Code',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
          displayOrder: {
            type: 'integer',
            example: 1,
          },
        },
      },
      Course: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'JavaScript Asoslari',
          },
          slug: {
            type: 'string',
            example: 'javascript-asoslari',
          },
          directionId: {
            type: 'integer',
            example: 1,
          },
          level: {
            type: 'string',
            enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficiency'],
            example: 'beginner',
          },
          description: {
            type: 'string',
            example: 'JavaScript dasturlash tilini o\'rganish',
          },
          pricingType: {
            type: 'string',
            enum: ['subscription', 'individual'],
            example: 'subscription',
          },
          price: {
            type: 'number',
            example: 0,
          },
          teacherId: {
            type: 'integer',
            nullable: true,
            example: 2,
          },
          thumbnail: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/image.jpg',
          },
          status: {
            type: 'string',
            enum: ['draft', 'active', 'inactive'],
            example: 'active',
          },
          direction: {
            $ref: '#/components/schemas/Direction',
          },
          teacher: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'integer' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              avatar: { type: 'string', nullable: true },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-11-16T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-11-16T10:00:00.000Z',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
