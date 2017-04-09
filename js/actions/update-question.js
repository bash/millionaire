import { url } from '../helpers/url'
import { updateAnswer, updateQuestion } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Array}
 */
const getAnswers = (form) => {
  const titles = form.getAll('answer_title').map((answer) => answer.trim())
  const ids = form.getAll('answer_id')

  return ids.map((id, i) => {
    return { id, title: titles[i] }
  })
}

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function updateQuestionAction (form) {
  const category = form.get('category')
  const title = form.get('title').trim()
  const questionId = form.get('question_id')
  const answers = getAnswers(form)

  const emptyAnswer = answers.find(({ title }) => (title === ''))

  if (title.length === 0) {
    return { error: 'Die Frage muss ausgefüllt werden' }
  }

  if (emptyAnswer != null) {
    return { error: 'Es müssen alle Antworten ausgefüllt werden' }
  }

  await Promise.all([
    updateQuestion(questionId, category, title),
    ...answers.map(({ id, title}) => updateAnswer(id, title))
  ])

  return {
    toast: 'Gespeichert'
  }
}
