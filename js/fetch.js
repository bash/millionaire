/**
 *
 * @returns {Promise<{ state: string }>}
 */
export function fetchGameState() {
  return fetch('/api/game')
    .then((resp) => resp.json())
}
