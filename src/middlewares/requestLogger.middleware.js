const logger = require('../utils/logger');

/**
 * Batafsil request logging middleware
 * Har bir API so'rovini konsolda ko'rsatadi
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Request ma'lumotlari
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  };

  // Query parametrlarni ko'rsatish
  if (Object.keys(req.query).length > 0) {
    requestInfo.query = req.query;
  }

  // Request body ni ko'rsatish (password kabi sensitive ma'lumotlarni yashirish)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Sensitive ma'lumotlarni yashirish
    if (sanitizedBody.password) sanitizedBody.password = '***';
    if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***';
    if (sanitizedBody.oldPassword) sanitizedBody.oldPassword = '***';
    if (sanitizedBody.token) sanitizedBody.token = '***';
    requestInfo.body = sanitizedBody;
  }

  // Foydalanuvchi ma'lumotlari (agar autentifikatsiya qilingan bo'lsa)
  if (req.user) {
    requestInfo.user = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    };
  }

  logger.info('========================================');
  logger.info('📥 KIRUVCHI SO\'ROV:', requestInfo);

  // Response tugaganda log qilish
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    logger.info('📤 JAVOB:', {
      status: res.statusCode,
      duration: `${duration}ms`,
      contentLength: data ? data.length : 0,
    });

    // Status code rangini aniqlash
    if (res.statusCode >= 500) {
      logger.error(`❌ SERVER XATOSI: ${res.statusCode}`);
    } else if (res.statusCode >= 400) {
      logger.warn(`⚠️  CLIENT XATOSI: ${res.statusCode}`);
    } else if (res.statusCode >= 300) {
      logger.info(`➡️  REDIRECT: ${res.statusCode}`);
    } else {
      logger.info(`✅ MUVAFFAQIYATLI: ${res.statusCode}`);
    }

    logger.info('========================================\n');

    originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
