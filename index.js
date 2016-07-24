var detect = require('feature-detect-es6')

if (typeof Promise === 'undefined') {
  require('core-js/es6/promise')
}

module.exports = detect.all('class', 'arrowFunction', 'templateStrings')
  ? require('./lib/cache-point')
  : require('./es5/cache-point')
