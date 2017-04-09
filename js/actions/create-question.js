import { createQuestion } from '../fetch'
import { url } from '../helpers/url'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function createQuestionAction (form) {
  const category = form.get('category')
  const title = form.get('title').trim()
  const answers = form.getAll('answer').map((answer) => answer.trim())

  const emptyAnswer = answers.find((answer) => (answer === ''))

  if (title.length === 0) {
    return {
      error: 'Die Frage muss ausgefüllt werden'
    }
  }

  if (emptyAnswer != null) {
    return {
      error: 'Es müssen alle Antworten ausgefüllt werden'
    }
  }

  const { id } = await createQuestion(category, title, answers)

  return {
    route: url`/admin/question/${id}`
  }
}
