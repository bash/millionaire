/**
 *
 * @param {string} message
 * @param {number} ttl
 * @returns {ToastMessage}
 */
export function createToastMessage (message, ttl = 4000) {
  const $message = new ToastMessage()

  $message.toastTtl = ttl

  const $text = document.createElement('span')
  $text.className = 'message'
  $text.innerText = message
  $message.appendChild($text)

  return $message
}

/**
 *
 * @param {string} message
 * @param {number} ttl
 * @returns {Promise<ToastMessage>}
 */
export async function showToastMessage (message, ttl = 4000) {
  const $toast = createToastMessage(message, ttl)

  await $toast.show()

  return $toast
}

/**
 *
 * @returns {Promise<ToastMessage>}
 */
export function showInternalErrorToast () {
  return showToastMessage('Hoppla - Da ist wohl etwas schief gelaufen')
}

/**
 *
 * @returns {Promise}
 */
export function hideCurrentToast () {
  const container = getToastContainer()
  const toast = container.querySelector('toast-message')

  return toast ? toast.hide() : Promise.resolve()
}

const getToastContainer = (() => {
  let toastContainer

  return () => {
    if (toastContainer) {
      return toastContainer
    }

    toastContainer = document.createElement('section')
    toastContainer.className = 'toast-container'

    document.body.appendChild(toastContainer)

    return toastContainer
  }
})()

export class ToastMessage extends HTMLElement {
  constructor () {
    super()

    this.classList.add('toast-message')

    this._onTtlExpired = this._onTtlExpired.bind(this)
  }

  connectedCallback () {
    if (this.toastTtl) {
      this._timeout = setTimeout(this._onTtlExpired, this.toastTtl)
    }
  }

  disconnectedCallback () {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
  }

  /**
   *
   * @returns {Promise}
   * @private
   */
  _onTtlExpired () {
    return this.hide()
  }

  /**
   *
   * @returns {Promise}
   */
  hide () {
    return new Promise((resolve) => {
      this.addEventListener(
        'animationend',
        () => {
          this.remove()
          resolve()
        },
        { once: true }
      )

      this.classList.add('-disappear')
    })
  }

  /**
   *
   * @returns {Promise}
   */
  show () {
    const container = getToastContainer()

    return hideCurrentToast().then(() => {
      container.appendChild(this)
    })
  }

  /**
   *
   * @returns {number}
   */
  get toastTtl () {
    return Number.parseInt(this.getAttribute('toast-ttl')) || null
  }

  /**
   *
   * @param {number} ttl
   */
  set toastTtl (ttl) {
    this.setAttribute('toast-ttl', ttl.toString())
  }
}
