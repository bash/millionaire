import { createGame } from '../fetch'

const coffee = ['coffee', 'kaffee', 'kafi']

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function registerAction (form) {
  const name = form.get('name').trim()
  const categories = form.getAll('category')

  if (name.length === 0) {
    return { error: 'Bitte gib einen Namen ein' }
  }

  if (coffee.includes(name.toLowerCase())) {
    return { route: '/coffee' }
  }

  if (categories.length === 0) {
    return { error: 'Bitte wähle mindestens eine Kategorie aus' }
  }

  await createGame(name, categories)

  return {
    route: '/game'
  }
}
