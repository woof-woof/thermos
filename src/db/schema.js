const Sequelize = require('sequelize');
const db = require('./connection');

const Config = db.define('config', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  value: Sequelize.TEXT,
});


db.sync();

module.exports = {
  db,
  Config,
};
