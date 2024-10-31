const { Sequelize } = require('sequelize');

// Conexión a la base de datos
const sequelize = new Sequelize('ingenieria_web', 'postgres', 'N1KOLAS23', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});


module.exports = sequelize;
