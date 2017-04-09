const { Pool } = require('pg')

/**
 *
 * @returns {PG.Pool}
 */
module.exports = function () {
  return new Pool({
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    max: 4
  })
}
