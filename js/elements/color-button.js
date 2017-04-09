export class ColorButton extends window.HTMLElement {
  constructor () {
    super()

    this._onClick = this._onClick.bind(this)

    this.style.setProperty('--color', this.color)
  }

  connectedCallback () {
    this.addEventListener('click', this._onClick)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this._onClick)
  }

  _onClick () {
    window.localStorage.setItem('color', this.color)

    document.body.classList.add('-color-transition')

    window.setTimeout(() => {
      document.documentElement.style.setProperty('--brand-color', this.color)

      window.setTimeout(() => {
        document.body.classList.remove('-color-transition')
      }, 125)
    })
  }

  get color () {
    return this.getAttribute('color')
  }
}
