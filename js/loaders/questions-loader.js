import { fetchTemplate } from '../data/template'
import { fetchQuestions } from '../fetch'

const templateName = 'manage-questions'

/**
 *
 * @returns {Loader}
 */

export function questionsLoader () {
  return async () => {
    const [template, questions] = await Promise.all([
      fetchTemplate(templateName),
      fetchQuestions()
    ])

    return {
      templateName,
      template,
      data: { questions }
    }
  }
}
