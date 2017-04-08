const HttpError = require('../http/http-error')
const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function(string))} createCategory
 * @returns {(function(*):Promise)}
 */
module.exports = function (createCategory) {
  return async (ctx) => {
    requireAdmin(ctx)

    const name = ctx.request.body.name ? ctx.request.body.name.trim() : null

    if (name == null) {
      throw new HttpError(400, 'parameter name missing')
    }

    // TODO: convert CreateCategoryError to HttpError
    const id = await createCategory(name)

    ctx.body = { id, name }
  }
}
