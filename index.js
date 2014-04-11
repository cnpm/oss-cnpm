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

var OssWrapper = function (options) {
  this.client = OSS.create(options);
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}

OssWrapper.prototype.upload = function* (filePath, options) {
  var key = trimKey(options.key);
  yield* this.client.upload(filePath, key);
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
