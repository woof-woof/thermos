const Sequelize = require('sequelize');
const path = require('path');

const dbFile = path.join(__dirname, '/../../var/db/thermos.db');
const sequelize = new Sequelize(`sqlite:${dbFile}`, {
  dialect: 'sqlite',
  storage: dbFile,
  logging: false,
  operatorsAliases: false, // avoid ugly deprecated warning
});

module.exports = sequelize;
