'use strict'
var test = require('tape')
var Cache = require('../')
var fs = require('fs')
var path = require('path')

function createDir(name) {
  var os = require('os')
  var tmpDir = path.resolve(os.tmpdir(), 'cacheTest')
  return tmpDir
}

function rmDir (dir) {
  fs.readdirSync(dir).forEach(function (file) {
    fs.unlinkSync(path.resolve(dir, file))
  })
  fs.rmdirSync(dir)
}

test('string key', function (t) {
  t.plan(1)
  var tmpDir = createDir()
  var cache = new Cache({ cacheDir: tmpDir })
  cache.write('one', 'test1')
    .then(function() {
      return cache.read('one')
    })
    .then(function(data) {
      t.strictEqual(data, 'test1')
      rmDir(tmpDir)
    })
})

test('object key', function (t) {
  t.plan(1)
  var tmpDir = createDir()
  var cache = new Cache({ cacheDir: tmpDir })
  var objectKey = { one: true }
  cache.write(objectKey, 'test1')
    .then(function () {
      return cache.read(objectKey)
    })
    .then(function (data) {
      t.strictEqual(data, 'test1')
      rmDir(tmpDir)
    })
})
