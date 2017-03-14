import { AppRouter } from './elements/app-router'
import { AppLink } from './elements/app-link'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/sw.js', { scope: '/' })
}

window.customElements.define('app-router', AppRouter)
window.customElements.define('app-link', AppLink, { extends: 'a' })
