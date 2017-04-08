const { queryOne, query } = require('./../database')

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
       JOIN mill.category AS category ON question.category_id = category.id`
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
       WHERE id = $1::bigint`
      [scoreId]
    )
  }
}
