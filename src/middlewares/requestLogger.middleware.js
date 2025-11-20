const logger = require('../utils/logger');

/**
 * Optimized request logging middleware
 * - Brief logs for successful requests (2xx, 3xx)
 * - Detailed logs for errors (4xx, 5xx)
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Build request info (only used for error logging)
  const buildRequestInfo = () => {
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    // Query parameters
    if (Object.keys(req.query).length > 0) {
      requestInfo.query = req.query;
    }

    // Request body (sanitize sensitive data)
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      // Hide sensitive data
      if (sanitizedBody.password) sanitizedBody.password = '***';
      if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***';
      if (sanitizedBody.oldPassword) sanitizedBody.oldPassword = '***';
      if (sanitizedBody.token) sanitizedBody.token = '***';
      requestInfo.body = sanitizedBody;
    }

    // User info (if authenticated)
    if (req.user) {
      requestInfo.user = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      };
    }

    return requestInfo;
  };

  // Response logging
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    // Check if this is an error response
    const isError = res.statusCode >= 400;

    if (isError) {
      // Detailed logging for errors
      const requestInfo = buildRequestInfo();
      logger.info('========================================');
      logger.info('📥 KIRUVCHI SO\'ROV:', requestInfo);
      logger.info('📤 JAVOB:', {
        status: res.statusCode,
        duration: `${duration}ms`,
        contentLength: data ? data.length : 0,
      });

      if (res.statusCode >= 500) {
        logger.error(`❌ SERVER XATOSI: ${res.statusCode}`);
      } else if (res.statusCode >= 400) {
        logger.warn(`⚠️  CLIENT XATOSI: ${res.statusCode}`);
      }

      // Log response data for errors
      try {
        const responseData = JSON.parse(data);
        logger.error('XATO MA\'LUMOTLARI:', responseData);
      } catch (e) {
        // If data is not JSON, log as is (truncated)
        const truncatedData = data ? data.substring(0, 500) : '';
        if (truncatedData) {
          logger.error('XATO MA\'LUMOTLARI:', truncatedData);
        }
      }

      logger.info('========================================\n');
    } else {
      // Brief logging for successful requests
      logger.info('📤 JAVOB:', {
        status: res.statusCode,
        duration: `${duration}ms`,
        contentLength: data ? data.length : 0,
      });
      logger.info(`✅ MUVAFFAQIYATLI: ${res.statusCode}`);
    }

    originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
