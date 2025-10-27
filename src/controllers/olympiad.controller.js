const olympiadService = require('../services/olympiad.service');

class OlympiadController {
  async createOlympiad(req, res, next) {
    try {
      const olympiadData = req.body;

      const olympiad = await olympiadService.createOlympiad(olympiadData);

      res.status(201).json({
        success: true,
        message: 'Olympiad created successfully',
        data: { olympiad },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllOlympiads(req, res, next) {
    try {
      const filters = {
        subject: req.query.subject,
        level: req.query.level,
        status: req.query.status,
        upcoming: req.query.upcoming === 'true',
      };

      const olympiads = await olympiadService.getAllOlympiads(filters);

      res.status(200).json({
        success: true,
        data: { olympiads },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOlympiadById(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);
      const userId = req.user ? req.user.id : null;

      const olympiad = await olympiadService.getOlympiadById(olympiadId, userId);

      res.status(200).json({
        success: true,
        data: { olympiad },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOlympiad(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);
      const updateData = req.body;

      const olympiad = await olympiadService.updateOlympiad(olympiadId, updateData);

      res.status(200).json({
        success: true,
        message: 'Olympiad updated successfully',
        data: { olympiad },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteOlympiad(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);

      await olympiadService.deleteOlympiad(olympiadId);

      res.status(200).json({
        success: true,
        message: 'Olympiad deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async registerForOlympiad(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);
      const userId = req.user.id;

      const registration = await olympiadService.registerForOlympiad(userId, olympiadId);

      res.status(201).json({
        success: true,
        message: 'Successfully registered for olympiad',
        data: { registration },
      });
    } catch (error) {
      next(error);
    }
  }

  async unregisterFromOlympiad(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);
      const userId = req.user.id;

      await olympiadService.unregisterFromOlympiad(userId, olympiadId);

      res.status(200).json({
        success: true,
        message: 'Successfully unregistered from olympiad',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRegistrations(req, res, next) {
    try {
      const userId = req.user.id;

      const registrations = await olympiadService.getUserRegistrations(userId);

      res.status(200).json({
        success: true,
        data: { registrations },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOlympiadParticipants(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);

      const participants = await olympiadService.getOlympiadParticipants(olympiadId);

      res.status(200).json({
        success: true,
        data: { participants },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOlympiadLeaderboard(req, res, next) {
    try {
      const olympiadId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit) || 100;

      const leaderboard = await olympiadService.getOlympiadLeaderboard(olympiadId, limit);

      res.status(200).json({
        success: true,
        data: { leaderboard },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateParticipantScore(req, res, next) {
    try {
      const registrationId = parseInt(req.params.registrationId);
      const { score } = req.body;

      const registration = await olympiadService.updateParticipantScore(registrationId, score);

      res.status(200).json({
        success: true,
        message: 'Participant score updated successfully',
        data: { registration },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingOlympiads(req, res, next) {
    try {
      const olympiads = await olympiadService.getUpcomingOlympiads();

      res.status(200).json({
        success: true,
        data: { olympiads },
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveOlympiads(req, res, next) {
    try {
      const olympiads = await olympiadService.getActiveOlympiads();

      res.status(200).json({
        success: true,
        data: { olympiads },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OlympiadController();
