const { requireAdmin } = require('../helpers/auth')
const HttpError = require('../http/http-error')

/**
 *
 * @param {(function(string):Promise<Array>)} getQuestion
 * @returns {(function(*, string):Promise)}
 */
module.exports = function (getQuestion) {
  return async (ctx, questionId) => {
    requireAdmin(ctx)

    const question = await getQuestion(questionId)

    if (question == null) {
      throw new HttpError(404, { error: 'not found' })
    }

    ctx.body = question
  }
}
