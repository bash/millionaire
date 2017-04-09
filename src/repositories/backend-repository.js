const { queryOne, query, transaction } = require('./../database')

// TODO: should rename to GameRepository, create separate repository for admin
module.exports = class BackendRepository {
  constructor (pool) {
    this._pool = pool
  }

  /**
   *
   * @param {string} username
   * @returns {Promise<{id: string, password: string}>}
   */
  getAdminLogin (username) {
    return queryOne(
      this._pool,
      `SELECT id, password
       FROM mill.admin
       WHERE lower(username) = lower($1::varchar(255))`,
      [username]
    )
  }

  /**
   *
   * @param {string} name
   * @returns {Promise<string>}
   */
  async createCategory (name) {
    const { id } = await queryOne(
      this._pool,
      `INSERT INTO mill.category (name)
       VALUES ($1::varchar(255))
       RETURNING id`,
      [name]
    )

    return id
  }

  /**
   *
   * @returns {Promise<Array>}
   */
  getQuestions () {
    return query(
      this._pool,
      `SELECT question.id,
              question.title,
              category.name as category_name
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       ORDER BY category.name`
    )
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<Array>}
   */
  getQuestion (questionId) {
    return queryOne(
      this._pool,
      `SELECT question.id,
              question.title,
              category.name as category_name
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       WHERE question.id = $1::bigint`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<Array>}
   */
  getAnswers (questionId) {
    return query(
      this._pool,
      `SELECT id, title, is_correct
       FROM mill.answer
       WHERE question_id = $1::bigint`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} scoreId
   * @returns {Promise<void>}
   */
  hideScoreboardEntry (scoreId) {
    return this._pool.query(
      `UPDATE mill.score
       SET hidden = TRUE
       WHERE id = $1::bigint`,
      [scoreId]
    )
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise}
   */
  deleteQuestion (questionId) {
    return this._pool.query(
      `DELETE FROM mill.question
       WHERE id = $1::bigint`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} categoryId
   * @param {string} title
   * @param {Array<{}>} answers
   * @returns {Promise<string>}
   */
  createQuestion (categoryId, title, answers) {
    return transaction(this._pool, async (client) => {
      const question = await queryOne(
        client,
        `INSERT INTO mill.question (title, category_id)
         VALUES ($1::varchar(255), $2::bigint)
         RETURNING id`,
        [title, categoryId]
      )

      const answerResults = answers.map(({ title, isCorrect }) => {
        return query(
          client,
          `INSERT INTO mill.answer (title, is_correct, question_id)
           VALUES ($1::varchar(255), $2::boolean, $3::bigint)`,
          [title, isCorrect, question.id]
        )
      })

      await Promise.all(answerResults)

      return question.id
    })
  }
}
