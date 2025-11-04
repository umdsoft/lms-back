const moduleService = require('../services/module.service');
const ResponseUtil = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Module controller
 */
class ModuleController {
  /**
   * Get all modules by course ID
   * @route GET /api/courses/:courseId/modules
   */
  async getModulesByCourse(req, res, next) {
    try {
      const modules = await moduleService.getModulesByCourse(req.params.courseId);
      return ResponseUtil.success(
        res,
        modules,
        'Modules retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get module by ID
   * @route GET /api/modules/:id
   */
  async getModuleById(req, res, next) {
    try {
      const module = await moduleService.getModuleById(req.params.id);
      return ResponseUtil.success(res, module, 'Module retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new module
   * @route POST /api/courses/:courseId/modules
   */
  async createModule(req, res, next) {
    try {
      const module = await moduleService.createModule(
        req.params.courseId,
        req.body
      );
      return ResponseUtil.success(
        res,
        module,
        'Module created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a module
   * @route PUT /api/modules/:id
   */
  async updateModule(req, res, next) {
    try {
      const module = await moduleService.updateModule(req.params.id, req.body);
      return ResponseUtil.success(res, module, 'Module updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a module
   * @route DELETE /api/modules/:id
   */
  async deleteModule(req, res, next) {
    try {
      await moduleService.deleteModule(req.params.id);
      return ResponseUtil.success(res, null, 'Module deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder a single module
   * @route PATCH /api/modules/:id/reorder
   * @body { order: number }
   */
  async reorderModule(req, res, next) {
    try {
      const { order } = req.body;
      const module = await moduleService.reorderModule(req.params.id, order);
      return ResponseUtil.success(res, module, 'Module reordered successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk reorder modules
   * @route POST /api/courses/:courseId/modules/reorder-bulk
   * @body [ { moduleId: number, order: number } ]
   */
  async bulkReorderModules(req, res, next) {
    try {
      const modules = await moduleService.bulkReorderModules(
        req.params.courseId,
        req.body
      );
      return ResponseUtil.success(
        res,
        modules,
        'Modules reordered successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ModuleController();
