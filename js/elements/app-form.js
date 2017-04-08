import { loginAction } from '../actions/login'
import { EventName } from '../data/event'
import { createToastMessage } from './toast-message'
import { registerAction } from '../actions/register'

const actions = {
  'login': loginAction,
  'register': registerAction
}

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

    const data = new FormData(this)
    const action = actions[this.formAction]

    const { error, route } = await action(data)

    if (error) {
      await createToastMessage(error).show()
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
