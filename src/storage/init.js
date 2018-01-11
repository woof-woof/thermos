const { config, schedule } = require('./repo');
const defaults = require('../config/defaults');

function init() {
  if (!config.get()) {
    config.set(defaults.config);
    schedule.set('default', defaults.schedule);
  }
}

module.exports = init;
