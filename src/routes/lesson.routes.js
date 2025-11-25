const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/lessons/modules/{moduleId}/lessons:
 *   get:
 *     summary: Modul bo'yicha barcha darslarni olish (alternative route)
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
 *     responses:
 *       200:
 *         description: Darslar ro'yxati
 */
router.get('/modules/:moduleId/lessons', lessonController.getLessonsByModule);

/**
 * @swagger
 * /api/v1/lessons/modules/{moduleId}/lessons:
 *   post:
 *     summary: Yangi dars yaratish (alternative route)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Dars yaratildi
 */
router.post('/modules/:moduleId/lessons', authorize('admin'), lessonController.createLesson);

/**
 * @swagger
 * /api/v1/lessons/modules/{moduleId}/lessons/reorder-bulk:
 *   post:
 *     summary: Darslarni ommaviy qayta tartiblash (alternative route)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Darslar qayta tartiblandi
 */
router.post('/modules/:moduleId/lessons/reorder-bulk', authorize('admin'), lessonController.bulkReorderLessons);

/**
 * @swagger
 * /api/v1/lessons/files/{fileId}:
 *   delete:
 *     summary: Dars faylini o'chirish
 *     description: Darsga biriktirilgan faylni o'chirish
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fayl ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Fayl muvaffaqiyatli o'chirildi
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
 *                   example: "File deleted successfully"
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Fayl topilmadi
 */
router.delete('/files/:fileId', authorize('admin'), lessonController.deleteLessonFile);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   get:
 *     summary: Darsni ID bo'yicha olish
 *     description: Darsning to'liq ma'lumotlarini olish (modul, fayllar, testlar bilan)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Dars ma'lumotlari
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
 *                     lesson:
 *                       $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       404:
 *         description: Dars topilmadi
 */
router.get('/:id', lessonController.getLessonById);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   put:
 *     summary: Darsni yangilash
 *     description: Mavjud darsning ma'lumotlarini yangilash
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
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
 *                 minLength: 3
 *                 maxLength: 200
 *                 description: Dars nomi
 *                 example: "Yangilangan dars nomi"
 *               description:
 *                 type: string
 *                 description: Dars tavsifi
 *                 example: "Yangilangan tavsif"
 *               video_url:
 *                 type: string
 *                 format: uri
 *                 description: Yangi video URL
 *                 example: "https://www.youtube.com/watch?v=abc123"
 *               duration:
 *                 type: integer
 *                 minimum: 0
 *                 description: Dars davomiyligi (soniyalarda)
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Dars muvaffaqiyatli yangilandi
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
 *                   example: "Lesson updated successfully"
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
 *         description: Dars topilmadi
 */
router.put('/:id', authorize('admin'), lessonController.updateLesson);

/**
 * @swagger
 * /api/v1/lessons/{id}/reorder:
 *   patch:
 *     summary: Darsni qayta tartiblash
 *     description: Darsning tartib raqamini o'zgartirish
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order
 *             properties:
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 description: Yangi tartib raqami
 *                 example: 2
 *     responses:
 *       200:
 *         description: Dars muvaffaqiyatli qayta tartiblandi
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
 *                   example: "Lesson reordered successfully"
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
 *         description: Dars topilmadi
 */
router.patch('/:id/reorder', authorize('admin'), lessonController.reorderLesson);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   delete:
 *     summary: Darsni o'chirish
 *     description: Darsni butunlay o'chirish (barcha fayllar va testlar ham o'chiriladi)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Dars muvaffaqiyatli o'chirildi
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
 *                   example: "Lesson deleted successfully"
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Dars topilmadi
 */
router.delete('/:id', authorize('admin'), lessonController.deleteLesson);

/**
 * @swagger
 * /api/v1/lessons/{id}/files:
 *   get:
 *     summary: Dars fayllarini olish
 *     description: Darsga biriktirilgan barcha fayllarni olish
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Fayllar ro'yxati
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
 *                     files:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LessonFile'
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       404:
 *         description: Dars topilmadi
 */
router.get('/:id/files', lessonController.getLessonFiles);

/**
 * @swagger
 * /api/v1/lessons/{id}/files:
 *   post:
 *     summary: Darsga fayl qo'shish
 *     description: Darsga yangi fayl biriktirish (PDF, DOCX, va boshqalar)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 description: Fayl nomi
 *                 example: "JavaScript_cheat_sheet.pdf"
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Fayl URL manzili
 *                 example: "https://example.com/files/js_cheatsheet.pdf"
 *               fileType:
 *                 type: string
 *                 description: Fayl turi
 *                 example: "pdf"
 *               fileSize:
 *                 type: integer
 *                 description: Fayl hajmi (baytlarda)
 *                 example: 1024000
 *     responses:
 *       201:
 *         description: Fayl muvaffaqiyatli qo'shildi
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
 *                   example: "File added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     file:
 *                       $ref: '#/components/schemas/LessonFile'
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Dars topilmadi
 */
router.post('/:id/files', authorize('admin'), lessonController.addLessonFile);

module.exports = router;
