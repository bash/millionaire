import { login } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function loginAction (form) {
  const { isValid } = await login(
    form.get('username'),
    form.get('password')
  )

  if (!isValid) {
    return { error: 'Die eingegebenen Zugangsdaten sind nicht gültig' }
  }

  return {
    route: '/admin'
  }
}
