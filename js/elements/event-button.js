export class EventButton extends HTMLButtonElement {
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
   * @private
   */
  _onClick () {
    this.dispatchEvent(new CustomEvent(this.eventName, { bubbles: true }))
  }

  /**
   *
   * @returns {string}
   */
  get eventName () {
    return this.getAttribute('event-name')
  }
}
