const webdriver = require('selenium-webdriver')
const test = require('selenium-webdriver/testing')
const helper = require('./helper')

test.describe('Login', () => {
  let login = helper.login()
  let driver

  test.before(() => {
    driver = helper.getDriver()
    login.before()
  })

  test.after(() => {
    login.after()
    driver.quit()
  })

  test.it('should be able to log in', () => {
    login.run(driver)
  })
})
