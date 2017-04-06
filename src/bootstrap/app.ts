import Application = require('koa')
import route = require('koa-route')
import bodyParser = require('koa-bodyparser')

import { session } from '../middleware/session'
import errorHandler = require('../http/error-handler')

import getGame = require('../handlers/get-game')
import getCurrentGame = require('../handlers/get-current-game')
import getCategories = require('../handlers/get-categories')
import createGame = require('../handlers/create-game')
import getCurrentQuestion = require('../handlers/get-current-question')
import useJoker = require('../handlers/use-joker')
import answerQuestion = require('../handlers/answer-question')
import finishGame = require('../handlers/finish-game')

import _createGameCommand = require('../commands/create-game')
import _getCurrentQuestionQuery = require('../queries/get-current-question')
import { useJoker as _useJokerCommand  } from '../commands/use-joker'
import { answerQuestion as _answerQuestionCommand } from '../commands/answer-question'
import _finishGameCommand = require('../commands/finish-game')

const { get, post } = route

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {Application}
 */
export function bootstrapApp (repository, dataStore) {
  const createGameCommand = _createGameCommand(repository, dataStore)
  const getCurrentQuestionQuery = _getCurrentQuestionQuery(repository, dataStore)
  const useJokerCommand = _useJokerCommand(repository, dataStore)
  const finishGameCommand = _finishGameCommand(repository, dataStore)
  const answerQuestionCommand = _answerQuestionCommand(repository, dataStore, finishGameCommand)

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

  return app
}
