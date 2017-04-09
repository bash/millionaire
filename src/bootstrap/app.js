const Application = require('koa')
const { del, get, post } = require('koa-route')

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
const hideScoreboardEntry = require('../handlers/hide-scoreboard-entry')
const getQuestions = require('../handlers/get-questions')
const getQuestion = require('../handlers/get-question')
const deleteQuestion = require('../handlers/delete-question')
const createQuestion = require('../handlers/create-question')

const _createGameCommand = require('../commands/create-game')
const _getCurrentQuestionQuery = require('../queries/get-current-question')
const { useJoker: _useJokerCommand } = require('../commands/use-joker')
const { answerQuestion: _answerQuestionCommand } = require('../commands/answer-question')
const _finishGameCommand = require('../commands/finish-game')
const _verifyLogin = require('../queries/verify-login')
const _createCategoryCommand = require('../commands/create-category')
const _getScoreboardQuery = require('../queries/get-scoreboard')
const _hideScoreboardEntryCommand = require('../commands/hide-scoreboard-entry')
const _getQuestionsQuery = require('../queries/get-questions')
const _getQuestionQuery = require('../queries/get-question')
const _deleteQuestionCommand = require('../commands/delete-question')
const _createQuestionCommand = require('../commands/create-question')

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
  const hideScoreboardEntryCommand = _hideScoreboardEntryCommand(backendRepository)
  const getQuestionsQuery = _getQuestionsQuery(backendRepository)
  const getQuestionQuery = _getQuestionQuery(backendRepository)
  const deleteQuestionCommand = _deleteQuestionCommand(backendRepository)
  const createQuestionCommand = _createQuestionCommand(repository, backendRepository)

  const app = new Application()

  app.context.onerror = errorHandler

  app.use(session(dataStore))
  app.use(bodyParser())

  app.use(get('/api/game', getCurrentGame(repository, dataStore)))
  app.use(get('/api/categories', getCategories(repository)))
  app.use(post('/api/games', createGame(repository, createGameCommand)))
  app.use(get('/api/games/:id([0-9]+)', getGame(repository)))
  app.use(get('/api/game/question', getCurrentQuestion(getCurrentQuestionQuery)))
  app.use(post('/api/game/joker', useJoker(useJokerCommand)))
  app.use(post('/api/game/answer', answerQuestion(answerQuestionCommand)))
  app.use(post('/api/game/finish', finishGame(finishGameCommand)))
  app.use(post('/api/login', login(verifyLogin)))
  app.use(get('/api/auth', getAuthState()))
  app.use(post('/api/categories', createCategory(createCategoryCommand)))
  app.use(get('/api/scoreboard', getScoreboard(getScoreboardQuery)))
  app.use(post('/api/scoreboard/:id([0-9]+)/hidden', hideScoreboardEntry(hideScoreboardEntryCommand)))
  app.use(get('/api/questions', getQuestions(getQuestionsQuery)))
  app.use(get('/api/questions/:id([0-9]+)', getQuestion(getQuestionQuery)))
  app.use(del('/api/questions/:id([0-9]+)', deleteQuestion(deleteQuestionCommand)))
  app.use(post('/api/questions', createQuestion(createQuestionCommand)))

  return app
}
