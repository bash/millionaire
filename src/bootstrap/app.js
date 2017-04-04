const Application = require('koa')
const { get, post } = require('koa-route')

const bodyParser = require('koa-bodyparser')
const session = require('../middleware/session')
const errorHandler = require('../errors/error-handler')

const getGame = require('../handlers/get-game')
const getCurrentGame = require('../handlers/get-current-game')
const getCategories = require('../handlers/get-categories')
const createGame = require('../handlers/create-game')
const getCurrentQuestion = require('../handlers/get-current-question')
const useJoker = require('../handlers/use-joker')
const answerQuestion = require('../handlers/answer-question')

const _createGameCommand = require('../commands/create-game')
const _getCurrentQuestionQuery = require('../queries/get-current-question')
const { useJoker: _useJokerCommand } = require('../commands/use-joker')
const { answerQuestion: _answerQuestionCommand } = require('../commands/answer-question')
const _finishGame = require('../commands/finish-game')

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
  const finishGame = _finishGame(repository, dataStore)
  const answerQuestionCommand = _answerQuestionCommand(repository, dataStore, finishGame)

  const app = new Application()

  app.context.onerror = errorHandler

  app.use(session(dataStore))
  app.use(bodyParser())

  app.use(get('/api/game', getCurrentGame(repository, dataStore)))
  app.use(get('/api/categories', getCategories(repository)))
  app.use(post('/api/games', createGame(repository, createGameCommand)))
  app.use(get('/api/games/:id', getGame(repository)))
  app.use(get('/api/game/question', getCurrentQuestion(getCurrentQuestionQuery)))
  app.use(post('/api/game/joker', useJoker(useJokerCommand)))
  app.use(post('/api/game/answer', answerQuestion(answerQuestionCommand)))

  return app
}
