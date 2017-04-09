const HttpError = require('../http/http-error')
const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function(*, *, *))} updateQuestion
 * @returns {(function(*):Promise)}
 */
module.exports = function (updateQuestion) {
  return async (ctx, id) => {
    requireAdmin(ctx)

    const title = ctx.request.body.title
    const categoryId = ctx.request.body.category_id

    if (title == null) {
      throw new HttpError(400, { error: 'missing parameter name' })
    }

    if (categoryId == null) {
      throw new HttpError(400, { error: 'missing parameter category_id' })
    }

    // TODO: convert UpdateQuestionError to HttpError
    await updateQuestion(
      id,
      categoryId,
      title.trim()
    )

    ctx.body = { updated: true }
  }
}
