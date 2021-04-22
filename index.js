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

/**
 * @param {string} prefix - file prefix
 * @param {object} [options] -
 * @param {number} [options.max] - default 10000
 * @return {Generator<string[]>} -
 */
proto.list = function* (prefix, options) {
  const max = options && options.max || 10000;
  const stepMax = Math.min(1000, max);
  let marker = null;
  let files = [];
  do {
    const res = yield this.client.list({
      prefix: prefix,
      'max-keys': stepMax,
      marker: marker,
    });
    const objects = res.objects || [];
    const prefixLength = prefix.length;
    const nextFiles = objects.map(o => o.name.substring(prefixLength));
    files = files.concat(nextFiles);
    marker = res.nextMarker;
  } while (marker && files.length < max);
  return files;
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

proto.urls = function(key, options) {
  const name = trimKey(key);
  let cdnUrl;
  if (this._cdnBaseUrl) {
    cdnUrl = this.client.getObjectUrl(name, this._cdnBaseUrl);
  }

  let urls = [];
  if (this._cluster && options && options.bucket) {
    urls = this._getAllAvailableUrls(name, options);
  }
  if (urls.length === 0) {
    urls.push(this.client.signatureUrl(name, options));
  }
  if (cdnUrl) {
    urls.unshift(cdnUrl);
  }
  return urls;
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

proto._getAllAvailableUrls = function(name, options) {
  const bucket = options.bucket;
  const clients = this.client.clients;
  const len = clients.length;
  const urls = [];
  for (let i = 0; i < len; i++) {
    const client = clients[i];
    if (!this.client.availables[i]) continue;

    if (bucket && client.options.bucket === bucket) {
      urls.unshift(client.signatureUrl(name, options));
    } else {
      urls.push(client.signatureUrl(name, options));
    }
  }
  return urls;
};

function trimKey(key) {
  key = key ? key.replace(/^\//, '') : '';
  // %3A => :
  key = key && key.indexOf('%3A') >= 0 ? decodeURIComponent(key) : key;
  return key;
}
