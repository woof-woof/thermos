const uuidv4 = require('uuid/v4');
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

  getAll() {
    const schedules = config.get('schedules');
    return schedules.reduce((result, id) => {
      result[id] = this.get(id); // eslint-disable-line no-param-reassign
      return result;
    }, {});
  },

  set(id, value) {
    const schedules = config.get('schedules');
    if (schedules.indexOf(id) === -1) {
      schedules.push(id);
      config.set('schedules', schedules);
    }
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

  getActive() {
    return this.get(config.get('activeSchedule')) || defaults.schedule;
  },

  getKey(id) {
    return `schedule.${id}`;
  },
};

const override = {
  getAll() {
    return storage.getItem('overrides');
  },
  getActive() {
    const overrides = this.getAll();
    const now = Date.now();
    const active = overrides.filter(o => o.start <= now && o.end > now);
    return active.length ? active[0] : false;
  },
  set(item) {
    let overrides = this.getAll();
    if (!overrides) {
      overrides = [];
    }
    const id = uuidv4();
    const createdAt = Date.now();
    const start = item.start || createdAt;
    const end = start + (item.duration || 7200);
    const processed = { id, createdAt, start, end };
    overrides.push(processed);
    storage.setItem('overrides', overrides);
    return processed;
  },
};

module.exports = {
  config,
  schedule,
  override,
};
