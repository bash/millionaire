export class AppHeader extends window.HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    const headerTemplate = document.getElementById('header-template')
    const header = document.importNode(headerTemplate.content, true)

    this.appendChild(header)
  }
}
