/**
 *
 * @returns {Promise<{ state: string }>}
 */
export function fetchGameState() {

  return Promise.resolve({ state: 'initial' })

  /* return fetch('/api/game')
    .then((resp) => resp.json()) */
}
