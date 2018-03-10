const db = require('./connection');
const { ensureTablesExist } = require('./repo');

ensureTablesExist();

module.exports = db;
