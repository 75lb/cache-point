import path from 'path'
import { promises as fs, mkdirSync, readFileSync, writeFileSync } from 'fs'
import arrayify from 'array-back'
import os from 'os'
import crypto from 'crypto'

/**
 * @module cache-point
 */

/**
 * @alias module:cache-point
 * @typicalname cache
 */
class Cache {
  /**
   * @param [options] {object}
   * @param [options.dir] {string}
   */
  constructor (options) {
    options = options || {}
    if (!options.dir) {
      options.dir = path.resolve(os.tmpdir(), 'cachePoint')
    }
    /**
     * Current cache directory. Can be changed at any time.
     * @type {string}
     */
    this.dir = options.dir
  }

  get dir () {
    return this._dir
  }
  set dir (val) {
    this._dir = val
    mkdirSync(this.dir, { recursive: true })
  }

  /**
   * A cache hit resolves with the stored value, a miss rejects with an `ENOENT` error code.
   * @param {*} - One or more values to uniquely identify the data. Can be any value, or an array of values of any type.
   * @returns {Promise}
   * @throws ENOENT
   */
  async read (keys) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys))
    return fs.readFile(blobPath).then(JSON.parse)
  }

  /**
   * A cache hit returns the stored value, a miss returns `null`.
   * @param {*} - One or more values to uniquely identify the data. Can be any value, or an array of values of any type.
   * @returns {string?}
   */
  readSync (keys) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys))
    try {
      const data = readFileSync(blobPath, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      return null
    }
  }

  /**
   * Write some data to the cache. Returns a promise which resolves when the write is complete.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @param {*} - the data to store
   * @returns {Promise}
   */
  async write (keys, content) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys))
    return fs.writeFile(blobPath, JSON.stringify(content))
  }

  /**
   * Write some data to the cache with a key.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @param {*} - the data to store
   */
  writeSync (keys, content) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys))
    writeFileSync(blobPath, JSON.stringify(content))
  }

  /**
   * Used internally to convert a key value into a hex checksum. Override if for some reason you need a different hashing strategy.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @returns {string}
   */
  getChecksum (keys) {
    const hash = crypto.createHash('sha1')
    arrayify(keys).forEach(key => hash.update(JSON.stringify(key)))
    return hash.digest('hex')
  }

  /**
   * Clears the cache. Returns a promise which resolves once the cache is clear.
   * @returns {Promise}
   */
  async clear () {
    const files = await fs.readdir(this._dir)
    const promises = files.map(file => fs.unlink(path.resolve(this._dir, file)))
    return Promise.all(promises)
  }

  /**
   * Clears and removes the cache directory. Returns a promise which resolves once the remove is complete.
   * @returns {Promise}
   */
  async remove () {
    await this.clear()
    return fs.rmdir(this._dir)
  }
}

export default Cache
