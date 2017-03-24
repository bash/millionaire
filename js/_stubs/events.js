/**
 * @typedef {{bubbles?: boolean, cancelable?: boolean, scoped?: boolean, composed?: boolean, detail?: {}}} CustomEventInit
 */

/**
 @param {string} type
 @param {CustomEventInit} [eventInitDict]
 @constructor
 */
function CustomEvent(type, eventInitDict) {}

function Animation () {

}

Animation.prototype = Object.create(EventTarget.prototype)

/**
 *
 * @type {Promise}
 */
Animation.prototype.finished = new Promise()

/**
 *
 * @type {string}
 */
Animation.prototype.playState = ''
