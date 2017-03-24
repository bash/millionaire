/**
 *
 * @param {Animation} animation
 * @returns {Promise}
 */
export function finished(animation) {
  if (animation.finished) {
    return animation.finished
  }

  if (animation.playState === 'finished') {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    animation.addEventListener('finish', function listener () {
      resolve()
      animation.removeEventListener('finish', listener)
    })
  })
}
