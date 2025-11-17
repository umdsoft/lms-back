const express = require('express');
const directionController = require('../controllers/direction.controller');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  validateCreateDirection,
  validateUpdateDirection,
  validateDirectionStatus,
  validateAddSubjects,
  validateAssignTeachers,
} = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/directions/statistics:
 *   get:
 *     summary: Get direction statistics
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Direction statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', directionController.getStatistics);

/**
 * @swagger
 * /api/v1/directions:
 *   get:
 *     summary: Get all directions with filters
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: displayOrder
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Directions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', directionController.getAllDirections);

/**
 * @swagger
 * /api/v1/directions:
 *   post:
 *     summary: Create new direction
 *     tags: [Directions]
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
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               color:
 *                 type: string
 *                 enum: [blue, purple, orange, green, red, indigo, pink, yellow, teal, cyan]
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *               displayOrder:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Direction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       409:
 *         description: Direction with this name already exists
 */
router.post('/', authorize('admin'), validateCreateDirection, directionController.createDirection);

/**
 * @swagger
 * /api/v1/directions/{directionId}/courses:
 *   get:
 *     summary: Get all courses for a specific direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Direction not found
 */
router.get('/:directionId/courses', courseController.getCoursesByDirection);

/**
 * @swagger
 * /api/v1/directions/{id}:
 *   get:
 *     summary: Get direction by ID
 *     tags: [Directions]
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
 *         description: Direction retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Direction not found
 */
router.get('/:id', directionController.getDirectionById);

/**
 * @swagger
 * /api/v1/directions/{id}:
 *   put:
 *     summary: Update direction
 *     tags: [Directions]
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               color:
 *                 type: string
 *                 enum: [blue, purple, orange, green, red, indigo, pink, yellow, teal, cyan]
 *               icon:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Direction updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Direction not found
 *       409:
 *         description: Direction with this name already exists
 */
router.put('/:id', authorize('admin'), validateUpdateDirection, directionController.updateDirection);

/**
 * @swagger
 * /api/v1/directions/{id}/status:
 *   patch:
 *     summary: Update direction status
 *     tags: [Directions]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Direction status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Direction not found
 */
router.patch('/:id/status', authorize('admin'), validateDirectionStatus, directionController.updateDirectionStatus);

/**
 * @swagger
 * /api/v1/directions/{id}:
 *   delete:
 *     summary: Delete direction
 *     tags: [Directions]
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
 *         description: Direction deleted successfully
 *       400:
 *         description: Cannot delete direction with active courses
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Direction not found
 */
router.delete('/:id', authorize('admin'), directionController.deleteDirection);

/**
 * @swagger
 * /api/v1/directions/{id}/subjects:
 *   get:
 *     summary: Get subjects for a direction
 *     tags: [Directions]
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
 *         description: Subjects retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Direction not found
 */
router.get('/:id/subjects', directionController.getDirectionSubjects);

/**
 * @swagger
 * /api/v1/directions/{id}/subjects:
 *   post:
 *     summary: Add subjects to direction
 *     tags: [Directions]
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
 *               - subjects
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mexanika", "Optika", "Elektr"]
 *     responses:
 *       201:
 *         description: Subjects added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Direction not found
 *       409:
 *         description: Subjects already exist
 */
router.post('/:id/subjects', authorize('admin'), validateAddSubjects, directionController.addSubjects);

/**
 * @swagger
 * /api/v1/directions/{id}/subjects/{subjectId}:
 *   delete:
 *     summary: Remove subject from direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subject removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Subject or direction not found
 */
router.delete('/:id/subjects/:subjectId', authorize('admin'), directionController.removeSubject);

/**
 * @swagger
 * /api/v1/directions/{id}/teachers:
 *   get:
 *     summary: Get teachers for a direction
 *     tags: [Directions]
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
 *         description: Teachers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Direction not found
 */
router.get('/:id/teachers', directionController.getDirectionTeachers);

/**
 * @swagger
 * /api/v1/directions/{id}/teachers:
 *   post:
 *     summary: Assign teachers to direction
 *     tags: [Directions]
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
 *               - teacherIds
 *             properties:
 *               teacherIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Teachers assigned successfully
 *       400:
 *         description: Validation error or users are not teachers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Direction or users not found
 *       409:
 *         description: Teachers already assigned
 */
router.post('/:id/teachers', authorize('admin'), validateAssignTeachers, directionController.assignTeachers);

/**
 * @swagger
 * /api/v1/directions/{id}/teachers/{teacherId}:
 *   delete:
 *     summary: Remove teacher from direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Teacher or direction not found
 */
router.delete('/:id/teachers/:teacherId', authorize('admin'), directionController.removeTeacher);

module.exports = router;
