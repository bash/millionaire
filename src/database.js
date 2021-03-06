/**
 *
 * @param {PG} pool
 * @param {(function(Client):(Promise|void))} executor
 * @returns {Promise}
 */
module.exports.transaction = function transaction (pool, executor) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) return reject(err)

      const rollback = () => client.query('ROLLBACK', (err) => done(err))
      const commit = () => client.query('COMMIT', (err) => done(err))

      client.query('BEGIN', (err) => {
        if (err) return reject(err)

        const result = executor(client)

        const committed = result
          .then(commit)
          .catch(rollback)

        committed.then(() => resolve(result))
      })
    })
  })
}

/**
 *
 * @param {*} pool
 * @param {string} query
 * @param {Array} params
 * @returns {Promise<{}>}
 */
module.exports.queryOne = async function fetchOne (pool, query, params) {
  const result = await pool.query(query, params)

  return result.rows[0]
}

/**
 *
 * @param {*} pool
 * @param {string} query
 * @param {Array} [params]
 * @returns {Promise<Array<{}>>}
 */
module.exports.query = async function fetchMany (pool, query, params = []) {
  const result = await pool.query(query, params)

  return result.rows
}
