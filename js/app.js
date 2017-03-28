import { AppRouter } from './elements/app-router'
import { AppLink } from './elements/app-link'
import { AppView } from './elements/app-view'
import { RegisterForm } from './elements/register-form'

window.customElements.define('app-router', AppRouter)
window.customElements.define('app-link', AppLink, { extends: 'a' })
window.customElements.define('app-view', AppView)
window.customElements.define('register-form', RegisterForm)
