const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Direction = require('./Direction');
const DirectionSubject = require('./DirectionSubject');
const DirectionTeacher = require('./DirectionTeacher');
const Course = require('./Course');
const Module = require('./Module');
const Lesson = require('./Lesson');
const LessonFile = require('./LessonFile');
const LessonTest = require('./LessonTest');
const TestResult = require('./TestResult');
const Test = require('./Test');

// User <-> RefreshToken associations
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Direction <-> DirectionSubject associations
Direction.hasMany(DirectionSubject, {
  foreignKey: 'directionId',
  as: 'subjects',
  onDelete: 'CASCADE',
});

DirectionSubject.belongsTo(Direction, {
  foreignKey: 'directionId',
  as: 'direction',
});

// Direction <-> User (Teachers) associations through DirectionTeacher
Direction.belongsToMany(User, {
  through: DirectionTeacher,
  foreignKey: 'directionId',
  otherKey: 'userId',
  as: 'teachers',
});

User.belongsToMany(Direction, {
  through: DirectionTeacher,
  foreignKey: 'userId',
  otherKey: 'directionId',
  as: 'directions',
});

// DirectionTeacher <-> Direction associations
DirectionTeacher.belongsTo(Direction, {
  foreignKey: 'directionId',
  as: 'direction',
});

DirectionTeacher.belongsTo(User, {
  foreignKey: 'userId',
  as: 'teacher',
});

// ============================================
// HIERARCHICAL COURSE SYSTEM ASSOCIATIONS
// ============================================

// Direction ← 1:N → Course
Direction.hasMany(Course, {
  foreignKey: 'directionId',
  as: 'courses',
  onDelete: 'CASCADE',
});

Course.belongsTo(Direction, {
  foreignKey: 'directionId',
  as: 'direction',
});

// Course ← N:1 → User (teacher, optional)
User.hasMany(Course, {
  foreignKey: 'teacherId',
  as: 'courses',
  onDelete: 'SET NULL',
});

Course.belongsTo(User, {
  foreignKey: 'teacherId',
  as: 'teacher',
});

// Course ← 1:N → Module
Course.hasMany(Module, {
  foreignKey: 'courseId',
  as: 'modules',
  onDelete: 'CASCADE',
});

Module.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course',
});

// Module ← 1:N → Lesson
Module.hasMany(Lesson, {
  foreignKey: 'moduleId',
  as: 'lessons',
  onDelete: 'CASCADE',
});

Lesson.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module',
});

// Lesson ← 1:N → LessonFile
Lesson.hasMany(LessonFile, {
  foreignKey: 'lessonId',
  as: 'files',
  onDelete: 'CASCADE',
});

LessonFile.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson',
});

// Lesson ← 1:N → LessonTest (individual test questions)
Lesson.hasMany(LessonTest, {
  foreignKey: 'lessonId',
  as: 'lessonTests',
  onDelete: 'CASCADE',
});

LessonTest.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson',
});

// Lesson ← 1:N → Test (test containers - existing)
Lesson.hasMany(Test, {
  foreignKey: 'lessonId',
  as: 'tests',
  onDelete: 'CASCADE',
});

Test.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson',
});

// ============================================
// TEST RESULTS ASSOCIATIONS
// ============================================

// User ← 1:N → TestResult
User.hasMany(TestResult, {
  foreignKey: 'userId',
  as: 'testResults',
  onDelete: 'CASCADE',
});

TestResult.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Lesson ← 1:N → TestResult
Lesson.hasMany(TestResult, {
  foreignKey: 'lessonId',
  as: 'testResults',
  onDelete: 'CASCADE',
});

TestResult.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson',
});

// LessonTest ← 1:N → TestResult
LessonTest.hasMany(TestResult, {
  foreignKey: 'testId',
  as: 'results',
  onDelete: 'CASCADE',
});

TestResult.belongsTo(LessonTest, {
  foreignKey: 'testId',
  as: 'test',
});

module.exports = {
  User,
  RefreshToken,
  Direction,
  DirectionSubject,
  DirectionTeacher,
  Course,
  Module,
  Lesson,
  LessonFile,
  LessonTest,
  TestResult,
  Test,
};
