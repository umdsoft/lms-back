const express = require('express');
const moduleController = require('../controllers/module.controller');
const lessonController = require('../controllers/lesson.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/modules/courses/:courseId/modules
 * @desc Get all modules for a course
 * @access Private
 */
router.get('/courses/:courseId/modules', moduleController.getModulesByCourse);

/**
 * @route POST /api/v1/modules/courses/:courseId/modules
 * @desc Create new module in a course
 * @access Private - Admin only
 */
router.post('/courses/:courseId/modules', authorize('admin'), moduleController.createModule);

/**
 * @route POST /api/v1/modules/courses/:courseId/modules/reorder-bulk
 * @desc Bulk reorder modules in a course
 * @access Private - Admin only
 */
router.post('/courses/:courseId/modules/reorder-bulk', authorize('admin'), moduleController.bulkReorderModules);

/**
 * @route GET /api/v1/modules/:id
 * @desc Get module by ID
 * @access Private
 */
router.get('/:id', moduleController.getModuleById);

/**
 * @route PUT /api/v1/modules/:id
 * @desc Update module
 * @access Private - Admin only
 */
router.put('/:id', authorize('admin'), moduleController.updateModule);

/**
 * @route PATCH /api/v1/modules/:id/reorder
 * @desc Reorder single module
 * @access Private - Admin only
 */
router.patch('/:id/reorder', authorize('admin'), moduleController.reorderModule);

/**
 * @route DELETE /api/v1/modules/:id
 * @desc Delete module
 * @access Private - Admin only
 */
router.delete('/:id', authorize('admin'), moduleController.deleteModule);

// ============================================
// NESTED LESSON ROUTES (RESTful approach)
// ============================================

/**
 * @swagger
 * /api/v1/modules/{moduleId}/lessons:
 *   get:
 *     summary: Modul bo'yicha barcha darslarni olish
 *     description: Berilgan modul ID bo'yicha barcha darslarni qaytaradi
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Modul ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Darslar ro'yxati
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
 *                     lessons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       404:
 *         description: Modul topilmadi
 */
router.get('/:moduleId/lessons', lessonController.getLessonsByModule);

/**
 * @swagger
 * /api/v1/modules/{moduleId}/lessons:
 *   post:
 *     summary: Yangi dars yaratish
 *     description: Modulga yangi dars qo'shish. Video URL ixtiyoriy.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Modul ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 description: Dars nomi
 *                 example: "JavaScript asoslari"
 *               description:
 *                 type: string
 *                 description: Dars tavsifi
 *                 example: "Bu darsda JavaScript tilining asosiy tushunchalari o'rganiladi"
 *               video_url:
 *                 type: string
 *                 format: uri
 *                 description: Video URL (YouTube yoki direct link)
 *                 example: "https://www.youtube.com/watch?v=DY2NjfOkKIw"
 *               duration:
 *                 type: integer
 *                 minimum: 0
 *                 description: Dars davomiyligi (soniyalarda)
 *                 example: 900
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 description: Tartib raqami (ixtiyoriy, avtomatik belgilanadi)
 *                 example: 0
 *     responses:
 *       201:
 *         description: Dars muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lesson created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     lesson:
 *                       $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Modul topilmadi
 */
router.post('/:moduleId/lessons', authorize('admin'), lessonController.createLesson);

/**
 * @swagger
 * /api/v1/modules/{moduleId}/lessons/reorder-bulk:
 *   post:
 *     summary: Darslarni ommaviy qayta tartiblash
 *     description: Modul ichidagi darslarning tartibini bir vaqtda o'zgartirish
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Modul ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - lessonId
 *                 - order
 *               properties:
 *                 lessonId:
 *                   type: integer
 *                   description: Dars ID
 *                   example: 1
 *                 order:
 *                   type: integer
 *                   minimum: 0
 *                   description: Yangi tartib raqami
 *                   example: 0
 *           example:
 *             - lessonId: 1
 *               order: 0
 *             - lessonId: 2
 *               order: 1
 *             - lessonId: 3
 *               order: 2
 *     responses:
 *       200:
 *         description: Darslar muvaffaqiyatli qayta tartiblandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lessons reordered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     lessons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Modul topilmadi
 */
router.post('/:moduleId/lessons/reorder-bulk', authorize('admin'), lessonController.bulkReorderLessons);

module.exports = router;
