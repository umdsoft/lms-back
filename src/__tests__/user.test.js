const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateAccessToken } = require('../utils/jwt');
require('./setup');

describe('User Management API', () => {
  let adminToken;
  let teacherToken;
  let studentToken;
  let adminUser;
  let teacherUser;
  let studentUser;

  // Helper function to create a user and get token
  const createUserAndGetToken = async (userData) => {
    const user = await User.create(userData);
    const token = generateAccessToken(user.id);
    return { user, token };
  };

  beforeEach(async () => {
    // Create admin user
    const adminData = await createUserAndGetToken({
      email: 'admin@test.com',
      phone: '+998901234567',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
    });
    adminUser = adminData.user;
    adminToken = adminData.token;

    // Create teacher user
    const teacherData = await createUserAndGetToken({
      email: 'teacher@test.com',
      phone: '+998901234568',
      password: 'Teacher123!',
      firstName: 'Teacher',
      lastName: 'User',
      role: 'teacher',
      status: 'active',
    });
    teacherUser = teacherData.user;
    teacherToken = teacherData.token;

    // Create student user
    const studentData = await createUserAndGetToken({
      email: 'student@test.com',
      phone: '+998901234569',
      password: 'Student123!',
      firstName: 'Student',
      lastName: 'User',
      role: 'student',
      status: 'active',
    });
    studentUser = studentData.user;
    studentToken = studentData.token;
  });

  describe('GET /api/v1/users - Get all users', () => {
    it('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.statistics).toBeDefined();
      expect(response.body.data.users.length).toBeGreaterThanOrEqual(3);
    });

    it('should fail to get all users as non-admin', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should filter users by role', async () => {
      const response = await request(app)
        .get('/api/v1/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every(u => u.role === 'admin')).toBe(true);
    });

    it('should filter users by status', async () => {
      const response = await request(app)
        .get('/api/v1/users?status=active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every(u => u.status === 'active')).toBe(true);
    });

    it('should search users by email', async () => {
      const response = await request(app)
        .get('/api/v1/users?search=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });

    it('should paginate users correctly', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.page).toBe(1);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:id - Get user by ID', () => {
    it('should get user by ID as admin', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(studentUser.id);
      expect(response.body.data.user.email).toBe(studentUser.email);
    });

    it('should get own profile as student', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(studentUser.id);
    });

    it('should fail to get another user profile as non-admin', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${teacherUser.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users - Create user', () => {
    const newUser = {
      email: 'newuser@test.com',
      phone: '+998901234570',
      password: 'NewUser123!',
      firstName: 'New',
      lastName: 'User',
      role: 'student',
    };

    it('should create a new user as admin', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(newUser.email.toLowerCase());
      expect(response.body.data.user.firstName).toBe(newUser.firstName);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should fail to create user as non-admin', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(newUser)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...newUser,
          email: adminUser.email,
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...newUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...newUser,
          password: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with short name', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...newUser,
          firstName: 'A',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/:id - Update user', () => {
    it('should update user as admin', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe('Updated');
      expect(response.body.data.user.lastName).toBe('Name');
    });

    it('should update own profile', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          firstName: 'Self',
          lastName: 'Updated',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe('Self');
    });

    it('should fail to update another user as non-admin', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          firstName: 'Hacked',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: adminUser.email,
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/:id/role - Update user role', () => {
    it('should update user role as admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'teacher',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('teacher');
    });

    it('should fail to update role as non-admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/role`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          role: 'admin',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail to update own role', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'student',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid role', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'superadmin',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent demoting last admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'student',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('last admin');
    });
  });

  describe('PATCH /api/v1/users/:id/status - Update user status', () => {
    it('should block user as admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'blocked',
          reason: 'Spam activity',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.status).toBe('blocked');
      expect(response.body.data.user.blockedReason).toBe('Spam activity');
    });

    it('should unblock user as admin', async () => {
      // First block
      await request(app)
        .patch(`/api/v1/users/${studentUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'blocked',
          reason: 'Test',
        });

      // Then unblock
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'active',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.status).toBe('active');
      expect(response.body.data.user.blockedReason).toBeNull();
    });

    it('should fail to update status as non-admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${teacherUser.id}/status`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'blocked',
          reason: 'Test',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail to block without reason', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'blocked',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to update own status', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'inactive',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/:id/password - Change password', () => {
    it('should change own password', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/password`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          currentPassword: 'Student123!',
          newPassword: 'NewPassword123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail with incorrect current password', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/password`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrect');
    });

    it('should fail to change another user password', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminUser.id}/password`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          currentPassword: 'Admin123!',
          newPassword: 'NewPassword123!',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with weak new password', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${studentUser.id}/password`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          currentPassword: 'Student123!',
          newPassword: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/users/:id - Delete user', () => {
    it('should delete user as admin (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${studentUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify user is soft deleted
      const user = await User.findByPk(studentUser.id);
      expect(user.status).toBe('inactive');
      expect(user.isActive).toBe(false);
    });

    it('should fail to delete as non-admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${teacherUser.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail to delete own account', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent deleting last admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('last');
    });
  });

  describe('GET /api/v1/users/statistics - Get statistics', () => {
    it('should get statistics as admin', async () => {
      const response = await request(app)
        .get('/api/v1/users/statistics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeDefined();
      expect(response.body.data.active).toBeDefined();
      expect(response.body.data.byRole).toBeDefined();
      expect(response.body.data.byRole.student).toBeGreaterThanOrEqual(1);
      expect(response.body.data.byRole.teacher).toBeGreaterThanOrEqual(1);
      expect(response.body.data.byRole.admin).toBeGreaterThanOrEqual(1);
    });

    it('should fail to get statistics as non-admin', async () => {
      const response = await request(app)
        .get('/api/v1/users/statistics')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
