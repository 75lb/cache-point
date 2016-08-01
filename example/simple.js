'use strict'
const Cache = require('../')
const cache = new Cache({ dir: 'tmp/example' })

// endure a 3s wait for the result
function expensiveOperation (input) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const output = 'result'
      cache.write(input, output)
      resolve(output)
    }, 3000)
  })
}

// cache.read() will resolve on hit, reject on miss.
function getData (input) {
  return cache
    .read(input)
    .catch(() => expensiveOperation(input))
}

// The first invocation will take 3s, the rest instantaneous.
getData('some input')
  .then(console.log)

// outputs: 'result'
