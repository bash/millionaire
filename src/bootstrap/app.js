const Application = require('koa')
const { get, post } = require('koa-route')

const bodyParser = require('koa-bodyparser')
const session = require('../middleware/session')
const errorHandler = require('../errors/error-handler')

const getGame = require('../handlers/get-game')
const getCategories = require('../handlers/get-categories')
const createGame = require('../handlers/create-game')
const getCurrentQuestion = require('../handlers/get-current-question')

const createGameCommand = require('../commands/create-game')
const getCurrentQuestionQuery = require('../queries/get-current-question')

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {Application}
 */
module.exports = function bootstrapApp (repository, dataStore) {
  const app = new Application()

  app.context.onerror = errorHandler

  app.use(session(dataStore))
  app.use(bodyParser())

  app.use(get('/api/game', getGame(repository)))
  app.use(get('/api/categories', getCategories(repository)))
  app.use(post('/api/games', createGame(repository, createGameCommand(repository, dataStore))))
  app.use(get('/api/game/question', getCurrentQuestion(getCurrentQuestionQuery(repository, dataStore))))

  return app
}
