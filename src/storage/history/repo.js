const moment = require('moment');
const db = require('./connection');

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

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

/**
 * Get state history
 * @param  {Date} start
 * @param  {Date} end
 * @param  {int} interval seconds
 * @return { heating, sensors }
 *
 */
async function getHistory(start, end, interval) {
  const sensors = await query(
    `SELECT sensorId, AVG(temperature) AS temperature, AVG(humidity) AS humidity, MAX(timestamp) AS timestamp,
    strftime('%s', timestamp)/? AS tmp
    FROM sensors WHERE timestamp BETWEEN ? AND ?
    GROUP BY sensorId, tmp
    `,
    [interval, moment(start).format(), moment(end).format()],
  );
  const heating = await query(
    `SELECT program, AVG(heating) AS heating, MAX(timestamp) AS timestamp,
    strftime('%s', timestamp)/? AS tmp
    FROM heating WHERE timestamp BETWEEN ? AND ?
    GROUP BY tmp
    `,
    [interval, moment(start).format(), moment(end).format()],
  );

  return { heating, sensors };
}

module.exports = {
  ensureTablesExist,
  logState,
  getHistory,
};
