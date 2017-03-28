const HttpError = require('../errors/http-error')

/**
 *
 * @type {RegExp}
 */
const NAME_REGEX = /^[\w\-]+$/

/**
 *
 * @param {Repository} repository
 * @returns {(function(*):Promise)}
 */
module.exports = function (repository) {
  return async (ctx) => {
    const name = ctx.request.body.name
    const categories = ctx.request.body.categories

    if (!name || !NAME_REGEX.test(name)) {
      throw new HttpError(400, { error: 'invalid name' })
    }

    if (!Array.isArray(categories)) {
      throw new HttpError(400, { error: 'categories must be an array' })
    }

    for (let category of categories) {
      const hasCategory = await repository.hasCategory(category)

      if (!hasCategory) {
        throw new HttpError(400, { error: `invalid category ${category}` })
      }
    }

    const gameId = await repository.createGame(name, categories)

    ctx.session.gameId = gameId

    ctx.body = { 'game_id': gameId }
  }
}
