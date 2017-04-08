const Application = require('koa')
const { get, post } = require('koa-route')

const bodyParser = require('koa-bodyparser')
const session = require('../middlewares/session')
const errorHandler = require('../http/error-handler')

const getGame = require('../handlers/get-game')
const getCurrentGame = require('../handlers/get-current-game')
const getCategories = require('../handlers/get-categories')
const createGame = require('../handlers/create-game')
const getCurrentQuestion = require('../handlers/get-current-question')
const useJoker = require('../handlers/use-joker')
const answerQuestion = require('../handlers/answer-question')
const finishGame = require('../handlers/finish-game')
const login = require('../handlers/login')
const getAuthState = require('../handlers/get-auth-state')
const createCategory = require('../handlers/create-category')
const getScoreboard = require('../handlers/get-scoreboard')

const _createGameCommand = require('../commands/create-game')
const _getCurrentQuestionQuery = require('../queries/get-current-question')
const { useJoker: _useJokerCommand } = require('../commands/use-joker')
const { answerQuestion: _answerQuestionCommand } = require('../commands/answer-question')
const _finishGameCommand = require('../commands/finish-game')
const _verifyLogin = require('../queries/verify-login')
const _createCategoryCommand = require('../commands/create-category')
const _getScoreboardQuery = require('../queries/get-scoreboard')

/**
 *
 * @param {Repository} repository
 * @param {BackendRepository} backendRepository
 * @param {DataStore} dataStore
 * @returns {Application}
 */
module.exports = function bootstrapApp (repository, backendRepository, dataStore) {
  const createGameCommand = _createGameCommand(repository, dataStore)
  const getCurrentQuestionQuery = _getCurrentQuestionQuery(repository, dataStore)
  const useJokerCommand = _useJokerCommand(repository, dataStore)
  const finishGameCommand = _finishGameCommand(repository, dataStore)
  const answerQuestionCommand = _answerQuestionCommand(repository, dataStore, finishGameCommand)
  const verifyLogin = _verifyLogin(backendRepository)
  const createCategoryCommand = _createCategoryCommand(backendRepository)
  const getScoreboardQuery = _getScoreboardQuery(repository)

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
  app.use(post('/api/game/finish', finishGame(finishGameCommand)))
  app.use(post('/api/login', login(verifyLogin)))
  app.use(get('/api/auth', getAuthState()))
  app.use(post('/api/categories', createCategory(createCategoryCommand)))
  app.use(get('/api/scoreboard', getScoreboard(getScoreboardQuery)))

  return app
}
