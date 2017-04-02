const HttpError = require('../errors/http-error')
const { JokerError } = require('../commands/use-joker')

const convertError = (error) => {
  if (error instanceof JokerError) {
    return Promise.reject(new HttpError(400, { error: error.message }))
  }

  return Promise.reject(error)
}

module.exports = function (_useJoker) {
  const useJoker = (gameId) => _useJoker(gameId).catch(convertError)

  return async (ctx) => {
    const gameId = ctx.session.gameId

    ctx.body = await useJoker(gameId)
  }
}
