const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCourses = sequelize.define('UserCourses', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        primaryKey: true
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Courses',
            key: 'id'
        },
        primaryKey: true
    },
    enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = UserCourses;
