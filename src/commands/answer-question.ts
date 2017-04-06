export class AnswerQuestionError extends Error {
}

export interface AnswerQuestionCommand {
  (gameId: string, answerId: string): Promise<{ isCorrect: boolean, isFinished: boolean }> 
}

export function answerQuestion (repository, dataStore, finishGame): AnswerQuestionCommand {
  return async (gameId, answerId) => {
    const [answer, questionId] = await Promise.all([
      repository.getAnswer(answerId),
      dataStore.getCurrentQuestion(gameId)
    ])

    const isCorrect = answer['is_correct']

    if (answer['question_id'] !== questionId) {
      throw new AnswerQuestionError('invalid answer')
    }

    if (isCorrect) {
      await dataStore.incrementScore(gameId)
    } else {
      await dataStore.clearScore(gameId)
    }

    await dataStore.removeCurrentQuestion(gameId)

    const nextQuestion = await dataStore.getCurrentQuestion(gameId)
    const isFinished = (!isCorrect || !nextQuestion)

    if (isFinished) {
      await finishGame(gameId)
    }

    return { isCorrect, isFinished }
  }
}
