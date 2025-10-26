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
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
