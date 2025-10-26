const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('../database/knex');

/**
 * Session store configuration using Knex
 */
const sessionStore = new KnexSessionStore({
  knex,
  tablename: 'sessions',
  sidfieldname: 'sid',
  createtable: false, // We'll create it via migration
  clearInterval: 60000, // Clear expired sessions every 1 minute
});

/**
 * Session configuration
 */
const sessionConfig = {
  store: sessionStore,
  name: process.env.SESSION_NAME || 'connect.sid',
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10), // 24 hours
  },
};

module.exports = {
  sessionStore,
  sessionConfig,
};
