const webdriver = require('selenium-webdriver')

module.exports.getDriver = function () {
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

  return driver
}

module.exports.baseUrl = 'http://localhost:8000'
