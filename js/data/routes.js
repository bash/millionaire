import { fetchGameState } from '../fetch'

const gameTemplates = {
  initial: 'register',
  started: 'question'
}

const gameResolver = () => {
  const state = fetchGameState()
    .then((game) => game.state)

  const route = state
    .then((state) => gameTemplates[state])

  return route
}

/**
 *
 * @type {{}}
 */
export const routes = Object.freeze({
  '/': () => 'landing',
  '/game': gameResolver
})

export const templateFile = (name) => `/templates/${name}.html`
