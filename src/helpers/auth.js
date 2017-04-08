const HttpError = require('../http/http-error')

module.exports.requireAdmin = (ctx) => {
  const adminId = ctx.session.adminId

  if (!adminId) {
    throw new HttpError(403, 'access denied')
  }
}
