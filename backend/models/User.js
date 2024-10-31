const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: DataTypes.DATE,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  plan: {
    type: DataTypes.ENUM('basic', 'expert', 'expertduo'),
  },
});

module.exports = User;
