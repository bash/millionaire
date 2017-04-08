/**
 *
 * @param {string} url
 * @param {FetchInit} [options]
 * @returns {Promise<{}|Array>}
 */
const fetch = (url, options = {}) => {
  return window.fetch(`/api${url}`, Object.assign({ credentials: 'include' }, options))
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
export function fetchCategories () {
  return fetch('/categories')
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
  return fetch(`/games/${encodeURIComponent(gameId)}`)
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
  return fetch(`/scoreboard/${encodeURIComponent(id)}/hidden`, { method: 'POST' })
}
