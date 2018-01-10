module.exports = {
  server: {
    hostname: `mqtt://${process.env.MQTT_HOST}`,
    connection: {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASS,
    },
  },
};
