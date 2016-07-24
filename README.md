[![view on npm](http://img.shields.io/npm/v/cache-point.svg)](https://www.npmjs.org/package/cache-point)
[![npm module downloads](http://img.shields.io/npm/dt/cache-point.svg)](https://www.npmjs.org/package/cache-point)
[![Build Status](https://travis-ci.org/75lb/cache-point.svg?branch=master)](https://travis-ci.org/75lb/cache-point)
[![Dependency Status](https://david-dm.org/75lb/cache-point.svg)](https://david-dm.org/75lb/cache-point)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_cache-point"></a>

## cache-point
**Example**  
```js
const Cache = require('cache-point')
const cache = new Cache({ cacheDir: '~/.cache' })
```

* [cache-point](#module_cache-point)
    * [Cache](#exp_module_cache-point--Cache) ⏏
        * [new Cache([options])](#new_module_cache-point--Cache_new)
        * [.read(keys)](#module_cache-point--Cache+read) ⇒ <code>Promise</code>
        * [.write(keys, content)](#module_cache-point--Cache+write) ⇒ <code>Promise</code>
        * [.getChecksum(keys)](#module_cache-point--Cache+getChecksum) ⇒ <code>string</code>
        * [.clean()](#module_cache-point--Cache+clean) ⇒ <code>Promise</code>
        * [.remove()](#module_cache-point--Cache+remove) ⇒ <code>Promise</code>

<a name="exp_module_cache-point--Cache"></a>

### Cache ⏏
**Kind**: Exported class  
<a name="new_module_cache-point--Cache_new"></a>

#### new Cache([options])

| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.cacheDir] | <code>string</code> | 

<a name="module_cache-point--Cache+read"></a>

#### cache.read(keys) ⇒ <code>Promise</code>
Cache hit resolves, miss rejects.

**Kind**: instance method of <code>[Cache](#exp_module_cache-point--Cache)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>\*</code> | One or more values to index the data, e.g. a request object or set of function args. |

<a name="module_cache-point--Cache+write"></a>

#### cache.write(keys, content) ⇒ <code>Promise</code>
Write some data to the cache with a key.

**Kind**: instance method of <code>[Cache](#exp_module_cache-point--Cache)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>\*</code> | One or more values to index the data, e.g. a request object or set of function args. |
| content | <code>\*</code> | the data to store |

<a name="module_cache-point--Cache+getChecksum"></a>

#### cache.getChecksum(keys) ⇒ <code>string</code>
Converts a key value into a hex checksum.

**Kind**: instance method of <code>[Cache](#exp_module_cache-point--Cache)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>\*</code> | One or more values to index the data, e.g. a request object or set of function args. |

<a name="module_cache-point--Cache+clean"></a>

#### cache.clean() ⇒ <code>Promise</code>
Cleans the cache.

**Kind**: instance method of <code>[Cache](#exp_module_cache-point--Cache)</code>  
<a name="module_cache-point--Cache+remove"></a>

#### cache.remove() ⇒ <code>Promise</code>
Cleans and removes the cache.

**Kind**: instance method of <code>[Cache](#exp_module_cache-point--Cache)</code>  

* * *

&copy; 2016 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
