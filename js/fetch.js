/**
 *
 * @returns {Promise<{ state: string }>}
 */
export function fetchGameState() {
  return fetch('/api/game')
    .then((resp) => resp.json())
}

/**
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export function fetchCategories() {
  return fetch('/api/categories')
    .then((resp) => resp.json())
}
