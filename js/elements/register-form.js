import { createGame } from '../fetch'
import { EventName } from '../data/event'

export class RegisterForm extends HTMLElement {
  constructor () {
    super()

    this._onButtonClick = this._onButtonClick.bind(this)
  }

  connectedCallback () {
    this.querySelector('button').addEventListener('click', this._onButtonClick)
  }

  async _onButtonClick () {
    const name = this._getName()
    const categories = this._getCategories()

    await createGame(name, categories)

    this.dispatchEvent(new CustomEvent(EventName.ReloadRoute, { bubbles: true }))
  }

  /**
   *
   * @returns {string}
   * @private
   */
  _getName () {
    return this.querySelector('[name="name"]').value
  }

  /**
   *
   * @returns {Array<string>}
   * @private
   */
  _getCategories () {
    return Array.from(this.querySelectorAll('[is="category-pick"]'))
      .filter(($category) => $category.checked)
      .map(($category) => $category.value)
  }
}
