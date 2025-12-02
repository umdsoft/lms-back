/**
 * EDULIFE Platform - Model Index
 * All models and associations
 */

// Core Models
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserSession = require('./UserSession');
const RefreshToken = require('./RefreshToken');
const OtpCode = require('./OtpCode');

// Content Models
const Direction = require('./Direction');
const Course = require('./Course');
const Module = require('./Module');
const Lesson = require('./Lesson');
const LessonResource = require('./LessonResource');
const VideoProcessingJob = require('./VideoProcessingJob');
const Tag = require('./Tag');
const CourseTag = require('./CourseTag');

// Questions & Tests Models
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');
const TestAttempt = require('./TestAttempt');
const TestAnswer = require('./TestAnswer');

// Progress & Learning Models
const Enrollment = require('./Enrollment');
const LessonProgress = require('./LessonProgress');
const VideoWatchLog = require('./VideoWatchLog');
const UserStreak = require('./UserStreak');
const Certificate = require('./Certificate');

// Teacher Models
const TeacherProfile = require('./TeacherProfile');
const TeacherBankAccount = require('./TeacherBankAccount');
const TeacherEarning = require('./TeacherEarning');
const TeacherPayout = require('./TeacherPayout');

// Subscription & Payment Models
const SubscriptionPlan = require('./SubscriptionPlan');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const PromoCode = require('./PromoCode');
const PromoCodeUsage = require('./PromoCodeUsage');

// Communication Models
const Conversation = require('./Conversation');
const Message = require('./Message');
const Notification = require('./Notification');
const Review = require('./Review');
const ReviewVote = require('./ReviewVote');

// System Models
const AuditLog = require('./AuditLog');
const Setting = require('./Setting');
const TokenBlacklist = require('./TokenBlacklist');
const SubscriptionPoolStats = require('./SubscriptionPoolStats');

// ============================================
// ASSOCIATIONS
// ============================================

// --- User Associations ---
User.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' });
UserSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

UserSession.hasMany(RefreshToken, { foreignKey: 'sessionId', as: 'tokens', onDelete: 'SET NULL' });
RefreshToken.belongsTo(UserSession, { foreignKey: 'sessionId', as: 'session' });

User.hasMany(OtpCode, { foreignKey: 'userId', as: 'otpCodes', onDelete: 'CASCADE' });
OtpCode.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(TeacherProfile, { foreignKey: 'userId', as: 'teacherProfile', onDelete: 'CASCADE' });
TeacherProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(UserStreak, { foreignKey: 'userId', as: 'streak', onDelete: 'CASCADE' });
UserStreak.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Role & Permission Associations ---
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', otherKey: 'roleId', as: 'roles' });

// --- Direction & Course Associations ---
Direction.hasMany(Course, { foreignKey: 'directionId', as: 'courses' });
Course.belongsTo(Direction, { foreignKey: 'directionId', as: 'direction' });

User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Course.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

// --- Course & Module & Lesson Associations ---
Course.hasMany(Module, { foreignKey: 'courseId', as: 'modules', onDelete: 'CASCADE' });
Module.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Module.hasMany(Lesson, { foreignKey: 'moduleId', as: 'lessons', onDelete: 'CASCADE' });
Lesson.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Lesson.hasMany(LessonResource, { foreignKey: 'lessonId', as: 'resources', onDelete: 'CASCADE' });
LessonResource.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

Lesson.hasMany(VideoProcessingJob, { foreignKey: 'lessonId', as: 'processingJobs', onDelete: 'CASCADE' });
VideoProcessingJob.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// --- Tags Associations ---
Course.belongsToMany(Tag, { through: CourseTag, foreignKey: 'courseId', otherKey: 'tagId', as: 'tags' });
Tag.belongsToMany(Course, { through: CourseTag, foreignKey: 'tagId', otherKey: 'courseId', as: 'courses' });

// --- Questions Associations ---
Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Module.hasMany(Question, { foreignKey: 'moduleId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

Lesson.hasMany(Question, { foreignKey: 'lessonId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

Question.hasMany(QuestionOption, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE' });
QuestionOption.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// --- Test Attempts Associations ---
User.hasMany(TestAttempt, { foreignKey: 'userId', as: 'testAttempts', onDelete: 'CASCADE' });
TestAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(TestAttempt, { foreignKey: 'courseId', as: 'testAttempts', onDelete: 'CASCADE' });
TestAttempt.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

TestAttempt.hasMany(TestAnswer, { foreignKey: 'attemptId', as: 'answers', onDelete: 'CASCADE' });
TestAnswer.belongsTo(TestAttempt, { foreignKey: 'attemptId', as: 'attempt' });

TestAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// --- Enrollment Associations ---
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments', onDelete: 'CASCADE' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// --- Lesson Progress Associations ---
User.hasMany(LessonProgress, { foreignKey: 'userId', as: 'lessonProgress', onDelete: 'CASCADE' });
LessonProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Lesson.hasMany(LessonProgress, { foreignKey: 'lessonId', as: 'progress', onDelete: 'CASCADE' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

Enrollment.hasMany(LessonProgress, { foreignKey: 'enrollmentId', as: 'lessonProgress', onDelete: 'CASCADE' });
LessonProgress.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });

// --- Video Watch Log Associations ---
User.hasMany(VideoWatchLog, { foreignKey: 'userId', as: 'watchLogs', onDelete: 'CASCADE' });
VideoWatchLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Lesson.hasMany(VideoWatchLog, { foreignKey: 'lessonId', as: 'watchLogs', onDelete: 'CASCADE' });
VideoWatchLog.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// --- Certificate Associations ---
User.hasMany(Certificate, { foreignKey: 'userId', as: 'certificates', onDelete: 'CASCADE' });
Certificate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Certificate, { foreignKey: 'courseId', as: 'certificates', onDelete: 'CASCADE' });
Certificate.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Enrollment.hasOne(Certificate, { foreignKey: 'enrollmentId', as: 'certificate', onDelete: 'CASCADE' });
Certificate.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });

// --- Teacher Profile Associations ---
TeacherProfile.hasMany(TeacherBankAccount, { foreignKey: 'teacherId', as: 'bankAccounts', onDelete: 'CASCADE' });
TeacherBankAccount.belongsTo(TeacherProfile, { foreignKey: 'teacherId', as: 'teacher' });

TeacherProfile.hasMany(TeacherEarning, { foreignKey: 'teacherId', as: 'earnings' });
TeacherEarning.belongsTo(TeacherProfile, { foreignKey: 'teacherId', as: 'teacher' });

TeacherProfile.hasMany(TeacherPayout, { foreignKey: 'teacherId', as: 'payouts' });
TeacherPayout.belongsTo(TeacherProfile, { foreignKey: 'teacherId', as: 'teacher' });

TeacherPayout.belongsTo(TeacherBankAccount, { foreignKey: 'bankAccountId', as: 'bankAccount' });
TeacherPayout.belongsTo(User, { foreignKey: 'processedBy', as: 'processor' });

TeacherEarning.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
TeacherEarning.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });

// --- Subscription Associations ---
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

SubscriptionPlan.hasMany(Subscription, { foreignKey: 'planId', as: 'subscriptions' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

// --- Payment Associations ---
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Payment, { foreignKey: 'courseId', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Subscription.hasMany(Payment, { foreignKey: 'subscriptionId', as: 'payments' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId', as: 'subscription' });

// --- Promo Code Associations ---
PromoCode.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

PromoCode.hasMany(PromoCodeUsage, { foreignKey: 'promoCodeId', as: 'usage' });
PromoCodeUsage.belongsTo(PromoCode, { foreignKey: 'promoCodeId', as: 'promoCode' });

PromoCodeUsage.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PromoCodeUsage.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

// --- Conversation & Message Associations ---
User.hasMany(Conversation, { foreignKey: 'participant1Id', as: 'conversationsAsParticipant1' });
User.hasMany(Conversation, { foreignKey: 'participant2Id', as: 'conversationsAsParticipant2' });
Conversation.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });
Conversation.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });
Conversation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// --- Notification Associations ---
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Review Associations ---
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Enrollment.hasOne(Review, { foreignKey: 'enrollmentId', as: 'review' });
Review.belongsTo(Enrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });

Review.hasMany(ReviewVote, { foreignKey: 'reviewId', as: 'votes', onDelete: 'CASCADE' });
ReviewVote.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });
ReviewVote.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Audit Log Associations ---
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Core
  User,
  Role,
  Permission,
  RolePermission,
  UserSession,
  RefreshToken,
  OtpCode,

  // Content
  Direction,
  Course,
  Module,
  Lesson,
  LessonResource,
  VideoProcessingJob,
  Tag,
  CourseTag,

  // Questions & Tests
  Question,
  QuestionOption,
  TestAttempt,
  TestAnswer,

  // Progress & Learning
  Enrollment,
  LessonProgress,
  VideoWatchLog,
  UserStreak,
  Certificate,

  // Teacher
  TeacherProfile,
  TeacherBankAccount,
  TeacherEarning,
  TeacherPayout,

  // Subscription & Payment
  SubscriptionPlan,
  Subscription,
  Payment,
  PromoCode,
  PromoCodeUsage,

  // Communication
  Conversation,
  Message,
  Notification,
  Review,
  ReviewVote,

  // System
  AuditLog,
  Setting,
  TokenBlacklist,
  SubscriptionPoolStats,
};
