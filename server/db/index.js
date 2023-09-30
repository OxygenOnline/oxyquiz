const { Pool } = require('pg');
const dbconfig = require('../config/config');

const pool = new Pool(dbconfig);

module.exports = {
  query: (text, params) => pool.query(text, params)
};
