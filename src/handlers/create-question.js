const HttpError = require('../http/http-error')

/**
 *
 * @param {(function(*, *, *))} createQuestion
 * @returns {(function(*):Promise)}
 */
module.exports = function (createQuestion) {
  return async (ctx) => {
    const title = ctx.request.body.title
    const answers = ctx.request.body.answers
    const categoryId = ctx.request.body.category_id

    if (title == null) {
      throw new HttpError(400, { error: 'missing parameter name' })
    }

    if (categoryId == null) {
      throw new HttpError(400, { error: 'missing parameter category_id' })
    }

    if (!Array.isArray(answers)) {
      throw new HttpError(400, { error: 'answers must be an array' })
    }

    // TODO: convert CreateQuestionError to HttpError
    const id = await createQuestion(categoryId, title, answers)

    ctx.body = { id }
  }
}
