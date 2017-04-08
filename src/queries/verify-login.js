const bcrypt = require('bcrypt')

/**
 *
 * @param {string} password
 * @param {string} hash
 * @returns {Promise}
 */
function verifyPassword (password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 *
 * @param {BackendRepository} repository
 * @returns {(function(string, string):Promise<{}>)}
 */
module.exports = function (repository) {
  return async (username, password) => {
    const admin = await repository.getAdminLogin(username)

    if (!admin) {
      return { isValid: false }
    }

    const isValid = await verifyPassword(password, admin.password)

    return { isValid, adminId: admin.id }
  }
}
