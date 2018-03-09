const db = require('./connection');
const { getHistory, query } = require('./repo');

// use like
getHistory(new Date('2014-01-01'), new Date('2018-05-01'), 100).then(res => console.log('@Res', res));
