import { fetchTemplate } from '../data/template'
import { fetchCategories, fetchQuestion } from '../fetch'

const templateName = 'edit-question'

/**
 *
 * @returns {Loader}
 */
export function questionLoader () {
  return async ({ id }) => {
    const [template, question, _categories] = await Promise.all([
      fetchTemplate(templateName),
      fetchQuestion(id),
      fetchCategories()
    ])

    const categories = _categories.map((category) => {
      return Object.assign(category, {
        isActive: (category.id === question.category.id)
      })
    })

    const answers = question.answers.map((answer, i) => {
      return Object.assign(answer, {
        i,
        n: (i + 1)
      })
    })

    return {
      templateName,
      template,
      data: { question, categories, answers }
    }
  }
}
