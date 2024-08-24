import Cache from 'cache-point'
import { strict as a } from 'assert'
import { promises as fs, statSync } from 'fs'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('string key, string data', async function () {
  const cache = new Cache({ dir: 'tmp/one' })
  await cache.write('one', 'test1')
  const data = await cache.read('one')
  a.strictEqual(data, 'test1')
})

test.set('object key, string data', async function () {
  const cache = new Cache({ dir: 'tmp/two' })
  const objectKey = { one: true }
  await cache.write(objectKey, 'test1')
  const data = await cache.read(objectKey)
  a.strictEqual(data, 'test1')
})

test.set('object key, array data', async function () {
  const cache = new Cache({ dir: 'tmp/three' })
  const objectKey = { one: true }
  await cache.write(objectKey, ['test1'])
  const data = await cache.read(objectKey)
  a.deepEqual(data, ['test1'])
})

test.set('.remove()', async function () {
  const cache = new Cache({ dir: 'tmp/four' })
  await cache.write('one', 'test1')
  await cache.remove()
  try {
    statSync('tmp/four')
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
})

test.set('.clear()', async function () {
  const cache = new Cache({ dir: 'tmp/five' })
  await cache.write('one', 'test1')
  const files = await fs.readdir('tmp/five')
  a.strictEqual(files.length, 1)
  await cache.clear()
  const files2 = await fs.readdir('tmp/five')
  a.strictEqual(files2.length, 0)
})

export { test, only, skip }
