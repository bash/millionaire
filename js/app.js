import { AppRouter } from './elements/app-router'
import { AppLink } from './elements/app-link'

window.customElements.define('app-router', AppRouter)
window.customElements.define('app-link', AppLink, { extends: 'a' })
