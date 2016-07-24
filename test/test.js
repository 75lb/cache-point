'use strict'
var test = require('tape')
var Cache = require('../')

function getTmpDir(name) {
  var os = require('os')
  var path = require('path')
  return path.resolve(os.tmpdir(), 'cacheTest')
}

test('string key', function (t) {
  t.plan(1)
  var tmpDir = getTmpDir()
  var cache = new Cache({ cacheDir: tmpDir })
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
  var tmpDir = getTmpDir()
  var cache = new Cache({ cacheDir: tmpDir })
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
  var tmpDir = getTmpDir()
  var cache = new Cache({ cacheDir: tmpDir })
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
