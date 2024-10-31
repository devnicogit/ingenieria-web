const User = require('./User');
const Course = require('./Course');

function defineAssociations() {
  User.belongsToMany(Course, { through: 'UserCourses', foreignKey: 'userId' });
  Course.belongsToMany(User, { through: 'UserCourses', foreignKey: 'courseId' });
}

module.exports = defineAssociations;
