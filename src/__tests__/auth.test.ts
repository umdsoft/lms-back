import request from 'supertest';
import app from '../app';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import './setup';

describe('Authentication API', () => {
  describe('POST /api/v1/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUser.email);
      expect(response.body.data.user.firstName).toBe(validUser.firstName);
      expect(response.body.data.user.lastName).toBe(validUser.lastName);
      expect(response.body.data.user.role).toBe('student');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not register user with duplicate email', async () => {
      await User.create(validUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should not register user with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not register user with short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: '12345' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not register user without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: validUser.email })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const userCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send({
        ...userCredentials,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should login user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(userCredentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userCredentials.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ ...userCredentials, password: 'wrongpassword' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      accessToken = response.body.data.accessToken;
    });

    it('should get current user info with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.firstName).toBe('John');
      expect(response.body.data.user.lastName).toBe('Doe');
    });

    it('should not get user info without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not get user info with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      refreshToken = response.body.data.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.refreshToken).not.toBe(refreshToken);
    });

    it('should not refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not refresh without refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      refreshToken = response.body.data.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify token is deleted from database
      const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
      expect(tokenInDb).toBeNull();
    });

    it('should not logout without refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout-all', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      accessToken = response.body.data.accessToken;
      userId = response.body.data.user._id;

      // Login multiple times to create multiple refresh tokens
      await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should logout from all devices successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout-all')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify all tokens are deleted
      const tokensInDb = await RefreshToken.find({ userId });
      expect(tokensInDb).toHaveLength(0);
    });

    it('should not logout-all without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout-all')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
