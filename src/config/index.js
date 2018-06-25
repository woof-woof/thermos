require('dotenv').config();
//
// const DEFAULT = {
//   SERVER_TOPIC: 'thermos',
//   ETOPIC_SCHEDULES: 'schedules',
//   ETOPIC_STATUS: 'status',
//   ETOPIC_HISTORY: 'history',
//   TOPIC_TEMPERATURE: 'sensors/temperature',
//   TOPIC_HEATING: '/heating',
//   SATE_LOG_INTERVAL: 600,
// };
// const FINAL = process.env;
// if (!FINAL.__loaded) { // eslint-disable-line no-underscore-dangle
//   Object.keys(DEFAULT).forEach((property) => {
//     FINAL[property] = FINAL[property] || DEFAULT[property];
//   });
//   FINAL.__loaded = true; // eslint-disable-line no-underscore-dangle
// }

// module.exports = FINAL;


module.exports = {
  server: {
    hostname: `mqtt://${process.env.MQTT_HOST || 'localhost'}`,
    options: {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    },
  },
  SERVER_TOPIC: process.env.SERVER_TOPIC || 'thermos',
  ETOPIC_SCHEDULES: process.env.ETOPIC_SCHEDULES || 'schedules',
  ETOPIC_STATUS: process.env.ETOPIC_STATUS || 'status',
  ETOPIC_HISTORY: process.env.ETOPIC_HISTORY || 'history',
  TOPIC_TEMPERATURE: process.env.TOPIC_TEMPERATURE || 'sensors/temperature',
  TOPIC_HEATING: process.env.TOPIC_HEATING || '/heating',
  SATE_LOG_INTERVAL: process.env.SATE_LOG_INTERVAL || 600,
};
