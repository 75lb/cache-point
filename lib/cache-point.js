'use strict'
const fs = require('then-fs')
const path = require('path')
const arrayify = require('array-back')

/**
 * @module cache-point
 * @example
 * const Cache = require('cache-point')
 * const cache = new Cache({ cacheDir: '~/.cache' })
 */

/**
 * @alias module:cache-point
 * @typicalname cache
 */
class Cache {
  /**
   * @param [options] {object}
   * @param [options.cacheDir] {string}
   */
  constructor (options) {
    options = Object.assign({}, options)
    this.cacheDir = options.cacheDir
    try {
      fs.mkdirSync(this.cacheDir)
    } catch (err) {
      // exists
    }
  }

  /**
   * Cache hit resolves, miss rejects.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @returns {Promise}
   */
  read (keys) {
    const blobPath = path.resolve(this.cacheDir, this.getChecksum(keys))
    return fs.readFile(blobPath).then(JSON.parse)
  }

  /**
   * Write some data to the cache with a key.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @param {*} - the data to store
   * @returns {Promise}
   */
  write (keys, content) {
    const blobPath = path.resolve(this.cacheDir, this.getChecksum(keys))
    return fs.writeFile(blobPath, JSON.stringify(content))
  }

  /**
   * Converts a key value into a hex checksum.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @returns {string}
   */
  getChecksum (keys) {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha1')
    arrayify(keys).forEach(key => hash.update(JSON.stringify(key)))
    return hash.digest('hex')
  }
}

module.exports = Cache
