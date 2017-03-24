import { finished } from '../animation'

/**
 *
 * @param {AppView|HTMLElement} landing
 * @param {AppView|HTMLElement} register
 */
export async function landingToRegister(landing, register) {
  const $title = landing.querySelector('.landing-page > .title')
  const $button = landing.querySelector('.landing-page > .button')

  const $header = register.querySelector('.page-header')
  const $content = register.querySelector('.page-content')

  $title.style.zIndex = 1
  $header.style.backgroundColor = 'transparent'
  $header.style.color = 'transparent'
  $content.style.opacity = 0

  const titleBox = $title.getBoundingClientRect()
  const transform = titleBox.top + window.scrollY

  register.show()

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

  landing.hide()

  $header.style.backgroundColor = ''
  $header.style.color = ''
  $content.style.opacity = ''
}
