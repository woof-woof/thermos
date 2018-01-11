module.exports = {
  config: {
    readInterval: 60000,
    keepTempInterval: 60000,
    lowThreshold: 0.3,
    highThreshold: 0,
    activeSchedule: 'default',
    schedules: ['default'],
  },
  schedule: {
    temperature: {
      day: 21,
      night: 19.5,
    },
    day: {
      workday: [
        { time: '8:00', temperature: 'day' },
        { time: '23:00', temperature: 'night' },
      ],
      weekend: [
        { time: '9:00', temperature: 'day' },
        { time: '21:00', temperature: 'night' },
      ],
    },
    week: {
      1: 'workday', // Monday
      2: 'workday', // Tuesday
      3: 'workday', // ...
      4: 'workday',
      5: 'workday',
      6: 'weekend', // Saturday
      0: 'weekend', // Sunday
    },
  },
};
