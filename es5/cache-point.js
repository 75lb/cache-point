'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var arrayify = require('array-back');
var fs = require('fs');

var Cache = function () {
  function Cache(options) {
    _classCallCheck(this, Cache);

    options = options || {};
    if (!options.dir) {
      var os = require('os');
      options.dir = path.resolve(os.tmpdir(), 'cachePoint');
    }

    this.dir = options.dir;
  }

  _createClass(Cache, [{
    key: 'read',
    value: function read(keys) {
      var blobPath = path.resolve(this._dir, this.getChecksum(keys));
      var promise = new Promise(function (resolve, reject) {
        fs.readFile(blobPath, function (err, data) {
          if (err) reject(err);else resolve(data);
        });
      });
      return promise.then(JSON.parse);
    }
  }, {
    key: 'readSync',
    value: function readSync(keys) {
      var blobPath = path.resolve(this._dir, this.getChecksum(keys));
      try {
        var data = fs.readFileSync(blobPath, 'utf8');
        return JSON.parse(data);
      } catch (err) {
        return null;
      }
    }
  }, {
    key: 'write',
    value: function write(keys, content) {
      var blobPath = path.resolve(this._dir, this.getChecksum(keys));
      return new Promise(function (resolve, reject) {
        fs.writeFile(blobPath, JSON.stringify(content), function (err) {
          if (err) reject(err);else resolve();
        });
      });
    }
  }, {
    key: 'writeSync',
    value: function writeSync(keys, content) {
      var blobPath = path.resolve(this._dir, this.getChecksum(keys));
      fs.writeFileSync(blobPath, JSON.stringify(content));
    }
  }, {
    key: 'getChecksum',
    value: function getChecksum(keys) {
      var crypto = require('crypto');
      var hash = crypto.createHash('sha1');
      arrayify(keys).forEach(function (key) {
        return hash.update(JSON.stringify(key));
      });
      return hash.digest('hex');
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        fs.readdir(_this._dir, function (err, files) {
          if (err) {
            reject(err);
          } else {
            var promises = files.map(function (file) {
              return unlink(path.resolve(_this._dir, file));
            });
            Promise.all(promises).then(resolve).catch(reject);
          }
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this2 = this;

      return this.clear().then(function () {
        return rmdir(_this2._dir);
      });
    }
  }, {
    key: 'dir',
    get: function get() {
      return this._dir;
    },
    set: function set(val) {
      this._dir = val;
      var mkdirp = require('mkdirp');
      mkdirp.sync(this.dir);
    }
  }]);

  return Cache;
}();

module.exports = Cache;

function unlink(filePath) {
  return new Promise(function (resolve, reject) {
    fs.unlink(filePath, function (err) {
      if (err) reject(err);else resolve();
    });
  });
}

function rmdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.rmdir(dir, function (err) {
      if (err) reject(err);else resolve();
    });
  });
}