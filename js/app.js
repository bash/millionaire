import { AppRouter } from './elements/app-router'
import { AppLink } from './elements/app-link'
import { AppView } from './elements/app-view'
import { RegisterForm } from './elements/register-form'
import { EventButton } from './elements/event-button'
import { AnswerButton } from './elements/answer-button'
import { GameQuestion } from './elements/game-question'

window.customElements.define('app-router', AppRouter)
window.customElements.define('app-link', AppLink, { extends: 'a' })
window.customElements.define('app-view', AppView)
window.customElements.define('register-form', RegisterForm)
window.customElements.define('event-button', EventButton, { extends: 'button' })
window.customElements.define('answer-button', AnswerButton, { extends: 'button' })
window.customElements.define('game-question', GameQuestion)
