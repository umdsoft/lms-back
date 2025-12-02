const { Lesson, LessonFile } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { deleteFile, getFileInfo } = require('../middlewares/upload.middleware');
const path = require('path');
const logger = require('../utils/logger');

class LessonFileController {
  /**
   * Get all files for a lesson
   * GET /api/v1/lesson-files/lessons/:lessonId/files
   */
  async getFilesByLesson(req, res, next) {
    try {
      const { lessonId } = req.params;

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      const files = await LessonFile.findAll({
        where: { lessonId },
        order: [['displayOrder', 'ASC']],
      });

      res.status(200).json({
        success: true,
        data: files,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload files to a lesson
   * POST /api/v1/lesson-files/lessons/:lessonId/files
   * Supports multiple file upload
   */
  async uploadFiles(req, res, next) {
    try {
      const { lessonId } = req.params;

      // Debug: Log request info to understand what's being received
      logger.info('uploadFiles called', {
        lessonId,
        hasReqFiles: !!req.files,
        reqFilesType: req.files ? typeof req.files : 'undefined',
        reqFilesKeys: req.files ? Object.keys(req.files) : [],
        hasReqFile: !!req.file,
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length'],
      });

      // Handle both 'file' and 'files' field names from upload.fields()
      let files = [];
      if (req.files) {
        // upload.fields() returns object: { file: [...], files: [...] }
        if (req.files.file) {
          logger.info(`Found ${req.files.file.length} file(s) in 'file' field`);
          files = files.concat(req.files.file);
        }
        if (req.files.files) {
          logger.info(`Found ${req.files.files.length} file(s) in 'files' field`);
          files = files.concat(req.files.files);
        }
        // Fallback for upload.array() which returns array directly
        if (Array.isArray(req.files)) {
          logger.info(`Found ${req.files.length} file(s) from upload.array()`);
          files = req.files;
        }
      }
      // Fallback for upload.single()
      if (req.file) {
        logger.info('Found single file from upload.single()');
        files.push(req.file);
      }

      if (files.length === 0) {
        // Provide more detailed error message
        const contentType = req.headers['content-type'] || '';
        let errorDetails = 'Fayl tanlanmagan.';

        if (!contentType.includes('multipart/form-data')) {
          errorDetails += ` So'rov turi noto'g'ri: '${contentType}'. 'multipart/form-data' bo'lishi kerak.`;
        } else {
          errorDetails += " Field nomi 'file' yoki 'files' bo'lishi kerak.";
        }

        logger.warn('No files found in upload request', {
          contentType,
          contentLength: req.headers['content-length'],
          reqFilesKeys: req.files ? Object.keys(req.files) : [],
        });

        throw new AppError(errorDetails, 400);
      }

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        // Delete uploaded files if lesson not found
        for (const file of files) {
          await deleteFile(file.path);
        }
        throw new AppError('Dars topilmadi', 404);
      }

      // Get current max display order
      const lastFile = await LessonFile.findOne({
        where: { lessonId },
        order: [['displayOrder', 'DESC']],
      });
      let displayOrder = lastFile ? lastFile.displayOrder + 1 : 0;

      // Save files to database
      const savedFiles = [];
      for (const file of files) {
        const fileInfo = getFileInfo(file);

        const lessonFile = await LessonFile.create({
          lessonId: parseInt(lessonId),
          name: fileInfo.originalName,
          originalName: fileInfo.originalName,
          fileName: fileInfo.fileName,
          filePath: fileInfo.filePath,
          url: `/uploads/lessons/${fileInfo.fileName}`,
          fileType: fileInfo.fileType,
          fileExtension: fileInfo.fileExtension,
          fileSize: fileInfo.fileSize,
          displayOrder: displayOrder++,
        });

        savedFiles.push(lessonFile);
      }

      logger.info(`${savedFiles.length} files uploaded to lesson ${lessonId}`);

      res.status(201).json({
        success: true,
        message: `${savedFiles.length} ta fayl yuklandi`,
        data: { files: savedFiles },
      });
    } catch (error) {
      // Delete uploaded files on error
      if (req.files) {
        // Handle upload.fields() result (object with arrays)
        if (req.files.file) {
          for (const file of req.files.file) {
            await deleteFile(file.path);
          }
        }
        if (req.files.files) {
          for (const file of req.files.files) {
            await deleteFile(file.path);
          }
        }
        // Handle upload.array() result (direct array)
        if (Array.isArray(req.files)) {
          for (const file of req.files) {
            await deleteFile(file.path);
          }
        }
      }
      if (req.file) {
        await deleteFile(req.file.path);
      }
      next(error);
    }
  }

  /**
   * Get single file by ID
   * GET /api/v1/lesson-files/:id
   */
  async getFileById(req, res, next) {
    try {
      const { id } = req.params;

      const file = await LessonFile.findByPk(id, {
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'name', 'moduleId'],
          },
        ],
      });

      if (!file) {
        throw new AppError('Fayl topilmadi', 404);
      }

      res.status(200).json({
        success: true,
        data: { file },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a file
   * DELETE /api/v1/lesson-files/:id
   */
  async deleteFile(req, res, next) {
    try {
      const { id } = req.params;

      const file = await LessonFile.findByPk(id);
      if (!file) {
        throw new AppError('Fayl topilmadi', 404);
      }

      // Delete file from disk
      if (file.filePath) {
        await deleteFile(file.filePath);
      }

      // Delete from database
      await file.destroy();

      logger.info(`File deleted: ${file.name} (ID: ${id})`);

      res.status(200).json({
        success: true,
        message: "Fayl o'chirildi",
        data: { id: parseInt(id) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download a file
   * GET /api/v1/lesson-files/:id/download
   * Increments download count on each download
   */
  async downloadFile(req, res, next) {
    try {
      const { id } = req.params;

      const file = await LessonFile.findByPk(id);
      if (!file) {
        throw new AppError('Fayl topilmadi', 404);
      }

      // Increment download count
      await file.increment('downloadCount');
      logger.info(`File downloaded: ${file.name} (ID: ${id}), count: ${file.downloadCount + 1}`);

      if (!file.filePath) {
        // If no local file path, redirect to URL
        return res.redirect(file.url);
      }

      // Send file for download
      res.download(file.filePath, file.originalName || file.name, (err) => {
        if (err) {
          logger.error('File download error:', err);
          if (!res.headersSent) {
            next(new AppError('Faylni yuklashda xatolik', 500));
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder files in a lesson
   * PUT /api/v1/lesson-files/lessons/:lessonId/reorder
   */
  async reorderFiles(req, res, next) {
    try {
      const { lessonId } = req.params;
      const { fileIds } = req.body;

      if (!Array.isArray(fileIds)) {
        throw new AppError('fileIds massiv bo\'lishi kerak', 400);
      }

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Update display order for each file
      for (let i = 0; i < fileIds.length; i++) {
        await LessonFile.update(
          { displayOrder: i },
          {
            where: {
              id: fileIds[i],
              lessonId: parseInt(lessonId),
            },
          }
        );
      }

      // Get updated files
      const files = await LessonFile.findAll({
        where: { lessonId },
        order: [['displayOrder', 'ASC']],
      });

      res.status(200).json({
        success: true,
        message: 'Tartib yangilandi',
        data: { files },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update file metadata
   * PUT /api/v1/lesson-files/:id
   */
  async updateFile(req, res, next) {
    try {
      const { id } = req.params;
      const { name, displayOrder } = req.body;

      const file = await LessonFile.findByPk(id);
      if (!file) {
        throw new AppError('Fayl topilmadi', 404);
      }

      // Update allowed fields
      if (name !== undefined) {
        file.name = name;
      }
      if (displayOrder !== undefined) {
        file.displayOrder = displayOrder;
      }

      await file.save();

      res.status(200).json({
        success: true,
        message: 'Fayl yangilandi',
        data: { file },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonFileController();
