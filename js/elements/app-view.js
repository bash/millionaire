import { landingToRegister } from '../transitions/landing-to-register'

const transitions = {
  'landing:register': landingToRegister,
  'landing:question': landingToRegister,
  'landing:login': landingToRegister,
  'landing:score': landingToRegister
}

export class AppView extends window.HTMLElement {
  constructor (templateName, html) {
    super()

    if (templateName) {
      this.templateName = templateName
    }

    if (html) {
      this.innerHTML = html
    }

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
    const transition = transitions[`${this.templateName}:${view.templateName}`]

    if (transition) {
      await transition(this, view)
    } else {
      this.hide()
      view.show()
    }

    // TODO: verify if this is a good idea
    window.scrollTo(0, 0)
  }
}
