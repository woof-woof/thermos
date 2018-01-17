module.exports = {
  server: {
    hostname: `mqtt://${process.env.MQTT_HOST}`,
    options: {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    },
  },
};
