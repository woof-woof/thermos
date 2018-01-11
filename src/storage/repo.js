const storage = require('./local-storage');
const defaults = require('../config/defaults');

const config = {
  get: key => (key ? storage.getItem('config')[key] : storage.getItem('config')),
  set(arg1, arg2) {
    if (typeof arg1 === 'object') {
      // update entire config
      return storage.setItem('config', arg1);
    }
    // partial update
    const data = storage.getItem('config');
    data[arg1] = arg2;
    return storage.setItem('config', data);
  },
};


const schedule = {
  get(id) {
    return storage.getItem(this.getKey(id));
  },

  set(id, value) {
    const schedules = config.get('schedules');
    if (schedules.indexOf(id) === -1) {
      schedules.push(id);
      config.set('schedules', schedules);
    }
    console.log('set schedule', this.getKey(id), value);
    return storage.setItem(this.getKey(id), value);
  },

  remove(id) {
    const schedules = config.get('schedules');
    const index = schedules.indexOf(id);
    if (index !== -1) {
      schedules.splice(index, 1);
      config.set('schedules', schedules);
    }

    return storage.removeItem(this.getKey(id));
  },

  getActiveSchedule() {
    return this.get(config.get('activeSchedule')) || defaults.schedule;
  },

  getKey(id) {
    return `schedule.${id}`;
  },
};

module.exports = {
  config,
  schedule,
};
