import { fetchTemplate } from '../data/template'

const templateName = 'manage-questions'

/**
 *
 * @returns {Loader}
 */
export function questionsLoader () {
  return async () => {
    const [template, questions] = await Promise.all([
      fetchTemplate(templateName),
      Promise.resolve({})
    ])

    // TODO: actually fetch questions

    return {
      templateName,
      template,
      data: { questions }
    }
  }
}
