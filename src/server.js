require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/database');
const logger = require('./utils/logger');

// Set port
const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    logger.info('========================================');
    logger.info('🚀 SERVER BOSHLANDI');
    logger.info('========================================');

    // Connect to MySQL
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      logger.info('========================================');
      logger.info('✅ SERVER MUVAFFAQIYATLI ISHGA TUSHDI');
      logger.info('========================================');
      logger.info(`🌐 Server manzili: http://localhost:${PORT}`);
      logger.info(`📚 API Dokumentatsiya: http://localhost:${PORT}/api-docs`);
      logger.info(`🔧 Muhit: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`💾 Ma'lumotlar bazasi: MySQL (Sequelize ORM)`);
      logger.info('========================================');
      logger.info('📡 API so\'rovlarini kutish holati...\n');
    });
  } catch (error) {
    logger.error('========================================');
    logger.error('❌ SERVER ISHGA TUSHMADI!');
    logger.error('========================================');
    logger.error('Xatolik:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('========================================');
  logger.error('❌ UNHANDLED PROMISE REJECTION!');
  logger.error('========================================');
  logger.error('Xatolik:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('========================================');
  logger.error('❌ UNCAUGHT EXCEPTION!');
  logger.error('========================================');
  logger.error('Xatolik:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('========================================');
  logger.info('🛑 SIGTERM signal qabul qilindi');
  logger.info('Server to\'xtatilmoqda...');
  logger.info('========================================');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('========================================');
  logger.info('🛑 SIGINT signal qabul qilindi (Ctrl+C)');
  logger.info('Server to\'xtatilmoqda...');
  logger.info('========================================');
  process.exit(0);
});

// Start the server
startServer();
