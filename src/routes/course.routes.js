const express = require('express');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Barcha kurslarni olish (filter va pagination bilan)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Har sahifada nechta kurs
 *       - in: query
 *         name: directionId
 *         schema:
 *           type: integer
 *         description: Yo'nalish ID (filter)
 *         example: 1
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, elementary, intermediate, upper-intermediate, advanced, proficiency]
 *         description: Kurs darajasi (filter)
 *         example: beginner
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, inactive]
 *         description: Kurs holati (filter)
 *         example: active
 *       - in: query
 *         name: pricingType
 *         schema:
 *           type: string
 *           enum: [subscription, individual]
 *         description: Narx turi (filter)
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: integer
 *         description: O'qituvchi ID (filter)
 *     responses:
 *       200:
 *         description: Kurslar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *             example:
 *               success: true
 *               data:
 *                 courses:
 *                   - id: 1
 *                     name: "JavaScript Asoslari"
 *                     slug: "javascript-asoslari"
 *                     directionId: 1
 *                     level: "beginner"
 *                     description: "JavaScript dasturlash tilini o'rganish"
 *                     pricingType: "subscription"
 *                     price: 0
 *                     status: "active"
 *                     direction:
 *                       id: 1
 *                       name: "Programming"
 *                       slug: "programming"
 *                       color: "blue"
 *                       icon: "Code"
 *                     teacher:
 *                       id: 2
 *                       firstName: "Ali"
 *                       lastName: "Valiyev"
 *                       avatar: null
 *                 total: 25
 *                 totalPages: 3
 *                 currentPage: 1
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/v1/courses/directions/{directionId}/courses:
 *   get:
 *     summary: Yo'nalish bo'yicha kurslarni olish
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yo'nalish ID
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Yo'nalishga tegishli kurslar
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 courses:
 *                   - id: 1
 *                     name: "JavaScript Asoslari"
 *                     level: "beginner"
 *                     direction:
 *                       name: "Programming"
 *                 total: 5
 *       404:
 *         description: Yo'nalish topilmadi
 */
router.get('/directions/:directionId/courses', courseController.getCoursesByDirection);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Kurs detallari (to'liq ma'lumot va statistika)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kurs ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Kurs detallari
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "JavaScript Asoslari"
 *                 slug: "javascript-asoslari"
 *                 directionId: 1
 *                 level: "beginner"
 *                 description: "JavaScript dasturlash tilini o'rganish"
 *                 pricingType: "subscription"
 *                 price: 0
 *                 status: "active"
 *                 thumbnail: "https://example.com/image.jpg"
 *                 direction:
 *                   id: 1
 *                   name: "Programming"
 *                   slug: "programming"
 *                   color: "blue"
 *                   icon: "Code"
 *                 teacher:
 *                   id: 2
 *                   firstName: "Ali"
 *                   lastName: "Valiyev"
 *                   avatar: null
 *                   email: "ali@example.com"
 *                 modules:
 *                   - id: 1
 *                     name: "Kirish"
 *                     description: "JavaScript ga kirish"
 *                     order: 1
 *                     lessons:
 *                       - id: 1
 *                         name: "Birinchi dars"
 *                         duration: 600
 *                         order: 1
 *                 stats:
 *                   totalModules: 5
 *                   totalLessons: 25
 *                   totalDuration: 15000
 *                   totalDurationFormatted: "4h 10m"
 *                 createdAt: "2025-11-16T10:00:00.000Z"
 *                 updatedAt: "2025-11-16T10:00:00.000Z"
 *       404:
 *         description: Kurs topilmadi
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Yangi kurs yaratish (Admin faqat)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: "JavaScript Asoslari"
 *               directionId:
 *                 type: integer
 *                 description: Yo'nalish ID (optional - default Programming)
 *                 example: 1
 *               level:
 *                 type: string
 *                 enum: [beginner, elementary, intermediate, upper-intermediate, advanced, proficiency]
 *                 example: "beginner"
 *               description:
 *                 type: string
 *                 example: "JavaScript dasturlash tilini o'rganish"
 *               pricingType:
 *                 type: string
 *                 enum: [subscription, individual]
 *                 default: subscription
 *                 example: "subscription"
 *               price:
 *                 type: number
 *                 description: Narx (faqat individual uchun)
 *                 example: 0
 *               teacherId:
 *                 type: integer
 *                 description: O'qituvchi ID (optional)
 *                 example: 2
 *               thumbnail:
 *                 type: string
 *                 description: Rasm URL (optional)
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Kurs yaratildi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "JavaScript Asoslari"
 *                 slug: "javascript-asoslari"
 *                 directionId: 1
 *                 level: "beginner"
 *                 status: "draft"
 *       400:
 *         description: Validation xatosi
 *         content:
 *           application/json:
 *             examples:
 *               missingName:
 *                 value:
 *                   success: false
 *                   message: "Course name is required"
 *               missingLevel:
 *                 value:
 *                   success: false
 *                   message: "Course level is required"
 *               invalidLevel:
 *                 value:
 *                   success: false
 *                   message: "Invalid level. Must be one of: beginner, elementary, intermediate, upper-intermediate, advanced, proficiency"
 *       403:
 *         description: Faqat admin uchun
 *       404:
 *         description: Direction yoki Teacher topilmadi
 */
router.post('/', authorize('admin'), courseController.createCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   put:
 *     summary: Kursni yangilash (Admin faqat)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               directionId:
 *                 type: integer
 *               level:
 *                 type: string
 *               description:
 *                 type: string
 *               pricingType:
 *                 type: string
 *               price:
 *                 type: number
 *               teacherId:
 *                 type: integer
 *               thumbnail:
 *                 type: string
 *           example:
 *             name: "JavaScript Advanced"
 *             level: "advanced"
 *             description: "Yangilangan tavsif"
 *     responses:
 *       200:
 *         description: Kurs yangilandi
 *       403:
 *         description: Faqat admin uchun
 *       404:
 *         description: Kurs topilmadi
 */
router.put('/:id', authorize('admin'), courseController.updateCourse);

/**
 * @swagger
 * /api/v1/courses/{id}/status:
 *   patch:
 *     summary: Kurs holatini o'zgartirish (Admin faqat)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, active, inactive]
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Holat o'zgartirildi
 *       403:
 *         description: Faqat admin uchun
 *       404:
 *         description: Kurs topilmadi
 */
router.patch('/:id/status', authorize('admin'), courseController.updateCourseStatus);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Kursni o'chirish (Admin faqat)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Kurs o'chirildi
 *       403:
 *         description: Faqat admin uchun
 *       404:
 *         description: Kurs topilmadi
 */
router.delete('/:id', authorize('admin'), courseController.deleteCourse);

module.exports = router;
