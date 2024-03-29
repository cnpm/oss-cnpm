const { OSSObject } = require('oss-client');

function trimKey(key) {
  key = key ? key.replace(/^\//, '') : '';
  // %3A => :
  key = key && key.indexOf('%3A') >= 0 ? decodeURIComponent(key) : key;
  return key;
}

function autoFixInternalOSSUrl(url) {
  // get from endpoint, https://some-bucket.region-name-internal.aliyuncs.com/foo/url => https://some-bucket.region-name.aliyuncs.com/foo/url
  return url.replace('-internal.aliyuncs.com/', '.aliyuncs.com/');
}

class OssWrapper {
  constructor(options) {
    // If you want to use oss public mode, please set `options.mode = 'public'`
    this._mode = options.mode === 'public' ? 'public' : 'private';

    this.client = new OSSObject(options);
    this._cdnBaseUrl = options.cdnBaseUrl;
    this._defaultHeaders = options.defaultHeaders;
  }

  async upload(filePath, options) {
    const key = trimKey(options.key);
    // https://github.com/node-modules/oss-client#putname-file-options
    const result = await this.client.put(key, filePath, {
      headers: this._defaultHeaders,
    });
    if (this._mode === 'public') {
      return { url: result.url };
    }
    return { key };
  }

  async uploadBytes(bytes, options) {
    if (typeof bytes === 'string') {
      bytes = Buffer.from(bytes);
    }
    return await this.upload(bytes, options);
  }

  // options.position, default is '0'
  async appendBytes(bytes, options) {
    // nextAppendPosition on result
    const key = trimKey(options.key);
    if (typeof bytes === 'string') {
      bytes = Buffer.from(bytes);
    }
    return await this.client.append(key, bytes, options);
  }

  async readBytes(key) {
    const { content } = await this.client.get(trimKey(key));
    return content;
  }

  async download(key, filepath, options) {
    await this.client.get(trimKey(key), filepath, options);
  }

  /**
   * @param {string} prefix - file prefix
   * @param {object} [options] -
   * @param {number} [options.max] - default 10000
   * @return {Generator<string[]>} -
   */
  async list(prefix, options) {
    const max = options && options.max || 10000;
    const stepMax = Math.min(1000, max);
    let marker = null;
    let files = [];
    do {
      const res = await this.client.list({
        prefix,
        'max-keys': stepMax,
        marker,
      });
      const objects = res.objects || [];
      const prefixLength = prefix.length;
      const nextFiles = objects.map(o => o.name.substring(prefixLength));
      files = files.concat(nextFiles);
      marker = res.nextMarker;
    } while (marker && files.length <= max);
    return files;
  }

  async createDownloadStream(key, options) {
    return (await this.client.getStream(trimKey(key), options)).stream;
  }

  async url(key, options) {
    const name = trimKey(key);
    if (this._cdnBaseUrl) {
      return this.client.getObjectUrl(name, this._cdnBaseUrl);
    }
    return autoFixInternalOSSUrl(this.client.signatureUrl(name, options));
  }

  async urls(key, options) {
    const name = trimKey(key);
    let cdnUrl;
    if (this._cdnBaseUrl) {
      cdnUrl = this.client.getObjectUrl(name, this._cdnBaseUrl);
    }

    const urls = [];
    if (urls.length === 0) {
      urls.push(autoFixInternalOSSUrl(this.client.signatureUrl(name, options)));
    }
    if (cdnUrl) {
      urls.unshift(cdnUrl);
    }
    return urls;
  }

  async remove(key) {
    await this.client.delete(trimKey(key));
  }
}

module.exports = OssWrapper;
