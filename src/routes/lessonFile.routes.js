const express = require('express');
const lessonFileController = require('../controllers/lessonFile.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   get:
 *     summary: Faylni ID bo'yicha olish
 *     description: Fayl ma'lumotlarini olish
 *     tags: [Lesson Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fayl ID
 *     responses:
 *       200:
 *         description: Fayl ma'lumotlari
 *       404:
 *         description: Fayl topilmadi
 */
router.get('/:id', lessonFileController.getFileById);

/**
 * @swagger
 * /api/v1/lesson-files/{id}/download:
 *   get:
 *     summary: Faylni yuklab olish
 *     description: Faylni yuklab olish (download). Har bir yuklashda download_count oshiriladi.
 *     tags: [Lesson Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fayl ID
 *     responses:
 *       200:
 *         description: Fayl yuklab olinadi
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Fayl topilmadi
 */
router.get('/:id/download', lessonFileController.downloadFile);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   put:
 *     summary: Fayl ma'lumotlarini yangilash
 *     description: Fayl nomi yoki tartibini yangilash
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
 *                 description: Yangi fayl nomi
 *               displayOrder:
 *                 type: integer
 *                 description: Yangi tartib
 *     responses:
 *       200:
 *         description: Fayl yangilandi
 *       404:
 *         description: Fayl topilmadi
 */
router.put('/:id', authorize('admin'), lessonFileController.updateFile);

/**
 * @swagger
 * /api/v1/lesson-files/{id}:
 *   delete:
 *     summary: Faylni o'chirish
 *     description: Faylni diskdan va bazadan o'chirish
 *     tags: [Lesson Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fayl ID
 *     responses:
 *       200:
 *         description: Fayl o'chirildi
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
 *                   example: "Fayl o'chirildi"
 *       404:
 *         description: Fayl topilmadi
 */
router.delete('/:id', authorize('admin'), lessonFileController.deleteFile);

module.exports = router;
