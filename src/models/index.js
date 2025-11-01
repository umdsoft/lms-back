const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Direction = require('./Direction');
const DirectionSubject = require('./DirectionSubject');
const DirectionTeacher = require('./DirectionTeacher');

// User <-> RefreshToken associations
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Direction <-> DirectionSubject associations
Direction.hasMany(DirectionSubject, {
  foreignKey: 'directionId',
  as: 'subjects',
  onDelete: 'CASCADE',
});

DirectionSubject.belongsTo(Direction, {
  foreignKey: 'directionId',
  as: 'direction',
});

// Direction <-> User (Teachers) associations through DirectionTeacher
Direction.belongsToMany(User, {
  through: DirectionTeacher,
  foreignKey: 'directionId',
  otherKey: 'userId',
  as: 'teachers',
});

User.belongsToMany(Direction, {
  through: DirectionTeacher,
  foreignKey: 'userId',
  otherKey: 'directionId',
  as: 'directions',
});

// DirectionTeacher <-> Direction associations
DirectionTeacher.belongsTo(Direction, {
  foreignKey: 'directionId',
  as: 'direction',
});

DirectionTeacher.belongsTo(User, {
  foreignKey: 'userId',
  as: 'teacher',
});

module.exports = {
  User,
  RefreshToken,
  Direction,
  DirectionSubject,
  DirectionTeacher,
};
