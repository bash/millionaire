import { EventName } from '../data/event'
import { showToastMessage } from './toast-message'
import { handleError } from '../error'
import { actions } from '../data/actions'

export class AppForm extends window.HTMLFormElement {
  constructor () {
    super()

    this._onSubmit = this._onSubmit.bind(this)
  }

  connectedCallback () {
    this.addEventListener('submit', this._onSubmit)
  }

  disconnectedCallback () {
    this.removeEventListener('submit', this._onSubmit)
  }

  async _onSubmit (event) {
    event.preventDefault()

    try {
      await this._submit()
    } catch (error) {
      handleError(error)
    }
  }

  async _submit () {
    const data = new FormData(this)
    const action = actions[this.formAction]

    const { error, route, toast} = await action(data)

    if (error) {
      await showToastMessage(error)
    }

    if (toast) {
      await showToastMessage(toast)
    }

    if (route) {
      this._redirect(route)
    }
  }

  /**
   *
   * @param {string} route
   * @private
   */
  _redirect (route) {
    this.dispatchEvent(new CustomEvent(EventName.Route, { detail: { route }, bubbles: true }))
  }

  /**
   *
   * @returns {string}
   */
  get formAction () {
    return this.getAttribute('form-action')
  }
}
