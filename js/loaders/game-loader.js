import { fetchTemplate } from '../data/template'
import { fetchCategories, fetchCurrentQuestion, fetchCurrentGame } from '../fetch'

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

/**
 *
 * @returns {function():Promise<{ templateName: string, template: string, data: {} }>}
 */
export function gameLoader () {
  return () => {
    const game = fetchCurrentGame()
    const state = game.then(({ state }) => state)

    const route = state
      .then((state) => gameTemplates[state])

    const template = route
      .then(({ templateName }) => fetchTemplate(templateName))

    const templateData = route
      .then(({ fetchData }) => fetchData())

    const data = Promise.all([game, templateData])
      .then(([game, templateData]) => Object.assign(templateData, { game }))

    return Promise.all([route, template, data])
      .then(([route, template, data]) => {
        return { template, data, templateName: route.templateName }
      })
  }
}
