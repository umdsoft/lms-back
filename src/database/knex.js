const knex = require('knex');
const config = require('../config/database');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

/**
 * Knex instance for database operations
 */
const db = knex(knexConfig);

module.exports = db;
