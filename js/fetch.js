import { url } from './helpers/url'

/**
 *
 * @param {Response} resp
 * @returns {Response|Promise}
 */
const rejectHttpError = (resp) => {
  if (resp.ok) {
    return resp
  } else {
    return Promise.reject(new Error(`received http error code`))
  }
}

/**
 *
 * @param {string} url
 * @param {FetchInit} [options]
 * @returns {Promise<{}|Array>}
 */
const fetch = (url, options = {}) => {
  return window.fetch(`/api${url}`, Object.assign({ credentials: 'include' }, options))
    .then((resp) => rejectHttpError(resp))
    .then((resp) => resp.json())
}

/**
 *
 * @param {{}} params
 * @returns {URLSearchParams}
 */
const params = (params) => {
  const result = new window.URLSearchParams()

  // TODO: this method is somewhat ugly -> clean up
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => result.append(`${key}[]`, item))
    } else {
      result.append(key, value)
    }
  })

  return result
}

/**
 *
 * @returns {Promise<{ state: string }>}
 */
export function fetchCurrentGame () {
  return fetch('/game')
}

/**
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export function fetchCategories ({ hasQuestions = false} = {}) {
  const query = hasQuestions ? '?has_questions=1' : ''

  return fetch(`/categories${query}`)
}

/**
 *
 * @param {string} name
 * @param {Array<string>} categories
 * @returns {Promise}
 */
export function createGame (name, categories) {
  const body = params({ name, categories })

  return fetch('/games', { method: 'POST', body })
}

/**
 *
 * @returns {Promise<{}>}
 */
export function fetchCurrentQuestion () {
  return fetch('/game/question')
}

/**
 *
 * @returns {Promise<Array<{}>>}
 */
export function useJoker () {
  return fetch('/game/joker', { method: 'POST' })
}

/**
 *
 * @param {string} answerId
 * @returns {Promise<Array<{}>>}
 */
export function answerQuestion (answerId) {
  const body = params({ answer_id: answerId })

  return fetch('/game/answer', { method: 'POST', body })
    .then(({ is_correct, is_finished, correct_answer_id }) => {
      return { isCorrect: is_correct, isFinished: is_finished, correctAnswerId: correct_answer_id }
    })
}

/**
 *
 * @returns {Promise}
 */
export function finishGame () {
  return fetch(`/game/finish`, { method: 'POST' })
}

/**
 *
 * @param {string} gameId
 */
export function fetchGame (gameId) {
  return fetch(url`/games/${gameId}`)
}

/**
 *
 * @param username
 * @param password
 */
export function login (username, password) {
  const body = params({ username, password })

  return fetch('/login', { method: 'POST', body })
    .then(({ is_valid }) => {
      return { isValid: is_valid }
    })
}

/**
 *
 * @returns {Promise<{ authenticated: boolean }>}
 */
export function fetchAuthState () {
  return fetch('/auth')
}

/**
 *
 * @param {string} name
 * @returns {Promise}
 */
export function createCategory (name) {
  const body = params({ name })

  return fetch('/categories', { method: 'POST', body })
}

/**
 *
 * @returns {Promise}
 */
export function fetchScoreboard () {
  return fetch('/scoreboard')
}

/**
 *
 * @param {string} id
 * @returns {Promise}
 */
export function hideScoreboardEntry (id) {
  return fetch(url`/scoreboard/${id}/hidden`, { method: 'POST' })
}

/**
 *
 * @returns {Promise<Array>}
 */
export function fetchQuestions () {
  return fetch('/questions')
}

/**
 *
 * @returns {Promise<{}>}
 */
export function fetchQuestion (id) {
  return fetch(url`/questions/${id}`)
}

/**
 *
 * @param {string} id
 * @returns {Promise<{}>}
 */
export function deleteQuestion (id) {
  return fetch(url`/questions/${id}`, { method: 'DELETE' })
}

/**
 *
 * @param {string} category
 * @param {string} title
 * @param {Array<string>} answers
 */
export function createQuestion (category, title, answers) {
  const body = params({ category_id: category, title, answers })

  return fetch('/questions', { method: 'POST', body })
}

/**
 *
 * @param {string} id
 * @param {string} category
 * @param {string} title
 */
export function updateQuestion (id, category, title) {
  const body = params({ category_id: category, title })

  return fetch(url`/questions/${id}`, { method: 'PATCH', body })
}

/**
 *
 * @param {string} id
 * @param {string} title
 */
export function updateAnswer (id, title) {
  const body = params({ title })

  return fetch(url`/answers/${id}/title`, { method: 'PUT', body })
}

