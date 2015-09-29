/**!
 * Copyright(c) cnpm and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const oss = require('ali-oss');
const is = require('is-type-of');

exports.create = function (options) {
  return new OssWrapper(options);
};

function OssWrapper(options) {
  // If you want to use oss public mode, please set `options.mode = 'public'`
  this._mode = options.mode === 'public' ? 'public' : 'private';
  this._publicRoot = options.publicRoot; // 'cnpm.oss.aliyuncs.com'

  if (options.cluster) {
    options.schedule = options.schedule || 'masterSlave';
    this.client = new oss.ClusterClient(options);
  } else {
    this.client = oss(options);
  }

  if (this._mode === 'public') {
    if (!this._publicRoot) {
      const endpoint = options.endpoint || 'oss.aliyuncs.com';
      this._publicRoot = 'http://' + options.bucket + '.' + endpoint;
    } else {
      if (this._publicRoot.indexOf('://') < 0) {
        this._publicRoot = 'http://' + this._publicRoot;
      }
      this._publicRoot = this._publicRoot.replace(/\/+$/, '');
    }
  }
}

const proto = OssWrapper.prototype;

proto.upload = function* (filePath, options) {
  const key = trimKey(options.key);
  const result = yield this.client.put(key, filePath);
  if (this._mode === 'public') {
    return { url: result.url };
  }
  return { key: key };
};

proto.uploadBuffer = proto.upload;

proto.download = function* (key, filepath, options) {
  yield this.client.get(trimKey(key), filepath, options);
};

proto.createDownloadStream = function* (key, options) {
  return (yield this.client.getStream(trimKey(key), options)).stream;
};

proto.url = function* (key) {
  const name = trimKey(key);
  // cluster client
  if (is.generatorFunction(this.client.signatureUrl)) {
    return yield this.client.signatureUrl(name);
  }

  // normal client
  return this.client.signatureUrl(name);
};

proto.remove = function* (key) {
  yield this.client.delete(trimKey(key));
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}
