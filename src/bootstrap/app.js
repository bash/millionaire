const Application = require('koa')
const { get, post } = require('koa-route')

const bodyParser = require('koa-bodyparser')
const session = require('../middleware/session')
const errorHandler = require('../errors/error-handler')

const getGame = require('../handlers/get-game')
const getCategories = require('../handlers/get-categories')
const createGame = require('../handlers/create-game')
const getCurrentQuestion = require('../handlers/get-current-question')
const useJoker = require('../handlers/use-joker')

const _createGameCommand = require('../commands/create-game')
const _getCurrentQuestionQuery = require('../queries/get-current-question')
const { useJoker: _useJokerCommand } = require('../commands/use-joker')

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {Application}
 */
module.exports = function bootstrapApp (repository, dataStore) {
  const createGameCommand = _createGameCommand(repository, dataStore)
  const getCurrentQuestionQuery = _getCurrentQuestionQuery(repository, dataStore)
  const useJokerCommand = _useJokerCommand(repository, dataStore)

  const app = new Application()

  app.context.onerror = errorHandler

  app.use(session(dataStore))
  app.use(bodyParser())

  app.use(get('/api/game', getGame(repository)))
  app.use(get('/api/categories', getCategories(repository)))
  app.use(post('/api/games', createGame(repository, createGameCommand)))
  app.use(get('/api/game/question', getCurrentQuestion(getCurrentQuestionQuery)))
  app.use(post('/api/game/joker', useJoker(useJokerCommand)))

  return app
}
