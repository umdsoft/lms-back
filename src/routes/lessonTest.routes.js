const express = require('express');
const lessonTestController = require('../controllers/lessonTest.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/lesson-tests/lessons/{lessonId}/tests:
 *   get:
 *     summary: Dars testlarini olish
 *     description: Berilgan dars uchun barcha test savollarini qaytaradi
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Qiyinchilik bo'yicha filtrlash
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         description: Faqat faol testlarni olish
 *     responses:
 *       200:
 *         description: Testlar ro'yxati
 */
router.get('/lessons/:lessonId/tests', lessonTestController.getTestsByLesson);

/**
 * @swagger
 * /api/v1/lesson-tests/lessons/{lessonId}/tests:
 *   post:
 *     summary: Yangi test yaratish
 *     description: Darsga yangi test savoli qo'shish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *               - correctOption
 *             properties:
 *               question:
 *                 type: string
 *                 description: Savol matni
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Javob variantlari
 *               correctOption:
 *                 type: integer
 *                 description: To'g'ri javob indeksi (0 dan boshlab)
 *               explanation:
 *                 type: string
 *                 description: Tushuntirish
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               points:
 *                 type: integer
 *               timeLimit:
 *                 type: integer
 *                 description: Vaqt chegarasi (soniyalarda)
 *     responses:
 *       201:
 *         description: Test yaratildi
 */
router.post(
  '/lessons/:lessonId/tests',
  authorize('admin'),
  lessonTestController.createTest
);

/**
 * @swagger
 * /api/v1/lesson-tests/lessons/{lessonId}/bulk:
 *   post:
 *     summary: Ko'plab testlarni yaratish
 *     description: Bir vaqtda bir nechta test savollarini yaratish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tests
 *             properties:
 *               tests:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - options
 *                     - correctOption
 *     responses:
 *       201:
 *         description: Testlar yaratildi
 */
router.post(
  '/lessons/:lessonId/bulk',
  authorize('admin'),
  lessonTestController.bulkCreateTests
);

/**
 * @swagger
 * /api/v1/lesson-tests/lessons/{lessonId}/reorder:
 *   put:
 *     summary: Testlar tartibini o'zgartirish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testIds
 *             properties:
 *               testIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Tartib yangilandi
 */
router.put(
  '/lessons/:lessonId/reorder',
  authorize('admin'),
  lessonTestController.reorderTests
);

/**
 * @swagger
 * /api/v1/lesson-tests/lessons/{lessonId}/results:
 *   get:
 *     summary: Foydalanuvchi natijalarini olish
 *     description: Joriy foydalanuvchining dars bo'yicha test natijalarini olish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Natijalar va statistika
 */
router.get('/lessons/:lessonId/results', lessonTestController.getLessonResults);

/**
 * @swagger
 * /api/v1/lesson-tests/{id}:
 *   get:
 *     summary: Testni ID bo'yicha olish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Test ma'lumotlari
 */
router.get('/:id', lessonTestController.getTestById);

/**
 * @swagger
 * /api/v1/lesson-tests/{id}:
 *   put:
 *     summary: Testni yangilash
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOption:
 *                 type: integer
 *               explanation:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               points:
 *                 type: integer
 *               timeLimit:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Test yangilandi
 */
router.put('/:id', authorize('admin'), lessonTestController.updateTest);

/**
 * @swagger
 * /api/v1/lesson-tests/{id}:
 *   delete:
 *     summary: Testni o'chirish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Test o'chirildi
 */
router.delete('/:id', authorize('admin'), lessonTestController.deleteTest);

/**
 * @swagger
 * /api/v1/lesson-tests/{id}/submit:
 *   post:
 *     summary: Test javobini yuborish
 *     description: Foydalanuvchi test savoliga javob beradi
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selectedOption
 *             properties:
 *               selectedOption:
 *                 type: integer
 *                 description: Tanlangan javob indeksi
 *               timeSpent:
 *                 type: integer
 *                 description: Sarflangan vaqt (soniyalarda)
 *     responses:
 *       200:
 *         description: Javob qabul qilindi
 */
router.post('/:id/submit', lessonTestController.submitAnswer);

/**
 * @swagger
 * /api/v1/lesson-tests/{id}/toggle-active:
 *   patch:
 *     summary: Test faolligini o'zgartirish
 *     tags: [Lesson Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status o'zgartirildi
 */
router.patch('/:id/toggle-active', authorize('admin'), lessonTestController.toggleActive);

module.exports = router;
