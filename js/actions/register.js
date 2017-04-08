import { createGame } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function registerAction (form) {
  const name = form.get('name')
  const categories = form.getAll('category')

  if (!name) {
    return { error: 'Bitte gib einen Namen ein' }
  }

  if (categories.length === 0) {
    return { error: 'Bitte wähle mindestens eine Kategorie aus' }
  }

  await createGame(name, categories)

  return {
    route: '/game'
  }
}
