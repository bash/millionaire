import { EventName } from '../data/event'

export class AppLink extends window.HTMLAnchorElement {
  constructor () {
    super()

    this._onClick = this._onClick.bind(this)
  }

  connectedCallback () {
    this.addEventListener('click', this._onClick)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this._onClick)
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onClick (event) {
    event.preventDefault()

    this.dispatchEvent(new window.CustomEvent(EventName.Route, { bubbles: true, detail: { route: this.pathname } }))
  }
}
