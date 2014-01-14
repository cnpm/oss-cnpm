/**!
 * oss-cnpm - index.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */

var OssClient = require('oss-client').OssClient;

var OssWrapper = function (options) {
  var validOptions = options && options.accessKeyId &&
    options.accessKeySecret && options.bucket;

  if (!validOptions) {
    throw new Error('need options.accessKeyId and options.accessKeySecret');
  }

  this.client = new OssClient(options);
  this.bucket = options.bucket;
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
      return callback(err);
    }
    callback(null, {
      key: options.key
    });
  });
};

OssWrapper.prototype.uploadBuffer = OssWrapper.prototype.upload;

OssWrapper.prototype.downloadStream = function (key, writeStream, options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }
  this.client.getObject({
    object: trimKey(key),
    dstFile: writeStream,
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
