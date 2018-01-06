import { finished } from '../animation'

const getFontSize = ($element) => {
  return Number.parseFloat(getComputedStyle($element).fontSize)
}

/**
 *
 * @param {AppView|HTMLElement} landing
 * @param {AppView|HTMLElement} register
 */
export async function landingToRegister (landing, register) {
  const $title = landing.querySelector('.landing-page > .title')
  const $button = landing.querySelector('.landing-page > .button')
  const $links = landing.querySelector('.landing-page > .links')

  const $header = register.querySelector('.page-header')
  const $headerTitle = $header.querySelector('a')
  const $content = register.querySelector('.page-content')

  $title.style.zIndex = 1
  $title.style.transformOrigin = 'top'
  $header.style.backgroundColor = 'transparent'
  $header.style.color = 'transparent'
  $content.style.opacity = 0

  const titleBox = $title.getBoundingClientRect()
  const headerBox = $header.getBoundingClientRect()
  const headerTitleBox = $headerTitle.getBoundingClientRect()

  const targetFontSize = getFontSize($headerTitle)
  const currentFontSize = getFontSize($title)

  const scale = targetFontSize / currentFontSize

  const moveUp = titleBox.top + window.scrollY
  const moveToCenter = (headerBox.height - titleBox.height * scale) / 2

  register.show()

  const fadeOut = [
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: 100,
      fill: 'forwards',
      easing: 'ease'
    }
  ]

  const buttonAnimation = $button.animate(...fadeOut)
  const linksAnimation = $links.animate(...fadeOut)

  await Promise.all([
    finished(buttonAnimation),
    finished(linksAnimation)
  ])

  const titleAnimation = $title.animate(
    [
      { transform: 'none' },
      { transform: `translateY(-${moveUp}px) translateY(${moveToCenter}px) scale(${scale})` }
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
