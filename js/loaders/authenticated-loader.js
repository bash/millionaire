import { fetchAuthState } from '../fetch'

/**
 *
 * @param {Loader} targetLoader
 * @returns {Loader}
 */
export function authenticatedLoader (targetLoader) {
  return async (...args) => {
    const { authenticated } = await fetchAuthState()

    if (!authenticated) {
      return { redirect: '/login' }
    }

    return targetLoader(...args)
  }
}
