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

OssWrapper.prototype.upload = function (filePath, options) {
  var self = this;
  return function (done) {
    self.client.putObject({
      bucket: self.bucket,
      srcFile: filePath,
      object: trimKey(options.key)
    }, function (err, data) {
      if (err) {
        return done(err);
      }
      done(null, {
        key: options.key
      });
    });
  };
};

OssWrapper.prototype.uploadBuffer = OssWrapper.prototype.upload;

OssWrapper.prototype.download = function (key, filepath, options) {
  var self = this;
  return function (done) {
    self.client.getObject({
      object: trimKey(key),
      dstFile: filepath,
      bucket: self.bucket
    }, done);
  };
};

OssWrapper.prototype.remove = function (key) {
  var self = this;
  return function (done) {
    self.client.deleteObject({
      object: trimKey(key),
      bucket: self.bucket
    }, done);
  };
};

exports.create = function (options) {
  return new OssWrapper(options);
};
