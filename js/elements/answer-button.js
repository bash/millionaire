import { EventName } from '../data/event'

export class AnswerButton extends HTMLButtonElement {
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
    this.dispatchEvent(new CustomEvent(EventName.SelectAnswer, {
      bubbles: true,
      detail: { answerId: this.answerId }
    }))
  }

  setActive () {
    this.classList.add('-active')
  }

  /**
   *
   * @param {boolean} isCorrect
   */
  setStatus (isCorrect) {
    this._icon.src = `/icons/${isCorrect ? 'check' : 'cross'}.svg`

    this._icon.addEventListener('load', () => {
      window.setTimeout(() => {
        this._icon.classList.add('-visible')
      })
    })
  }

  /**
   *
   * @returns {Element}
   * @private
   */
  get _icon () {
    return this.querySelector(':scope > .icon')
  }

  /**
   *
   * @returns {string}
   */
  get answerId () {
    return this.getAttribute('answer-id')
  }

  /**
   *
   * @param {string} answerId
   * @returns {string}
   */
  static uniqueSelector (answerId) {
    return `button[is="answer-button"][answer-id="${answerId}"]`
  }
}
