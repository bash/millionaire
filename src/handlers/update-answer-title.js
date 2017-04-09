const HttpError = require('../http/http-error')
const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function(*, *))} updateAnswerTitle
 * @returns {(function(*):Promise)}
 */
module.exports = function (updateAnswerTitle) {
  return async (ctx, id) => {
    requireAdmin(ctx)

    const title = ctx.request.body.title

    if (title == null) {
      throw new HttpError(400, { error: 'missing parameter name' })
    }

    // TODO: convert UpdateQuestionError to HttpError
    await updateAnswerTitle(
      id,
      title.trim()
    )

    ctx.body = { updated: true }
  }
}
