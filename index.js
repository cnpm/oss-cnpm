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

var OSS = require('ali-oss');
var path = require('path');

// If you want to use oss public mode, please set `options.mode = 'public'`
var OssWrapper = function (options) {
  this.client = OSS.create(options);
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
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}

OssWrapper.prototype.upload = function* (filePath, options) {
  var key = trimKey(options.key);
  var res = yield* this.client.upload(filePath, key);
  if (this._mode === 'public') {
    return { url: this._publicRoot + '/' + key };
  }
  return { key: key };
};

OssWrapper.prototype.uploadBuffer = OssWrapper.prototype.upload;

OssWrapper.prototype.download = function* (key, filepath, options) {
  yield* this.client.get(trimKey(key), filepath, options);
};

OssWrapper.prototype.remove = function* (key) {
  yield* this.client.remove(trimKey(key));
};

exports.create = function (options) {
  return new OssWrapper(options);
};
