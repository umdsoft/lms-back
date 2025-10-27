const quizRepository = require('../repositories/quiz.repository');
const quizQuestionRepository = require('../repositories/quiz-question.repository');
const quizAttemptRepository = require('../repositories/quiz-attempt.repository');
const courseRepository = require('../repositories/course.repository');
const { AppError } = require('../middlewares/error.middleware');

class QuizService {
  /**
   * Create a new quiz with questions
   * @param {number} userId - User ID (teacher)
   * @param {object} quizData - Quiz data
   * @returns {Promise<object>} Created quiz with questions
   */
  async createQuiz(userId, quizData) {
    const { courseId, lessonId, title, description, durationMinutes, passingScore, maxAttempts, status, questions } = quizData;

    // Verify course exists and user is the teacher
    const course = await courseRepository.findByIdWithTeacher(courseId);
    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    if (course.teacher_id !== userId) {
      throw new AppError('You are not authorized to add quizzes to this course.', 403);
    }

    // Create quiz
    const quizId = await quizRepository.create({
      course_id: courseId,
      lesson_id: lessonId || null,
      title,
      description,
      duration_minutes: durationMinutes,
      passing_score: passingScore,
      max_attempts: maxAttempts || 3,
      status: status || 'DRAFT',
    });

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionsData = questions.map((q, index) => ({
        quiz_id: quizId,
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        points: q.points || 1,
        order: q.order || index + 1,
      }));

      await quizQuestionRepository.bulkCreate(questionsData);
    }

    return this.getQuizById(quizId, userId, 'teacher');
  }

  /**
   * Get all quizzes for a course
   * @param {number} courseId - Course ID
   * @param {string} userRole - User role
   * @returns {Promise<array>} Array of quizzes
   */
  async getQuizzesByCourse(courseId, userRole) {
    // Verify course exists
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    // Students and guests only see published quizzes
    const publishedOnly = userRole === 'student' || !userRole;

    return quizRepository.findByCourseId(courseId, publishedOnly);
  }

  /**
   * Get quiz by ID
   * @param {number} quizId - Quiz ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @param {boolean} includeAnswers - Include correct answers (for teachers)
   * @returns {Promise<object>} Quiz details with questions
   */
  async getQuizById(quizId, userId, userRole, includeAnswers = false) {
    const quiz = await quizRepository.findByIdWithCourse(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found.', 404);
    }

    // Check if user can access draft quizzes
    if (quiz.status === 'DRAFT' && userRole !== 'teacher' && userRole !== 'admin') {
      throw new AppError('This quiz is not published yet.', 403);
    }

    // If teacher, verify they own the course
    if (userRole === 'teacher' && quiz.teacher_id !== userId) {
      throw new AppError('You are not authorized to view this quiz.', 403);
    }

    // Get questions
    let questions = await quizQuestionRepository.findByQuizId(quizId);

    // Parse options JSON
    questions = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
    }));

    // Hide correct answers for students taking the quiz
    if (userRole === 'student' && !includeAnswers) {
      questions = questions.map(q => {
        const { correct_answer, explanation, ...rest } = q;
        return rest;
      });
    }

    quiz.questions = questions;

    // Get user's attempts if student
    if (userRole === 'student' && userId) {
      const attempts = await quizAttemptRepository.findByUserAndQuiz(userId, quizId);
      quiz.attempts = attempts;
      quiz.attempt_count = attempts.length;

      const bestAttempt = await quizAttemptRepository.getBestAttempt(userId, quizId);
      quiz.best_score = bestAttempt ? bestAttempt.score : null;
    }

    return quiz;
  }

  /**
   * Update quiz
   * @param {number} quizId - Quiz ID
   * @param {number} userId - User ID (teacher)
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated quiz
   */
  async updateQuiz(quizId, userId, updateData) {
    const quiz = await quizRepository.findByIdWithCourse(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found.', 404);
    }

    // Verify user is the teacher
    if (quiz.teacher_id !== userId) {
      throw new AppError('You are not authorized to update this quiz.', 403);
    }

    // Prepare update data
    const dataToUpdate = {};
    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.durationMinutes !== undefined) dataToUpdate.duration_minutes = updateData.durationMinutes;
    if (updateData.passingScore !== undefined) dataToUpdate.passing_score = updateData.passingScore;
    if (updateData.maxAttempts !== undefined) dataToUpdate.max_attempts = updateData.maxAttempts;
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;

    await quizRepository.update(quizId, dataToUpdate);

    // Update questions if provided
    if (updateData.questions) {
      // Delete existing questions
      await quizQuestionRepository.deleteByQuizId(quizId);

      // Create new questions
      const questionsData = updateData.questions.map((q, index) => ({
        quiz_id: quizId,
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        points: q.points || 1,
        order: q.order || index + 1,
      }));

      await quizQuestionRepository.bulkCreate(questionsData);
    }

    return this.getQuizById(quizId, userId, 'teacher');
  }

  /**
   * Delete quiz
   * @param {number} quizId - Quiz ID
   * @param {number} userId - User ID (teacher)
   * @returns {Promise<void>}
   */
  async deleteQuiz(quizId, userId) {
    const quiz = await quizRepository.findByIdWithCourse(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found.', 404);
    }

    // Verify user is the teacher
    if (quiz.teacher_id !== userId) {
      throw new AppError('You are not authorized to delete this quiz.', 403);
    }

    await quizRepository.softDelete(quizId);
  }

  /**
   * Start a quiz attempt
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<object>} Quiz attempt
   */
  async startQuizAttempt(userId, quizId) {
    const quiz = await quizRepository.findById(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found.', 404);
    }

    if (quiz.status !== 'PUBLISHED') {
      throw new AppError('This quiz is not available.', 403);
    }

    // Check if user has an active attempt
    const activeAttempt = await quizAttemptRepository.findActiveAttempt(userId, quizId);
    if (activeAttempt) {
      throw new AppError('You already have an active attempt for this quiz.', 400);
    }

    // Check attempt limit
    const attemptCount = await quizAttemptRepository.countAttempts(userId, quizId);
    if (attemptCount >= quiz.max_attempts) {
      throw new AppError('You have reached the maximum number of attempts for this quiz.', 400);
    }

    // Get total points
    const totalPoints = await quizQuestionRepository.getTotalPoints(quizId);

    // Create attempt
    const attemptId = await quizAttemptRepository.create({
      user_id: userId,
      quiz_id: quizId,
      attempt_number: attemptCount + 1,
      total_points: totalPoints,
      started_at: new Date(),
    });

    const attempt = await quizAttemptRepository.findById(attemptId);

    // Get quiz questions (without answers)
    const questions = await quizQuestionRepository.findByQuizId(quizId);
    const questionsWithoutAnswers = questions.map(q => {
      const { correct_answer, ...rest } = q;
      return {
        ...rest,
        options: q.options ? JSON.parse(q.options) : null,
      };
    });

    return {
      attempt,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        duration_minutes: quiz.duration_minutes,
        passing_score: quiz.passing_score,
      },
      questions: questionsWithoutAnswers,
    };
  }

  /**
   * Submit quiz attempt
   * @param {number} userId - User ID
   * @param {number} attemptId - Attempt ID
   * @param {array} answers - User's answers
   * @returns {Promise<object>} Graded attempt
   */
  async submitQuizAttempt(userId, attemptId, answers) {
    const attempt = await quizAttemptRepository.findById(attemptId);

    if (!attempt) {
      throw new AppError('Attempt not found.', 404);
    }

    if (attempt.user_id !== userId) {
      throw new AppError('You are not authorized to submit this attempt.', 403);
    }

    if (attempt.submitted_at) {
      throw new AppError('This attempt has already been submitted.', 400);
    }

    // Get quiz questions with correct answers
    const questions = await quizQuestionRepository.findByQuizId(attempt.quiz_id);

    // Grade the attempt
    let pointsEarned = 0;
    const gradedAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        return { ...answer, isCorrect: false, points: 0 };
      }

      const isCorrect = this.checkAnswer(answer.answer, question.correct_answer, question.question_type);
      const points = isCorrect ? question.points : 0;
      pointsEarned += points;

      return {
        ...answer,
        isCorrect,
        points,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
      };
    });

    const score = attempt.total_points > 0 ? (pointsEarned / attempt.total_points) * 100 : 0;

    const quiz = await quizRepository.findById(attempt.quiz_id);
    const isPassed = score >= quiz.passing_score;

    // Update attempt
    await quizAttemptRepository.update(attemptId, {
      score: score.toFixed(2),
      points_earned: pointsEarned,
      is_passed: isPassed,
      submitted_at: new Date(),
      answers: JSON.stringify(gradedAnswers),
    });

    return {
      attemptId,
      score: score.toFixed(2),
      pointsEarned,
      totalPoints: attempt.total_points,
      isPassed,
      passingScore: quiz.passing_score,
      answers: gradedAnswers,
    };
  }

  /**
   * Check if answer is correct
   * @param {string} userAnswer - User's answer
   * @param {string} correctAnswer - Correct answer
   * @param {string} questionType - Question type
   * @returns {boolean} Is correct
   */
  checkAnswer(userAnswer, correctAnswer, questionType) {
    if (questionType === 'TRUE_FALSE' || questionType === 'MULTIPLE_CHOICE') {
      return userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
    }

    if (questionType === 'SHORT_ANSWER') {
      return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    return false;
  }

  /**
   * Get user's quiz attempts
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<array>} Array of attempts
   */
  async getUserAttempts(userId, quizId) {
    const quiz = await quizRepository.findById(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found.', 404);
    }

    const attempts = await quizAttemptRepository.findByUserAndQuiz(userId, quizId);

    // Parse answers JSON
    return attempts.map(attempt => ({
      ...attempt,
      answers: attempt.answers ? JSON.parse(attempt.answers) : null,
    }));
  }
}

module.exports = new QuizService();
