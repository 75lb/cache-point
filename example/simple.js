'use strict'
const Cache = require('../')
const cache = new Cache({ dir: 'tmp/example' })

function expensiveOperation (input) {
  return new Promise((resolve, reject) => {
    /* endure a 3s wait for the result */
    setTimeout(() => {
      const output = 'result'
      cache.write(input, output)
      resolve(output)
    }, 3000)
  })
}

function getData (input) {
  return cache
    .read(input)
    .catch(() => expensiveOperation(input))
}

/* The first invocation will take 3s, the rest instant. */
getData('some input')
  .then(console.log)
