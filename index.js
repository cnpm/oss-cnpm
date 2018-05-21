'use strict';

const oss = require('ali-oss');

exports.create = function (options) {
  return new OssWrapper(options);
};

function OssWrapper(options) {
  // If you want to use oss public mode, please set `options.mode = 'public'`
  this._mode = options.mode === 'public' ? 'public' : 'private';

  if (options.cluster) {
    options.schedule = options.schedule || 'masterSlave';
    this.client = new oss.ClusterClient(options);
    this._cluster = true;
  } else {
    this.client = oss(options);
  }

  this._cdnBaseUrl = options.cdnBaseUrl;
  this._defaultHeaders = options.defaultHeaders;
}

const proto = OssWrapper.prototype;

proto.upload = function* (filePath, options) {
  const key = trimKey(options.key);
  // https://github.com/ali-sdk/ali-oss#putname-file-options
  const result = yield this.client.put(key, filePath, {
    headers: this._defaultHeaders,
  });
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

proto.url = function (key, options) {
  const name = trimKey(key);
  if (this._cdnBaseUrl) {
    return this.client.getObjectUrl(name, this._cdnBaseUrl);
  }
  if (this._cluster && options && options.bucket) {
    // select a bucket client
    const client = this._selectClientByBucket(options.bucket);
    return client.signatureUrl(name, options);
  }
  return this.client.signatureUrl(name, options);
};

proto.remove = function* (key) {
  yield this.client.delete(trimKey(key));
};

proto._selectClientByBucket = function(bucket) {
  const clients = this.client.clients;
  const len = clients.length;
  for (let i = 0; i < len; i++) {
    const client = clients[i];
    if (this.client.availables[i] && client.options.bucket === bucket) {
      return client;
    }
  }
  return this.client.chooseAvailable();
};

function trimKey(key) {
  return key ? key.replace(/^\//, '') : '';
}
