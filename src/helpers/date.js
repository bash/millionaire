const moment = require('moment')

/**
 *
 * @param {string} date
 * @returns {number}
 */
module.exports.toTimestamp = (date) => moment(date).unix()
