import { EventName } from '../event'

export class AppLink extends HTMLAnchorElement {

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
    console.log('click')
    event.preventDefault()

    this.dispatchEvent(new CustomEvent(EventName.Route, { bubbles: true, detail: { route: this.pathname } }))
  }
}
