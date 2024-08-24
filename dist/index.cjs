'use strict';

var path = require('path');
var fs = require('fs');
var os = require('os');
var crypto = require('crypto');

/**
 * Takes any input and guarantees an array back.
 *
 * - Converts array-like objects (e.g. `arguments`, `Set`) to a real array.
 * - Converts `undefined` to an empty array.
 * - Converts any another other, singular value (including `null`, objects and iterables other than `Set`) into an array containing that value.
 * - Ignores input which is already an array.
 *
 * @module array-back
 * @example
 * > const arrayify = require('array-back')
 *
 * > arrayify(undefined)
 * []
 *
 * > arrayify(null)
 * [ null ]
 *
 * > arrayify(0)
 * [ 0 ]
 *
 * > arrayify([ 1, 2 ])
 * [ 1, 2 ]
 *
 * > arrayify(new Set([ 1, 2 ]))
 * [ 1, 2 ]
 *
 * > function f(){ return arrayify(arguments); }
 * > f(1,2,3)
 * [ 1, 2, 3 ]
 */

function isObject (input) {
  return typeof input === 'object' && input !== null
}

function isArrayLike (input) {
  return isObject(input) && typeof input.length === 'number'
}

/**
 * @param {*} - The input value to convert to an array
 * @returns {Array}
 * @alias module:array-back
 */
function arrayify (input) {
  if (Array.isArray(input)) {
    return input
  } else if (input === undefined) {
    return []
  } else if (isArrayLike(input) || input instanceof Set) {
    return Array.from(input)
  } else {
    return [input]
  }
}

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
    options = options || {};
    if (!options.dir) {
      options.dir = path.resolve(os.tmpdir(), 'cachePoint');
    }
    /**
     * Current cache directory. Can be changed at any time.
     * @type {string}
     */
    this.dir = options.dir;
  }

  get dir () {
    return this._dir
  }
  set dir (val) {
    this._dir = val;
    fs.mkdirSync(this.dir, { recursive: true });
  }

  /**
   * A cache hit resolves with the stored value, a miss rejects with an `ENOENT` error code.
   * @param {*} - One or more values to uniquely identify the data. Can be any value, or an array of values of any type.
   * @returns {Promise}
   * @throws ENOENT
   */
  async read (keys) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys));
    return fs.promises.readFile(blobPath).then(JSON.parse)
  }

  /**
   * A cache hit returns the stored value, a miss returns `null`.
   * @param {*} - One or more values to uniquely identify the data. Can be any value, or an array of values of any type.
   * @returns {string?}
   */
  readSync (keys) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys));
    try {
      const data = fs.readFileSync(blobPath, 'utf8');
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
    const blobPath = path.resolve(this._dir, this.getChecksum(keys));
    return fs.promises.writeFile(blobPath, JSON.stringify(content))
  }

  /**
   * Write some data to the cache with a key.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @param {*} - the data to store
   */
  writeSync (keys, content) {
    const blobPath = path.resolve(this._dir, this.getChecksum(keys));
    fs.writeFileSync(blobPath, JSON.stringify(content));
  }

  /**
   * Used internally to convert a key value into a hex checksum. Override if for some reason you need a different hashing strategy.
   * @param {*} - One or more values to index the data, e.g. a request object or set of function args.
   * @returns {string}
   */
  getChecksum (keys) {
    const hash = crypto.createHash('sha1');
    arrayify(keys).forEach(key => hash.update(JSON.stringify(key)));
    return hash.digest('hex')
  }

  /**
   * Clears the cache. Returns a promise which resolves once the cache is clear.
   * @returns {Promise}
   */
  async clear () {
    const files = await fs.promises.readdir(this._dir);
    const promises = files.map(file => fs.promises.unlink(path.resolve(this._dir, file)));
    return Promise.all(promises)
  }

  /**
   * Clears and removes the cache directory. Returns a promise which resolves once the remove is complete.
   * @returns {Promise}
   */
  async remove () {
    await this.clear();
    return fs.promises.rmdir(this._dir)
  }
}

module.exports = Cache;
