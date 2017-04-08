import { createCategory } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function createCategoryAction (form) {
  const name = form.get('name')

  if (name.trim().length === 0) {
    return { error: 'Die Kategorie darf nicht leer sein' }
  }

  await createCategory(name)

  return {
    route: '/admin/categories'
  }
}
