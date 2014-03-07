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

var thunkify = require('thunkify-wrap');
var OssClient = require('oss-client').OssClient;

var OssWrapper = function (options) {
  var validOptions = options && options.accessKeyId &&
    options.accessKeySecret && options.bucket;

  if (!validOptions) {
    throw new Error('need options.accessKeyId and options.accessKeySecret');
  }

  this.client = new OssClient(options);
  this.bucket = options.bucket;
  thunkify(this);
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}

OssWrapper.prototype.upload = function (filePath, options, callback) {
  this.client.putObject({
    bucket: this.bucket,
    srcFile: filePath,
    object: trimKey(options.key)
  }, function (err, data) {
    if (err) {
      err.message += '\nfilePath: ' + filePath
        + '\nkey: ' + options.key;
      return callback(err);
    }
    callback(null, {
      key: options.key
    });
  });
};

OssWrapper.prototype.uploadBuffer = OssWrapper.prototype.upload;

OssWrapper.prototype.download = function (key, filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  this.client.getObject({
    object: trimKey(key),
    dstFile: filepath,
    bucket: this.bucket
  }, callback);
};

OssWrapper.prototype.remove = function (key, callback) {
  this.client.deleteObject({
    object: trimKey(key),
    bucket: this.bucket
  }, callback);
};

exports.create = function (options) {
  return new OssWrapper(options);
};
