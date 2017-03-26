/**
 *
 * @returns {Promise<{ state: string }>}
 */
export function fetchGameState () {
  return window.fetch('/api/game')
    .then((resp) => resp.json())
}

/**
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export function fetchCategories () {
  return window.fetch('/api/categories')
    .then((resp) => resp.json())
}
