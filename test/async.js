const Tom = require('test-runner').Tom
const Cache = require('../')
const a = require('assert')
const fs = require('fs-then-native')

const tom = module.exports = new Tom()

tom.test('string key, string data', function () {
  const cache = new Cache({ dir: 'tmp/one' })
  return cache.write('one', 'test1')
    .then(function() {
      return cache.read('one')
    })
    .then(function(data) {
      a.strictEqual(data, 'test1')
    })
})

tom.test('object key, string data', function () {
  const cache = new Cache({ dir: 'tmp/two' })
  const objectKey = { one: true }
  return cache.write(objectKey, 'test1')
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      a.strictEqual(data, 'test1')
    })
})

tom.test('object key, array data', function () {
  const cache = new Cache({ dir: 'tmp/three' })
  const objectKey = { one: true }
  return cache.write(objectKey, ['test1'])
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      a.deepEqual(data, ['test1'])
    })
})

tom.test('.remove()', function () {
  const cache = new Cache({ dir: 'tmp/four' })
  return cache.write('one', 'test1')
    .then(function() {
      return cache.remove()
    })
    .then(function() {
      try {
        fs.statSync('tmp/four')
      } catch (err) {
        if (err.code !== 'ENOENT') throw err
      }
    })
})

tom.test('.clear()', function () {
  const cache = new Cache({ dir: 'tmp/five' })
  return cache.write('one', 'test1')
    .then(() => {
      return fs.readdir('tmp/five')
        .then(files => {
          a.strictEqual(files.length, 1)
        })
    })
    .then(() => {
      return cache.clear()
        .then(() => {
          return fs.readdir('tmp/five')
            .then(files => {
              a.strictEqual(files.length, 0)
            })
        })
    })
})
