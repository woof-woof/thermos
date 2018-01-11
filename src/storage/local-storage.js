const { JSONStorage } = require('node-localstorage');

module.exports = new JSONStorage('./var/storage.db');
