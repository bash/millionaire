const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function(string))} deleteQuestion
 * @returns {(function(*, string):Promise)}
 */
module.exports = function (deleteQuestion) {
  return async (ctx, questionId) => {
    requireAdmin(ctx)

    await deleteQuestion(questionId)

    ctx.body = { deleted: true }
  }
}
