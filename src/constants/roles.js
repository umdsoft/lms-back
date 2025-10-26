/**
 * User Roles
 */
const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};

/**
 * Role hierarchy for permission checking
 * Higher index = more permissions
 */
const ROLE_HIERARCHY = [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN];

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
};
