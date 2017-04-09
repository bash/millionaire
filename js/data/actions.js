import { registerAction } from '../actions/register'
import { createCategoryAction } from '../actions/create-category'
import { hideScoreboardEntryAction } from '../actions/hide-scoreboard-entry'
import { deleteQuestionAction } from '../actions/delete-question'
import { loginAction } from '../actions/login'

export const actions = {
  'login': loginAction,
  'register': registerAction,
  'create-category': createCategoryAction,
  'hide-scoreboard-entry': hideScoreboardEntryAction,
  'delete-question': deleteQuestionAction
}
