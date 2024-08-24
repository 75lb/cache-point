import Cache from 'cache-point'
import { strict as a } from 'assert'
import { promises as fs, statSync } from 'fs'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('sync: string key, string data', function () {
  const cache = new Cache({ dir: 'tmp/sync/one' })
  const objectKey = 'one'
  const data = 'test1'
  cache.writeSync(objectKey, data)
  const result = cache.readSync(objectKey)
  a.equal(result, data)
})

test.set('sync: object key, string data', function () {
  const cache = new Cache({ dir: 'tmp/sync/two' })
  const objectKey = { one: true }
  const data = 'test1'
  cache.writeSync(objectKey, data)
  const result = cache.readSync(objectKey)
  a.equal(result, data)
})

test.set('sync: object key, array data', function () {
  const cache = new Cache({ dir: 'tmp/sync/three' })
  const objectKey = { one: true }
  const data = ['test1']
  cache.writeSync(objectKey, data)
  const result = cache.readSync(objectKey)
  a.deepEqual(result, data)
})

test.set('sync: key not found', function () {
  const cache = new Cache({ dir: 'tmp/sync/four' })
  const objectKey = 'asfrfe'
  const result = cache.readSync(objectKey)
  a.deepEqual(result, null)
})

export { test, only, skip }
