const HttpError = require('../http/http-error')

/**
 *
 * @param {(function(string, string):Promise)} verifyLogin
 * @returns {(function(*):Promise)}
 */
module.exports = function (verifyLogin) {
  return async (ctx) => {
    const { username, password } = ctx.request.body

    if (username == null) {
      throw new HttpError(400, { error: 'missing field username' })
    }

    if (password == null) {
      throw new HttpError(400, { error: 'missing field username' })
    }

    const { isValid, adminId } = await verifyLogin(username, password)

    if (isValid) {
      ctx.session.adminId = adminId
    }

    ctx.body = { is_valid: isValid }
  }
}
