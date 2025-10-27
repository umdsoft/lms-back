const express = require('express');
const olympiadController = require('../controllers/olympiad.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validation.middleware');
const olympiadValidator = require('../validators/olympiad.validator');

const router = express.Router();

// Public routes
router.get('/', olympiadController.getAllOlympiads);
router.get('/upcoming', olympiadController.getUpcomingOlympiads);
router.get('/active', olympiadController.getActiveOlympiads);
router.get('/:id', olympiadController.getOlympiadById);
router.get('/:id/leaderboard', olympiadController.getOlympiadLeaderboard);

// Student routes
router.post(
  '/:id/register',
  authenticate,
  authorize('student'),
  olympiadController.registerForOlympiad
);

router.delete(
  '/:id/unregister',
  authenticate,
  authorize('student'),
  olympiadController.unregisterFromOlympiad
);

router.get(
  '/my/registrations',
  authenticate,
  authorize('student'),
  olympiadController.getUserRegistrations
);

// Admin/Teacher routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(olympiadValidator.create),
  olympiadController.createOlympiad
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(olympiadValidator.update),
  olympiadController.updateOlympiad
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  olympiadController.deleteOlympiad
);

router.get(
  '/:id/participants',
  authenticate,
  authorize('admin', 'teacher'),
  olympiadController.getOlympiadParticipants
);

router.put(
  '/registrations/:registrationId/score',
  authenticate,
  authorize('admin'),
  validate(olympiadValidator.updateScore),
  olympiadController.updateParticipantScore
);

module.exports = router;
