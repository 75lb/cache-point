var detect = require('feature-detect-es6')

module.exports = detect.all('class', 'arrowFunction', 'templateStrings')
  ? require('./lib/cache-point')
  : require('./es5/cache-point')
