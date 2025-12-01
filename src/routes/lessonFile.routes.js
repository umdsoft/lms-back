const express = require('express');
const lessonFileController = require('../controllers/lessonFile.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { upload, handleUploadError } = require('../middlewares/upload.middleware');
const { validateLessonId, validateIdParam } = require('../middlewares/validateParams.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/lesson-files/lessons/{lessonId}/files:
 *   get:
 *     summary: Dars fayllarini olish
 *     description: Berilgan dars uchun barcha fayllarni qaytaradi
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
 *     responses:
 *       200:
 *         description: Fayllar ro'yxati
 */
router.get('/lessons/:lessonId/files', validateLessonId, lessonFileController.getFilesByLesson);

/**
 * @swagger
 * /api/v1/lesson-files/lessons/{lessonId}/files:
 *   post:
 *     summary: Darsga fayl yuklash
 *     description: Darsga bir yoki bir nechta fayl yuklash (multipart/form-data)
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Fayllar yuklandi
 */
router.post(
  '/lessons/:lessonId/files',
  authorize('admin'),
  validateLessonId,
  upload.array('files', 10),
  handleUploadError,
  lessonFileController.uploadFiles
);

/**
 * @swagger
 * /api/v1/lesson-files/lessons/{lessonId}/reorder:
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
 *     responses:
 *       200:
 *         description: Tartib yangilandi
 */
router.put(
  '/lessons/:lessonId/reorder',
  authorize('admin'),
  validateLessonId,
  lessonFileController.reorderFiles
);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   get:
 *     summary: Faylni ID bo'yicha olish
 *     tags: [Lesson Files]
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
 *         description: Fayl ma'lumotlari
 */
router.get('/:id', lessonFileController.getFileById);

/**
 * @swagger
 * /api/v1/lesson-files/{id}/download:
 *   get:
 *     summary: Faylni yuklab olish
 *     tags: [Lesson Files]
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
 *         description: Fayl yuklab olinadi
 */
router.get('/:id/download', lessonFileController.downloadFile);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   put:
 *     summary: Fayl ma'lumotlarini yangilash
 *     tags: [Lesson Files]
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
 *               name:
 *                 type: string
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fayl yangilandi
 */
router.put('/:id', authorize('admin'), lessonFileController.updateFile);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   delete:
 *     summary: Faylni o'chirish
 *     tags: [Lesson Files]
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
 *         description: Fayl o'chirildi
 */
router.delete('/:id', authorize('admin'), lessonFileController.deleteFile);

module.exports = router;
