const directionService = require('../services/direction.service');
const { AppError } = require('../middlewares/error.middleware');
const { normalizeDirectionPayload } = require('../utils/direction.util');

class DirectionController {
  /**
   * Get all directions with filters
   * GET /api/v1/directions
   * Authenticated users
   */
  async getAllDirections(req, res, next) {
    try {
      const { page, limit, search, status, sortBy, sortOrder } = req.query;

      const result = await directionService.getDirections({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get direction statistics
   * GET /api/v1/directions/statistics
   * Authenticated users
   */
  async getStatistics(req, res, next) {
    try {
      const statistics = await directionService.getStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single direction by ID
   * GET /api/v1/directions/:id
   * Authenticated users
   */
  async getDirectionById(req, res, next) {
    try {
      const { id } = req.params;

      const direction = await directionService.getDirectionById(id);

      res.status(200).json({
        success: true,
        data: { direction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new direction
   * POST /api/v1/directions
   * Admin only
   */
  async createDirection(req, res, next) {
    try {
      const directionData = normalizeDirectionPayload(req.body);
      const createdBy = req.user.email || req.user.phone;

      const direction = await directionService.createDirection(directionData, createdBy);

      res.status(201).json({
        success: true,
        message: 'Direction created successfully',
        data: { direction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update direction
   * PUT /api/v1/directions/:id
   * Admin only
   */
  async updateDirection(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = normalizeDirectionPayload(req.body);
      const updatedBy = req.user.email || req.user.phone;

      const direction = await directionService.updateDirection(id, updateData, updatedBy);

      res.status(200).json({
        success: true,
        message: 'Direction updated successfully',
        data: { direction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update direction status
   * PATCH /api/v1/directions/:id/status
   * Admin only
   */
  async updateDirectionStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = req.user.email || req.user.phone;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const direction = await directionService.updateDirectionStatus(id, status, updatedBy);

      res.status(200).json({
        success: true,
        message: 'Direction status updated successfully',
        data: { direction },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete direction
   * DELETE /api/v1/directions/:id
   * Admin only
   */
  async deleteDirection(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBy = req.user.email || req.user.phone;

      await directionService.deleteDirection(id, deletedBy);

      res.status(200).json({
        success: true,
        message: 'Direction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subjects for a direction
   * GET /api/v1/directions/:id/subjects
   * Authenticated users
   */
  async getDirectionSubjects(req, res, next) {
    try {
      const { id } = req.params;

      const subjects = await directionService.getDirectionSubjects(id);

      res.status(200).json({
        success: true,
        data: { subjects },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add subjects to direction
   * POST /api/v1/directions/:id/subjects
   * Admin only
   */
  async addSubjects(req, res, next) {
    try {
      const { id } = req.params;
      const { subjects } = req.body;
      const addedBy = req.user.email || req.user.phone;

      if (!subjects || !Array.isArray(subjects)) {
        throw new AppError('Subjects array is required', 400);
      }

      const newSubjects = await directionService.addSubjects(id, subjects, addedBy);

      res.status(201).json({
        success: true,
        message: 'Subjects added successfully',
        data: { subjects: newSubjects },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove subject from direction
   * DELETE /api/v1/directions/:id/subjects/:subjectId
   * Admin only
   */
  async removeSubject(req, res, next) {
    try {
      const { id, subjectId } = req.params;
      const removedBy = req.user.email || req.user.phone;

      await directionService.removeSubject(id, subjectId, removedBy);

      res.status(200).json({
        success: true,
        message: 'Subject removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teachers for a direction
   * GET /api/v1/directions/:id/teachers
   * Authenticated users
   */
  async getDirectionTeachers(req, res, next) {
    try {
      const { id } = req.params;

      const teachers = await directionService.getDirectionTeachers(id);

      res.status(200).json({
        success: true,
        data: { teachers },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign teachers to direction
   * POST /api/v1/directions/:id/teachers
   * Admin only
   */
  async assignTeachers(req, res, next) {
    try {
      const { id } = req.params;
      const { teacherIds } = req.body;
      const assignedBy = req.user.email || req.user.phone;

      if (!teacherIds || !Array.isArray(teacherIds)) {
        throw new AppError('Teacher IDs array is required', 400);
      }

      const teachers = await directionService.assignTeachers(id, teacherIds, assignedBy);

      res.status(201).json({
        success: true,
        message: 'Teachers assigned successfully',
        data: { teachers },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove teacher from direction
   * DELETE /api/v1/directions/:id/teachers/:teacherId
   * Admin only
   */
  async removeTeacher(req, res, next) {
    try {
      const { id, teacherId } = req.params;
      const removedBy = req.user.email || req.user.phone;

      await directionService.removeTeacher(id, teacherId, removedBy);

      res.status(200).json({
        success: true,
        message: 'Teacher removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DirectionController();
