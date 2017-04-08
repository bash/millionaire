import { showInternalErrorToast } from './elements/toast-message'

/**
 *
 * @param {Error} error
 */
export function handleError (error) {
  console.error(error)

  // noinspection JSIgnoredPromiseFromCall
  showInternalErrorToast()
}
