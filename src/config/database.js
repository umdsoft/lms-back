const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Use MySQL for all environments
const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  process.env[isTest ? 'DB_TEST_NAME' : 'DB_NAME'] || (isTest ? 'lms_platform_test' : 'lms_platform'),
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const connectDatabase = async () => {
  try {
    logger.info('🔌 Ma\'lumotlar bazasiga ulanish boshlandi...');

    await sequelize.authenticate();

    if (!isTest) {
      logger.info('✅ MySQL Connected:', {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'lms_platform',
        user: process.env.DB_USER || 'root',
      });
    }

    // Sync models in development and test
    if (process.env.NODE_ENV === 'development' || isTest) {
      logger.info('🔄 Ma\'lumotlar bazasi sinxronizatsiyasi boshlandi...');
      await sequelize.sync({ alter: !isTest, force: isTest });
      if (!isTest) {
        logger.info('✅ Ma\'lumotlar bazasi muvaffaqiyatli sinxronizatsiya qilindi');
      }
    }
  } catch (error) {
    if (!isTest) {
      logger.error('❌ Ma\'lumotlar bazasiga ulanishda xatolik:', error);
    }
    process.exit(1);
  }
};

module.exports = { sequelize, connectDatabase };
