export class ColorButtons extends window.HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    const template = document.getElementById('color-buttons-template')
    const content = document.importNode(template.content, true)

    this.appendChild(content)
  }
}
