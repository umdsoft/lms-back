const express = require('express');
const olympiadController = require('../controllers/olympiad.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { rbac } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate');
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
  rbac(['student']),
  olympiadController.registerForOlympiad
);

router.delete(
  '/:id/unregister',
  authenticate,
  rbac(['student']),
  olympiadController.unregisterFromOlympiad
);

router.get(
  '/my/registrations',
  authenticate,
  rbac(['student']),
  olympiadController.getUserRegistrations
);

// Admin/Teacher routes
router.post(
  '/',
  authenticate,
  rbac(['admin']),
  validate(olympiadValidator.create),
  olympiadController.createOlympiad
);

router.put(
  '/:id',
  authenticate,
  rbac(['admin']),
  validate(olympiadValidator.update),
  olympiadController.updateOlympiad
);

router.delete(
  '/:id',
  authenticate,
  rbac(['admin']),
  olympiadController.deleteOlympiad
);

router.get(
  '/:id/participants',
  authenticate,
  rbac(['admin', 'teacher']),
  olympiadController.getOlympiadParticipants
);

router.put(
  '/registrations/:registrationId/score',
  authenticate,
  rbac(['admin']),
  validate(olympiadValidator.updateScore),
  olympiadController.updateParticipantScore
);

module.exports = router;
