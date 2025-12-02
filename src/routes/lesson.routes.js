const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const lessonFileController = require('../controllers/lessonFile.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { upload, handleUploadError, logUploadRequest } = require('../middlewares/upload.middleware');
const { validateLessonId } = require('../middlewares/validateParams.middleware');

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
 * /api/v1/lessons/{lessonId}/files:
 *   get:
 *     summary: Dars fayllarini olish
 *     description: Darsga biriktirilgan barcha fayllarni olish
 *     tags: [Lesson Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
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
router.get('/:lessonId/files', validateLessonId, lessonFileController.getFilesByLesson);

/**
 * @swagger
 * /api/v1/lessons/{lessonId}/files:
 *   post:
 *     summary: Darsga fayl yuklash
 *     description: |
 *       Darsga bir yoki bir nechta fayl yuklash (multipart/form-data). Max 50MB, 10 ta fayl.
 *       Ikkala field nomini qabul qiladi: 'file' (bitta fayl) yoki 'files' (ko'p fayl).
 *     tags: [Lesson Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dars ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Bitta fayl yuklash uchun (field nomi 'file')
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Ko'p fayl yuklash uchun (field nomi 'files')
 *     responses:
 *       201:
 *         description: Fayllar muvaffaqiyatli yuklandi
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
 *                   example: "3 ta fayl yuklandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LessonFile'
 *       400:
 *         description: Noto'g'ri so'rov (fayl turi yoki hajmi)
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 *       403:
 *         description: Ruxsat yo'q (faqat admin)
 *       404:
 *         description: Dars topilmadi
 */
router.post(
  '/:lessonId/files',
  authorize('admin'),
  validateLessonId,
  logUploadRequest,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'files', maxCount: 10 }
  ]),
  handleUploadError,
  lessonFileController.uploadFiles
);

/**
 * @swagger
 * /api/v1/lessons/{lessonId}/files/reorder:
 *   put:
 *     summary: Fayllar tartibini o'zgartirish
 *     description: Dars fayllarining tartibini o'zgartirish
 *     tags: [Lesson Files]
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
 *               - fileIds
 *             properties:
 *               fileIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Fayllar ID larini yangi tartibda
 *     responses:
 *       200:
 *         description: Tartib yangilandi
 */
router.put(
  '/:lessonId/files/reorder',
  authorize('admin'),
  validateLessonId,
  lessonFileController.reorderFiles
);

module.exports = router;
