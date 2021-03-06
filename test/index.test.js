'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const urllib = require('urllib');
const oss = require('../');
const config = require('./config');
const masterSlaveClusterConfig = require('./cluster_config');

const roundRobinClusterConfig = {};
for (let key in masterSlaveClusterConfig) {
  roundRobinClusterConfig[key] = masterSlaveClusterConfig[key];
}
roundRobinClusterConfig.schedule = 'roundRobin';

describe('test/index.test.js', function () {
  [
    {
      name: 'one region oss client',
      nfs: oss.create(config),
      prefix: '/oss-cnpm-example',
    },
    {
      name: 'cluster:masterSlave oss client',
      nfs: oss.create(masterSlaveClusterConfig),
      prefix: '/oss-cnpm-masterSlave-example',
    },
    {
      name: 'cluster:roundRobin oss client',
      nfs: oss.create(roundRobinClusterConfig),
      prefix: '/oss-cnpm-roundRobin-example',
    },
  ].forEach(function (item) {
    describe(item.name, function () {
      const nfs = item.nfs;
      const key = item.prefix + '/-/example2.js-' + process.version;

      it('should upload file', function* () {
        const info = yield nfs.upload(__filename, {key: key});
        if (config.mode === 'public') {
          assert.equal(typeof info.url, 'string');
        } else {
          assert.equal(typeof info.key, 'string');
        }
      });

      it('should download file', function* () {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        yield nfs.download(key, tmpfile);
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should get download stream', function* () {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        const stream = yield nfs.createDownloadStream(key);
        const ws = fs.createWriteStream(tmpfile);
        function end() {
          return function (callback) {
            ws.on('close', callback);
          };
        }
        stream.pipe(ws);
        yield end();
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should create signature url', function () {
        const url = nfs.url(key);
        assert.equal(typeof url, 'string');
        assert.equal(url, 'http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key);
      });

      it('should create signature url with ":"', function () {
        const url = nfs.url('///dist/tensorflow/images/sha256%3A02fde75423b21c534ca1bf6ef071c7272a2b37d60028b7fe70f9fd3a8d43d2d7');
        assert.equal(typeof url, 'string');
        assert.equal(url, 'http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com/dist/tensorflow/images/sha256%3A02fde75423b21c534ca1bf6ef071c7272a2b37d60028b7fe70f9fd3a8d43d2d7');
      });

      it('should upload file with headers', function* () {
        const cacheKey = key + '-cache';
        const info = yield nfs.upload(__filename, {
          key: cacheKey,
        });
        if (config.mode === 'public') {
          assert.equal(typeof info.url, 'string');
          const r = yield urllib.request(info.url, {
            method: 'HEAD',
          });
          console.log(r.headers);
          assert.equal(r.status, 200);
          assert.equal(r.headers['cache-control'], 'max-age=0, s-maxage=60');
        } else {
          assert.equal(typeof info.key, 'string');
          const url = nfs.url(info.key);
          const r = yield urllib.request(url, {
            method: 'HEAD',
          });
          console.log(r.headers);
          assert.equal(r.status, 200);
          assert.equal(r.headers['cache-control'], 'max-age=0, s-maxage=60');
        }
      });

      it('should remove the file', function* () {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        yield nfs.download(key, tmpfile);
        yield nfs.remove(key);
        try {
          yield nfs.download(key, tmpfile);
          throw new Error('should not run this');
        } catch (err) {
          assert.equal(err.name, 'NoSuchKeyError');
        }
      });

      it('should list files', function* () {
        const files = yield nfs.list('typescript/-/');
        assert(files);
        assert(files.length);
      });

      it('should list with max', function* () {
        const files = yield nfs.list('-/', {
          max: 1,
        });
        assert(files);
        assert(files.length === 1);
      });
    });
  });

  describe('cluster client', () => {
    it('should create signature url with bucket2', () => {
      const nfs = oss.create({
        cluster: masterSlaveClusterConfig.cluster,
      });
      const key = '/foo/bar/ok.tgz';
      let url = nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      assert.equal(typeof url, 'string');
      console.log(url);
      assert.equal(url.indexOf('http://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-shenzhen.aliyuncs.com' + key), 0);

      url = nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET });
      assert.equal(typeof url, 'string');
      console.log(url);
      assert.equal(url.indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);

      // default bucket
      url = nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 + '-not-exists' });
      assert.equal(typeof url, 'string');
      console.log(url);
      assert.equal(url.indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);

      // not availables
      nfs.client.availables[1] = false;
      url = nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      nfs.client.availables[1] = true;
      assert.equal(typeof url, 'string');
      console.log(url);
      assert.equal(url.indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);
    });

    it('should multi urls', () => {
      const nfs = oss.create({
        cluster: masterSlaveClusterConfig.cluster,
      });
      const key = '/foo/bar/ok.tgz';
      let urls = nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      console.log(urls);
      assert.equal(urls[0].indexOf('http://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-shenzhen.aliyuncs.com' + key), 0);

      urls = nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      console.log(urls);
      assert.equal(urls[0].indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);

      // default bucket
      urls = nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 + '-not-exists' });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      console.log(urls);
      assert.equal(urls[0].indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);

      // not availables
      nfs.client.availables[1] = false;
      urls = nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      nfs.client.availables[1] = true;
      assert(Array.isArray(urls));
      assert(urls.length === 1);
      console.log(urls);
      assert.equal(urls[0].indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);

      urls = nfs.urls(key);
      assert(Array.isArray(urls));
      assert(urls.length === 1);
      console.log(urls);
      assert.equal(urls[0].indexOf('http://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com' + key), 0);
    });
  });
});
