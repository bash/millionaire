import { finished } from '../animation'

const delay = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds)
})

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

    if (view.templateName !== 'register') {
      this.hide()
      view.show()
      return
    }

    const $title = this.querySelector('.landing-page > .title')
    const $button = this.querySelector('.landing-page > .button')

    const $header = view.querySelector('.page-header')
    const $content = view.querySelector('.page-content')

    const titleBox = $title.getBoundingClientRect()
    const transform = titleBox.top + window.scrollY

    const buttonAnimation = $button.animate(
      [
        { opacity: 1 },
        { opacity: 0 }
      ],
      {
        duration: 100,
        fill: 'forwards',
        easing: 'ease'
      }
    )

    await finished(buttonAnimation)

    const titleAnimation = $title.animate(
      [
        {
          fontSize: '90px',
          padding: '0',
          transform: 'none'
        },
        {
          fontSize: '36px',
          padding: '25px',
          transform: `translateY(-${transform}px)`
        }
      ],
      {
        duration: 300,
        fill: 'forwards',
        easing: 'ease-in-out'
      }
    )

    view.show()
    $header.style.opacity = 0
    $content.style.opacity = 0

    const contentAnimation = $content.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: 400,
        delay: 150,
        fill: 'forwards',
        easing: 'ease'
      }
    )

    await finished(titleAnimation)

    const headerAnimation = $title.animate(
      [
        {
          backgroundColor: 'transparent',
          color: 'currentColor'
        },
        {
          backgroundColor: '#44587B',
          color: '#fff'
        }
      ],
      {
        duration: 200,
        fill: 'forwards',
        ease: 'ease-in'
      }
    )

    await Promise.all([
      finished(headerAnimation),
      finished(contentAnimation)
    ])

    this.hide()
    $header.style.opacity = ''
    $content.style.opacity = ''
  }
}
