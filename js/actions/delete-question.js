import { deleteQuestion } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function deleteQuestionAction (form) {
  const id = form.get('question_id')

  await deleteQuestion(id)

  return {
    route: '/admin/questions'
  }
}
