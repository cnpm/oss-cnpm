/**!
 * oss-cnpm - index.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var oss = require('ali-oss');
var path = require('path');

exports.create = function (options) {
  return new OssWrapper(options);
};

function OssWrapper(options) {
  this.client = oss(options);
  // If you want to use oss public mode, please set `options.mode = 'public'`
  this._mode = options.mode === 'public' ? 'public' : 'private';
  this._publicRoot = options.publicRoot; // 'cnpm.oss.aliyuncs.com'
  if (this._mode === 'public') {
    if (!this._publicRoot) {
      this._publicRoot = 'http://' + options.bucket + '.oss.aliyuncs.com';
    } else {
      if (this._publicRoot.indexOf('://') < 0) {
        this._publicRoot = 'http://' + this._publicRoot;
      }
      this._publicRoot = this._publicRoot.replace(/\/+$/, '');
    }
  }
}

var proto = OssWrapper.prototype;

proto.upload = function* (filePath, options) {
  var key = trimKey(options.key);
  var res = yield this.client.put(key, filePath);
  if (this._mode === 'public') {
    return { url: this._publicRoot + '/' + key };
  }
  return { key: key };
};

proto.uploadBuffer = proto.upload;

proto.download = function* (key, filepath, options) {
  yield* this.client.get(trimKey(key), filepath, options);
};

proto.url = function (key) {
  return this.client.signatureUrl(trimKey(key));
};

proto.remove = function* (key) {
  yield* this.client.delete(trimKey(key));
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}
