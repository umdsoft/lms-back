const request = require('supertest');
const app = require('../app');
const { Direction, DirectionSubject, DirectionTeacher, User } = require('../models');
const { generateAccessToken } = require('../utils/jwt');
require('./setup');

describe('Direction Management API', () => {
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
      firstName: 'Dilnoza',
      lastName: 'Karimova',
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

  describe('POST /api/v1/directions - Create direction', () => {
    it('should create direction successfully as admin', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Fizika',
          description: 'Fan va texnologiya',
          color: 'purple',
          icon: 'beaker',
          status: 'active',
          displayOrder: 1,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Direction created successfully');
      expect(response.body.data.direction).toBeDefined();
      expect(response.body.data.direction.name).toBe('Fizika');
      expect(response.body.data.direction.slug).toBe('fizika');
      expect(response.body.data.direction.color).toBe('purple');
    });

    it('should fail to create direction with duplicate name', async () => {
      // Create first direction
      await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Matematika',
          color: 'blue',
          displayOrder: 0,
        })
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Matematika',
          color: 'green',
          displayOrder: 1,
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail to create direction as non-admin', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Fizika',
          color: 'purple',
          displayOrder: 0,
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create direction without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Fizika',
          displayOrder: 0,
          // missing color
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create direction with invalid color', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Fizika',
          color: 'invalid-color',
          displayOrder: 0,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should auto-generate slug correctly', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Ingliz tili',
          color: 'blue',
          displayOrder: 0,
        })
        .expect(201);

      expect(response.body.data.direction.slug).toBe('ingliz-tili');
    });

    it('should accept camelCase displayOrder equal to 0', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Biologiya',
          color: 'green',
          status: 'active',
          displayOrder: 0,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.direction.displayOrder).toBe(0);
    });

    it('should accept snake_case display_order equal to 0', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Kimyo',
          color: 'teal',
          status: 'active',
          display_order: 0,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.direction.displayOrder).toBe(0);
    });

    it('should reject creation without displayOrder', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Tarix',
          color: 'red',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('displayOrder is required');
    });

    it('should reject creation when displayOrder is negative', async () => {
      const response = await request(app)
        .post('/api/v1/directions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Geografiya',
          color: 'orange',
          displayOrder: -1,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Display order must be at least 0');
    });
  });

  describe('GET /api/v1/directions - Get all directions', () => {
    beforeEach(async () => {
      // Create test directions
      await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        description: 'Physics direction',
        color: 'purple',
        status: 'active',
        displayOrder: 1,
      });

      await Direction.create({
        name: 'Matematika',
        slug: 'matematika',
        description: 'Math direction',
        color: 'blue',
        status: 'active',
        displayOrder: 2,
      });

      await Direction.create({
        name: 'Informatika',
        slug: 'informatika',
        description: 'IT direction',
        color: 'green',
        status: 'inactive',
        displayOrder: 3,
      });
    });

    it('should get all directions as authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/directions')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.directions).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.statistics).toBeDefined();
      expect(response.body.data.directions.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter directions by status', async () => {
      const response = await request(app)
        .get('/api/v1/directions?status=active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.directions.every(d => d.status === 'active')).toBe(true);
    });

    it('should search directions by name', async () => {
      const response = await request(app)
        .get('/api/v1/directions?search=Fizika')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.directions.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data.directions[0].name).toContain('Fizika');
    });

    it('should paginate directions', async () => {
      const response = await request(app)
        .get('/api/v1/directions?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.directions.length).toBeLessThanOrEqual(2);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(2);
    });

    it('should sort directions by displayOrder', async () => {
      const response = await request(app)
        .get('/api/v1/directions?sortBy=displayOrder&sortOrder=asc')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const directions = response.body.data.directions;
      for (let i = 1; i < directions.length; i++) {
        expect(directions[i].displayOrder).toBeGreaterThanOrEqual(directions[i - 1].displayOrder);
      }
    });
  });

  describe('GET /api/v1/directions/statistics - Get statistics', () => {
    beforeEach(async () => {
      await Direction.create({ name: 'Dir1', slug: 'dir1', color: 'blue', status: 'active' });
      await Direction.create({ name: 'Dir2', slug: 'dir2', color: 'red', status: 'active' });
      await Direction.create({ name: 'Dir3', slug: 'dir3', color: 'green', status: 'inactive' });
    });

    it('should get statistics correctly', async () => {
      const response = await request(app)
        .get('/api/v1/directions/statistics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeGreaterThanOrEqual(3);
      expect(response.body.data.active).toBeGreaterThanOrEqual(2);
      expect(response.body.data.inactive).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/v1/directions/:id - Get single direction', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        description: 'Physics',
        color: 'purple',
        status: 'active',
      });
    });

    it('should get single direction by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/directions/${direction.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.direction).toBeDefined();
      expect(response.body.data.direction.name).toBe('Fizika');
      expect(response.body.data.direction.subjects).toBeDefined();
      expect(response.body.data.direction.teachers).toBeDefined();
      expect(response.body.data.direction.stats).toBeDefined();
    });

    it('should return 404 for non-existent direction', async () => {
      const response = await request(app)
        .get('/api/v1/directions/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/directions/:id - Update direction', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        description: 'Physics',
        color: 'purple',
        status: 'active',
      });
    });

    it('should update direction successfully as admin', async () => {
      const response = await request(app)
        .put(`/api/v1/directions/${direction.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Fizika va Astronomiya',
          description: 'Updated description',
          color: 'blue',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.direction.name).toBe('Fizika va Astronomiya');
      expect(response.body.data.direction.slug).toBe('fizika-va-astronomiya');
      expect(response.body.data.direction.color).toBe('blue');
    });

    it('should fail to update direction as non-admin', async () => {
      const response = await request(app)
        .put(`/api/v1/directions/${direction.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/directions/:id/status - Update status', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        color: 'purple',
        status: 'active',
      });
    });

    it('should update status successfully as admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/directions/${direction.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'inactive',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.direction.status).toBe('inactive');
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .patch(`/api/v1/directions/${direction.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'invalid',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/directions/:id - Delete direction', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        color: 'purple',
        status: 'active',
      });
    });

    it('should delete direction successfully as admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/directions/${direction.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Direction deleted successfully');

      // Verify it's deleted
      const deleted = await Direction.findByPk(direction.id);
      expect(deleted).toBeNull();
    });

    it('should fail to delete direction as non-admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/directions/${direction.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Direction Subjects', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        color: 'purple',
        status: 'active',
      });
    });

    describe('POST /api/v1/directions/:id/subjects - Add subjects', () => {
      it('should add subjects successfully as admin', async () => {
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/subjects`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            subjects: ['Mexanika', 'Optika', 'Elektr'],
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.subjects.length).toBe(3);
      });

      it('should fail to add duplicate subjects', async () => {
        // Add subjects first time
        await request(app)
          .post(`/api/v1/directions/${direction.id}/subjects`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            subjects: ['Mexanika'],
          })
          .expect(201);

        // Try to add same subject again
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/subjects`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            subjects: ['Mexanika'],
          })
          .expect(409);

        expect(response.body.success).toBe(false);
      });

      it('should fail to add subjects as non-admin', async () => {
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/subjects`)
          .set('Authorization', `Bearer ${studentToken}`)
          .send({
            subjects: ['Mexanika'],
          })
          .expect(403);

        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/v1/directions/:id/subjects - Get subjects', () => {
      beforeEach(async () => {
        await DirectionSubject.bulkCreate([
          { directionId: direction.id, name: 'Mexanika' },
          { directionId: direction.id, name: 'Optika' },
        ]);
      });

      it('should get subjects for direction', async () => {
        const response = await request(app)
          .get(`/api/v1/directions/${direction.id}/subjects`)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.subjects.length).toBe(2);
      });
    });

    describe('DELETE /api/v1/directions/:id/subjects/:subjectId - Remove subject', () => {
      let subject;

      beforeEach(async () => {
        subject = await DirectionSubject.create({
          directionId: direction.id,
          name: 'Mexanika',
        });
      });

      it('should remove subject successfully as admin', async () => {
        const response = await request(app)
          .delete(`/api/v1/directions/${direction.id}/subjects/${subject.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify it's deleted
        const deleted = await DirectionSubject.findByPk(subject.id);
        expect(deleted).toBeNull();
      });

      it('should fail to remove subject as non-admin', async () => {
        const response = await request(app)
          .delete(`/api/v1/directions/${direction.id}/subjects/${subject.id}`)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect(403);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Direction Teachers', () => {
    let direction;

    beforeEach(async () => {
      direction = await Direction.create({
        name: 'Fizika',
        slug: 'fizika',
        color: 'purple',
        status: 'active',
      });
    });

    describe('POST /api/v1/directions/:id/teachers - Assign teachers', () => {
      it('should assign teachers successfully as admin', async () => {
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/teachers`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            teacherIds: [teacherUser.id],
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.teachers.length).toBe(1);
      });

      it('should fail to assign non-teacher user', async () => {
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/teachers`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            teacherIds: [studentUser.id],
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('not teachers');
      });

      it('should fail to assign teachers as non-admin', async () => {
        const response = await request(app)
          .post(`/api/v1/directions/${direction.id}/teachers`)
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({
            teacherIds: [teacherUser.id],
          })
          .expect(403);

        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/v1/directions/:id/teachers - Get teachers', () => {
      beforeEach(async () => {
        await DirectionTeacher.create({
          directionId: direction.id,
          userId: teacherUser.id,
        });
      });

      it('should get teachers for direction', async () => {
        const response = await request(app)
          .get(`/api/v1/directions/${direction.id}/teachers`)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.teachers.length).toBe(1);
        expect(response.body.data.teachers[0].firstName).toBe('Dilnoza');
      });
    });

    describe('DELETE /api/v1/directions/:id/teachers/:teacherId - Remove teacher', () => {
      beforeEach(async () => {
        await DirectionTeacher.create({
          directionId: direction.id,
          userId: teacherUser.id,
        });
      });

      it('should remove teacher successfully as admin', async () => {
        const response = await request(app)
          .delete(`/api/v1/directions/${direction.id}/teachers/${teacherUser.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify it's deleted
        const deleted = await DirectionTeacher.findOne({
          where: { directionId: direction.id, userId: teacherUser.id },
        });
        expect(deleted).toBeNull();
      });

      it('should fail to remove teacher as non-admin', async () => {
        const response = await request(app)
          .delete(`/api/v1/directions/${direction.id}/teachers/${teacherUser.id}`)
          .set('Authorization', `Bearer ${studentToken}`)
          .expect(403);

        expect(response.body.success).toBe(false);
      });
    });
  });
});
