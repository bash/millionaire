const Method = Object.freeze({
  POST: 'POST'
})

/**
 *
 * @param {Array<string>} params
 * @returns {URLSearchParams}
 */
const buildParams = (...params) => {
  const result = new window.URLSearchParams()

  // TODO: this method is somewhat ugly -> clean up
  params.forEach(([key, value]) => {
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
  return window.fetch('/api/game', { credentials: 'include' })
    .then((resp) => resp.json())
}

/**
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export function fetchCategories () {
  return window.fetch('/api/categories', { credentials: 'include' })
    .then((resp) => resp.json())
}

/**
 *
 * @param {string} name
 * @param {Array<string>} categories
 * @returns {Promise}
 */
export function createGame (name, categories) {
  const body = buildParams(['name', name], ['categories', categories])

  return window.fetch('/api/games', { method: Method.POST, credentials: 'include', body })
    .then((resp) => resp.json())
}

/**
 *
 * @returns {Promise<{}>}
 */
export function fetchCurrentQuestion () {
  return window.fetch('/api/game/question', { credentials: 'include' })
    .then((resp) => resp.json())
}

/**
 *
 * @returns {Promise<Array<{}>>}
 */
export function useJoker () {
  return window.fetch('/api/game/joker', { method: Method.POST, credentials: 'include' })
    .then((resp) => resp.json())
}

/**
 *
 * @param {string} answerId
 * @returns {Promise<Array<{}>>}
 */
export function answerQuestion (answerId) {
  const body = buildParams(['answer_id', answerId])

  return window.fetch('/api/game/answer', { method: Method.POST, credentials: 'include', body })
    .then((resp) => resp.json())
    .then(({ is_correct, is_finished, correct_answer_id }) => {
      return { isCorrect: is_correct, isFinished: is_finished, correctAnswerId: correct_answer_id }
    })
}

/**
 *
 * @returns {Promise}
 */
export function finishGame () {
  return window.fetch(`/api/game/finish`, { method: Method.POST, credentials: 'include' })
    .then((resp) => resp.json())
}

/**
 *
 * @param {string} gameId
 */
export function fetchGame (gameId) {
  return window.fetch(`/api/games/${encodeURIComponent(gameId)}`, { credentials: 'include' })
    .then((resp) => resp.json())
}
