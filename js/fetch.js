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
export function fetchGameState () {
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

  return window.fetch('/api/games', { method: 'POST', credentials: 'include', body })
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
