const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function():Promise<Array>)} getQuestions
 * @returns {(function(*):Promise)}
 */
module.exports = function (getQuestions) {
  return async (ctx) => {
    requireAdmin(ctx)

    ctx.body = await getQuestions()
  }
}
