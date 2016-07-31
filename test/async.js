'use strict'
var test = require('test-runner')
var Cache = require('../')
var a = require('core-assert')

test('string key, string data', function () {
  var cache = new Cache({ dir: 'tmp/one' })
  return cache.write('one', 'test1')
    .then(function() {
      return cache.read('one')
    })
    .then(function(data) {
      a.strictEqual(data, 'test1')
      cache.remove()
    })
})

test('object key, string data', function () {
  var cache = new Cache({ dir: 'tmp/two' })
  var objectKey = { one: true }
  return cache.write(objectKey, 'test1')
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      a.strictEqual(data, 'test1')
      cache.remove()
    })
})

test('object key, array data', function () {
  var cache = new Cache({ dir: 'tmp/three' })
  var objectKey = { one: true }
  return cache.write(objectKey, ['test1'])
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      a.deepEqual(data, ['test1'])
      cache.remove()
    })
})

test('.remove()', function () {
  var cache = new Cache({ dir: 'tmp/four' })
  return cache.write('one', 'test1')
    .then(function() {
      return cache.remove()
    })
    .then(function() {
      a.throws(function () {
        fs.statSync(tmpDir)
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      a.fail(err.message)
    })
})
