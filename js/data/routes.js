import { fetchGameState, fetchCategories, fetchCurrentQuestion } from '../fetch'

const fetchRegisterData = () => {
  return fetchCategories()
    .then((categories) => {
      return { categories }
    })
}

const fetchQuestionData = () => {
  return fetchCurrentQuestion()
    .then((question) => {
      return { question }
    })
}

const gameTemplates = {
  initial: { templateName: 'register', fetchData: fetchRegisterData },
  started: { templateName: 'question', fetchData: fetchQuestionData }
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
  '/': () => ({ templateName: 'landing', fetchData: () => {} }),
  '/game': gameResolver
})

export const templateFile = (name) => `/templates/${name}.html`
