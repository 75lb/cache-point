'use strict'
const path = require('path')
const arrayify = require('array-back')
const fs = require('fs')

/**
 * @module cache-point
 * @example
 * const Cache = require('cache-point')
 * const cache = new Cache({ dir: '~/.cache' })
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
      var os = require('os')
      options.dir = path.resolve(os.tmpdir(), 'cachePoint')
    }
    /**
     * Cache directory
     * @type {string}
     */
    this.dir = options.dir

    const mkdirp = require('mkdirp')
    mkdirp.sync(this.dir)
  }

  /**
   * Cache hit resolves, miss rejects.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @returns {Promise}
   */
  read (keys) {
    const blobPath = path.resolve(this.dir, this.getChecksum(keys))
    const promise = new Promise((resolve, reject) => {
      fs.readFile(blobPath, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
    return promise.then(JSON.parse)
  }

  /**
   * Write some data to the cache with a key.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @param {*} - the data to store
   * @returns {Promise}
   */
  write (keys, content) {
    const blobPath = path.resolve(this.dir, this.getChecksum(keys))
    return new Promise((resolve, reject) => {
      fs.writeFile(blobPath, JSON.stringify(content), err => {
        if (err) reject(err)
        else resolve()
      })
    })
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

  /**
   * Cleans the cache.
   * @returns {Promise}
   */
  clean () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.dir, (err, files) => {
        if (err) {
          reject(err)
        } else {
          const promises = files.map(file => unlink(path.resolve(this.dir, file)))
          Promise.all(promises).then(resolve).catch(reject)
        }
      })
    })
  }

  /**
   * Cleans and removes the cache.
   * @returns {Promise}
   */
  remove () {
    return this.clean().then(() => {
      return rmdir(this.dir)
    })
  }
}

module.exports = Cache

function unlink (filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function rmdir (dir) {
  return new Promise((resolve, reject) => {
    fs.rmdir(dir, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}
