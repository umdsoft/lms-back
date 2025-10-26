const { sequelize } = require('../config/database');

// Clear all test data before each test
beforeEach(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true });
  }
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});
