const olympiadRepository = require('../repositories/olympiad.repository');
const olympiadRegistrationRepository = require('../repositories/olympiad-registration.repository');
const { AppError } = require('../middlewares/error.middleware');

class OlympiadService {
  /**
   * Create a new olympiad
   * @param {object} olympiadData - Olympiad data
   * @returns {Promise<object>} Created olympiad
   */
  async createOlympiad(olympiadData) {
    const {
      title,
      description,
      subject,
      level,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      durationMinutes,
      status,
    } = olympiadData;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(registrationDeadline);

    if (deadline >= start) {
      throw new AppError('Registration deadline must be before start date.', 400);
    }

    if (end <= start) {
      throw new AppError('End date must be after start date.', 400);
    }

    const olympiadId = await olympiadRepository.create({
      title,
      description,
      subject,
      level,
      start_date: start,
      end_date: end,
      registration_deadline: deadline,
      max_participants: maxParticipants,
      duration_minutes: durationMinutes,
      status: status || 'UPCOMING',
    });

    return olympiadRepository.findById(olympiadId);
  }

  /**
   * Get all olympiads with filters
   * @param {object} filters - Filter options
   * @returns {Promise<array>} Array of olympiads
   */
  async getAllOlympiads(filters = {}) {
    return olympiadRepository.findAllWithParticipantCount();
  }

  /**
   * Get olympiad by ID
   * @param {number} olympiadId - Olympiad ID
   * @param {number} userId - User ID (optional)
   * @returns {Promise<object>} Olympiad details
   */
  async getOlympiadById(olympiadId, userId = null) {
    const olympiad = await olympiadRepository.findByIdWithParticipantCount(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    // If user is provided, check if they're registered
    if (userId) {
      const registration = await olympiadRegistrationRepository.findByUserAndOlympiad(userId, olympiadId);
      olympiad.user_registration = registration || null;
    }

    return olympiad;
  }

  /**
   * Update olympiad
   * @param {number} olympiadId - Olympiad ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated olympiad
   */
  async updateOlympiad(olympiadId, updateData) {
    const olympiad = await olympiadRepository.findById(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    const dataToUpdate = {};
    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.subject !== undefined) dataToUpdate.subject = updateData.subject;
    if (updateData.level !== undefined) dataToUpdate.level = updateData.level;
    if (updateData.startDate !== undefined) dataToUpdate.start_date = new Date(updateData.startDate);
    if (updateData.endDate !== undefined) dataToUpdate.end_date = new Date(updateData.endDate);
    if (updateData.registrationDeadline !== undefined) dataToUpdate.registration_deadline = new Date(updateData.registrationDeadline);
    if (updateData.maxParticipants !== undefined) dataToUpdate.max_participants = updateData.maxParticipants;
    if (updateData.durationMinutes !== undefined) dataToUpdate.duration_minutes = updateData.durationMinutes;
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;

    await olympiadRepository.update(olympiadId, dataToUpdate);

    return olympiadRepository.findById(olympiadId);
  }

  /**
   * Delete olympiad
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<void>}
   */
  async deleteOlympiad(olympiadId) {
    const olympiad = await olympiadRepository.findById(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    // Don't allow deletion if it has started
    if (olympiad.status === 'IN_PROGRESS' || olympiad.status === 'COMPLETED') {
      throw new AppError('Cannot delete an olympiad that has started or completed.', 400);
    }

    await olympiadRepository.delete(olympiadId);
  }

  /**
   * Register user for olympiad
   * @param {number} userId - User ID
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<object>} Registration
   */
  async registerForOlympiad(userId, olympiadId) {
    const olympiad = await olympiadRepository.findById(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    // Check if registration is open
    if (olympiad.status !== 'REGISTRATION_OPEN' && olympiad.status !== 'UPCOMING') {
      throw new AppError('Registration is not open for this olympiad.', 400);
    }

    // Check registration deadline
    const now = new Date();
    const deadline = new Date(olympiad.registration_deadline);
    if (now > deadline) {
      throw new AppError('Registration deadline has passed.', 400);
    }

    // Check if already registered
    const existingRegistration = await olympiadRegistrationRepository.findByUserAndOlympiad(userId, olympiadId);
    if (existingRegistration) {
      throw new AppError('You are already registered for this olympiad.', 400);
    }

    // Check max participants
    if (olympiad.max_participants) {
      const participantCount = await olympiadRegistrationRepository.countByOlympiad(olympiadId);
      if (participantCount >= olympiad.max_participants) {
        throw new AppError('Maximum participants limit reached.', 400);
      }
    }

    const registrationId = await olympiadRegistrationRepository.create({
      user_id: userId,
      olympiad_id: olympiadId,
      status: 'REGISTERED',
      registered_at: new Date(),
    });

    return olympiadRegistrationRepository.findById(registrationId);
  }

  /**
   * Unregister user from olympiad
   * @param {number} userId - User ID
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<void>}
   */
  async unregisterFromOlympiad(userId, olympiadId) {
    const registration = await olympiadRegistrationRepository.findByUserAndOlympiad(userId, olympiadId);

    if (!registration) {
      throw new AppError('You are not registered for this olympiad.', 404);
    }

    const olympiad = await olympiadRepository.findById(olympiadId);

    // Check if olympiad has started
    if (olympiad.status === 'IN_PROGRESS' || olympiad.status === 'COMPLETED') {
      throw new AppError('Cannot unregister from an olympiad that has started or completed.', 400);
    }

    await olympiadRegistrationRepository.delete(registration.id);
  }

  /**
   * Get user's olympiad registrations
   * @param {number} userId - User ID
   * @returns {Promise<array>} Array of registrations
   */
  async getUserRegistrations(userId) {
    return olympiadRegistrationRepository.findByUser(userId);
  }

  /**
   * Get olympiad participants (admin/teacher only)
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<array>} Array of participants
   */
  async getOlympiadParticipants(olympiadId) {
    const olympiad = await olympiadRepository.findById(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    return olympiadRegistrationRepository.findByOlympiad(olympiadId);
  }

  /**
   * Get olympiad leaderboard
   * @param {number} olympiadId - Olympiad ID
   * @param {number} limit - Limit results
   * @returns {Promise<array>} Leaderboard
   */
  async getOlympiadLeaderboard(olympiadId, limit = 100) {
    const olympiad = await olympiadRepository.findById(olympiadId);

    if (!olympiad) {
      throw new AppError('Olympiad not found.', 404);
    }

    return olympiadRegistrationRepository.getLeaderboard(olympiadId, limit);
  }

  /**
   * Update participant score (admin only)
   * @param {number} registrationId - Registration ID
   * @param {number} score - Score
   * @returns {Promise<object>} Updated registration
   */
  async updateParticipantScore(registrationId, score) {
    const registration = await olympiadRegistrationRepository.findById(registrationId);

    if (!registration) {
      throw new AppError('Registration not found.', 404);
    }

    await olympiadRegistrationRepository.updateScore(registrationId, score);

    return olympiadRegistrationRepository.findById(registrationId);
  }

  /**
   * Get upcoming olympiads
   * @returns {Promise<array>} Array of upcoming olympiads
   */
  async getUpcomingOlympiads() {
    return olympiadRepository.getUpcoming();
  }

  /**
   * Get active olympiads
   * @returns {Promise<array>} Array of active olympiads
   */
  async getActiveOlympiads() {
    return olympiadRepository.getActive();
  }
}

module.exports = new OlympiadService();
