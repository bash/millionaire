import { fetchTemplate } from '../data/template'
import { fetchCategories } from '../fetch'

const templateName = 'new-question'

/**
 *
 * @returns {Loader}
 */
export function newQuestionLoader () {
  return async () => {
    const [template, categories] = await Promise.all([
      fetchTemplate(templateName),
      fetchCategories()
    ])

    return {
      templateName,
      template,
      data: { categories }
    }
  }
}
