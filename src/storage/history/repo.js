const db = require('./connection');

function ensureTablesExist() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sensors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorId VARCHAR(50),
      temperature FLOAT,
      humidity FLOAT,
      timestamp DATETIME
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS heating (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target FLOAT,
      program VARCHAR(50),
      heating BOOLEAN,
      timestamp DATETIME
    )`);
  });
}

function logState(state) {
  const { heating, sensors } = state;
  if (sensors) {
    Object.keys(sensors).forEach((sensorId) => {
      const sensor = sensors[sensorId];
      db.run(
        `INSERT INTO sensors (sensorId, temperature, humidity, timestamp)
          VALUES (?, ?, ?, ?)`,
        [sensorId, sensor.temperature, sensor.humidity, sensor.timestamp],
      );
    });
  }
  if (heating && heating.program) {
    db.run(
      `INSERT INTO heating (target, program, heating, timestamp)
        VALUES(?, ?, ?, ?)`,
      [heating.program.temperature, heating.program.programName, heating.value, heating.timestamp],
    );
  }
}

module.exports = {
  ensureTablesExist,
  logState,
};
