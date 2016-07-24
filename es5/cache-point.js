'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('then-fs');
var path = require('path');
var arrayify = require('array-back');

var Cache = function () {
  function Cache(options) {
    _classCallCheck(this, Cache);

    options = options || {};
    this.cacheDir = options.cacheDir;
    try {
      fs.mkdirSync(this.cacheDir);
    } catch (err) {}
  }

  _createClass(Cache, [{
    key: 'read',
    value: function read(keys) {
      var blobPath = path.resolve(this.cacheDir, this.getChecksum(keys));
      return fs.readFile(blobPath).then(JSON.parse);
    }
  }, {
    key: 'write',
    value: function write(keys, content) {
      var blobPath = path.resolve(this.cacheDir, this.getChecksum(keys));
      return fs.writeFile(blobPath, JSON.stringify(content));
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
  }]);

  return Cache;
}();

module.exports = Cache;