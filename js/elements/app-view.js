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

    $title.style.zIndex = 1
    $header.style.backgroundColor = 'transparent'
    $header.style.color = 'transparent'
    $content.style.opacity = 0

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
        { transform: 'none' },
        { transform: `translateY(-${transform}px) scale(.4) translateY(-${transform * 0.4 / 2}px) translateY(4px)` }
      ],
      {
        duration: 300,
        fill: 'forwards',
        easing: 'ease-in-out'
      }
    )

    view.show()

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

    const headerTextAnimation = $title.animate(
      [
        { color: 'currentColor' },
        { color: '#fff' }
      ],
      {
        duration: 200,
        fill: 'forwards',
        ease: 'ease-in'
      }
    )

    const headerBackgroundAnimation = $header.animate(
      [
        { backgroundColor: 'transparent' },
        { backgroundColor: 'var(--brand-color)' }
      ],
      {
        duration: 200,
        fill: 'forwards',
        ease: 'ease-in'
      }
    )

    await Promise.all([
      finished(headerTextAnimation),
      finished(headerBackgroundAnimation),
      finished(contentAnimation)
    ])

    this.hide()

    $header.style.backgroundColor = ''
    $header.style.color = ''
    $content.style.opacity = ''
  }
}
