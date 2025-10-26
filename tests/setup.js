/**
 * Jest test setup file
 * This file runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.DB_NAME = 'lms_db_test';

// Global test timeout
jest.setTimeout(10000);

// Mock logger to avoid console output during tests
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));
