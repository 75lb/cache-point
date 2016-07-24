'use strict'
var test = require('tape')
var Cache = require('../')

test('string key', function (t) {
  t.plan(1)
  var cache = new Cache()
  cache.write('one', 'test1')
    .then(function() {
      return cache.read('one')
    })
    .then(function(data) {
      t.strictEqual(data, 'test1')
      cache.remove()
    })
})

test('object key', function (t) {
  t.plan(1)
  var cache = new Cache()
  var objectKey = { one: true }
  cache.write(objectKey, 'test1')
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      t.strictEqual(data, 'test1')
      cache.remove()
    })
})

test('.remove()', function (t) {
  t.plan(1)
  var cache = new Cache()
  cache.write('one', 'test1')
    .then(function() {
      return cache.remove()
    })
    .then(function() {
      t.throws(function () {
        fs.statSync(tmpDir)
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      t.fail(err.message)
    })
})
