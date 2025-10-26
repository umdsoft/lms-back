const ResponseUtil = require('../../../src/utils/response.util');
const { HTTP_STATUS } = require('../../../src/config/constants');

describe('ResponseUtil', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('success', () => {
    it('should return success response with default status 200', () => {
      const data = { id: 1, name: 'Test' };
      ResponseUtil.success(res, data, 'Success message');

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success message',
        data,
      });
    });

    it('should return success response with custom status code', () => {
      const data = { id: 1, name: 'Test' };
      ResponseUtil.success(res, data, 'Created', HTTP_STATUS.CREATED);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        data,
      });
    });
  });

  describe('error', () => {
    it('should return error response', () => {
      ResponseUtil.error(
        res,
        'NOT_FOUND',
        'Resource not found',
        HTTP_STATUS.NOT_FOUND
      );

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('validationError', () => {
    it('should return validation error response', () => {
      const errors = [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ];

      ResponseUtil.validationError(res, errors);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors,
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('unauthorized', () => {
    it('should return unauthorized error response', () => {
      ResponseUtil.unauthorized(res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('notFound', () => {
    it('should return not found error response', () => {
      ResponseUtil.notFound(res, 'User not found');

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
        timestamp: expect.any(String),
      });
    });
  });
});
