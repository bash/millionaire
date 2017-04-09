const webdriver = require('selenium-webdriver')
const bootstrapDb = require('../../src/bootstrap/database')

const until = webdriver.until
const By = webdriver.By

const USERNAME = 'selenium'
const PASSWORD = 'selenium'
const PASSWORD_HASH = '$2a$10$tQNfYvc5KQMFDDA3/sTnbuNgQcNjATg8CmmuKQncSHFp3EXYtDRxu'

const BASE_URL = 'http://localhost:8000'

module.exports.baseUrl = BASE_URL

module.exports.getDriver = function () {
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

  return driver
}

module.exports.login = function () {
  let pool

  return {
    async before () {
      pool = bootstrapDb()

      await pool.query('DELETE FROM mill.admin WHERE username = $1::varchar(255)', [USERNAME])

      await pool.query('INSERT INTO mill.admin (username, password) VALUES($1::varchar(255), $2::varchar(255))', [
        USERNAME,
        PASSWORD_HASH
      ])
    },

    async after () {
      await pool.query('DELETE FROM mill.admin WHERE username = $1::varchar(255)', [USERNAME])
    },

    /**
     *
     * @param {WebDriver} driver
     */
    run (driver) {
      driver.get(`${BASE_URL}/login`)

      const username = driver.wait(until.elementLocated(By.name('username')))
      username.sendKeys(USERNAME)

      const password = driver.wait(until.elementLocated(By.name('password')))
      password.sendKeys(PASSWORD)

      const button = driver.findElement(By.css('button[type="submit"]'))
      button.click()

      const admin = driver.wait(until.urlIs(`${BASE_URL}/admin`), 5000)

      return admin
    }
  }
}
