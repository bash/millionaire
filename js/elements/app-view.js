import { landingToRegister } from '../transitions/landing-to-register'

const transitions = {
  'landing:register': landingToRegister
}

export class AppView extends HTMLElement {
  constructor (templateName, html) {
    super()

    this.templateName = templateName
    this.innerHTML = html

    this.hide()
  }

  /**
   *
   * @returns {string}
   */
  get templateName () {
    return this.getAttribute('template-name')
  }

  /**
   *
   * @param {string} templateName
   */
  set templateName (templateName) {
    this.setAttribute('template-name', templateName)
  }

  show () {
    this.style.opacity = ''
  }

  hide () {
    this.style.opacity = '0'
  }

  /**
   *
   * @param {AppView} view
   */
  async transitionInto (view) {
    const transition = transitions[ `${this.templateName}:${view.templateName}` ]

    if (transition) {
      return transition(this, view)
    }

    this.hide()
    view.show()
  }
}
