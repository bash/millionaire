/**
 *
 * @returns {function(*)}
 */
module.exports = function (repository, dataStore) {
  return async (ctx) => {
    const gameId = ctx.session.gameId

    // TODO: remove direct access to repository -> use query instead
    const [game, score] = await Promise.all([
      repository.getGameById(gameId),
      dataStore.getScore(gameId)
    ])

    if (game) {
      ctx.body = Object.assign(game, { state: 'started', score })
    } else {
      ctx.body = { state: 'initial' }
    }
  }
}
