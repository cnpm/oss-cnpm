const path = require('path');
const fs = require('fs');
const assert = require('assert');
const urllib = require('urllib');
const Client = require('..');
const config = require('./config');
const masterSlaveClusterConfig = require('./cluster_config');

const roundRobinClusterConfig = {};
for (const key in masterSlaveClusterConfig) {
  roundRobinClusterConfig[key] = masterSlaveClusterConfig[key];
}
roundRobinClusterConfig.schedule = 'roundRobin';

describe('test/index.test.js', () => {
  [
    {
      name: 'one region oss client',
      nfs: new Client(config),
      prefix: '/oss-cnpm-example',
    },
    {
      name: 'cluster:masterSlave oss client',
      nfs: new Client(masterSlaveClusterConfig),
      prefix: '/oss-cnpm-masterSlave-example',
    },
    {
      name: 'cluster:roundRobin oss client',
      nfs: new Client(roundRobinClusterConfig),
      prefix: '/oss-cnpm-roundRobin-example',
    },
  ].forEach(item => {
    describe(item.name, () => {
      const nfs = item.nfs;
      const key = item.prefix + '/-/example2.js-' + process.version;

      it('should upload file', async () => {
        const info = await nfs.upload(__filename, { key });
        if (config.mode === 'public') {
          assert.equal(typeof info.url, 'string');
        } else {
          assert.equal(typeof info.key, 'string');
        }
      });

      it('should upload bytes', async () => {
        const bytesKey = `${key}-upload-bytes`;
        await nfs.uploadBytes('hello oss-cnpm 😄', { key: bytesKey });
        const bytes = await nfs.readBytes(bytesKey);
        assert(bytes.toString() === 'hello oss-cnpm 😄');
      });

      if (!nfs._cluster) {
        it('should append bytes', async () => {
          const bytesKey = `${key}-append-bytes.log`;
          await nfs.remove(bytesKey);

          const contentType = 'text/plain; charset=UTF-8';
          const { nextAppendPosition } = await nfs.appendBytes('hello oss-cnpm 😄', {
            key: bytesKey,
            headers: {
              'Content-Type': contentType,
            },
          });
          assert(nextAppendPosition);
          console.log('nextAppendPosition', nextAppendPosition);
          await nfs.appendBytes(' world (*´▽｀)ノノ\nNew line', {
            key: bytesKey,
            position: nextAppendPosition,
            headers: {
              'Content-Type': contentType,
            },
          });
          const bytes = await nfs.readBytes(bytesKey);
          assert(bytes.toString() === 'hello oss-cnpm 😄 world (*´▽｀)ノノ\nNew line');
          const url = await nfs.url(bytesKey);
          const { headers } = await urllib.request(url);
          console.log(url);
          assert(headers['content-type'] === 'text/plain; charset=UTF-8');
        });
      }

      it('should download file', async () => {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        await nfs.download(key, tmpfile);
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should get download stream', async () => {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        const stream = await nfs.createDownloadStream(key);
        const ws = fs.createWriteStream(tmpfile);
        function end() {
          return function(callback) {
            ws.on('close', callback);
          };
        }
        stream.pipe(ws);
        await end();
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should create signature url', async () => {
        const url = await nfs.url(key);
        assert.equal(typeof url, 'string');
        assert(url.startsWith('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key)
          || url.startsWith('https://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-beijing.aliyuncs.com' + key));
      });

      it('should create signature url with ":"', async () => {
        const url = await nfs.url('///dist/tensorflow/images/sha256%3A02fde75423b21c534ca1bf6ef071c7272a2b37d60028b7fe70f9fd3a8d43d2d7');
        assert.equal(typeof url, 'string');
        assert(url.startsWith('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com/dist/tensorflow/images/sha256%3A02fde75423b21c534ca1bf6ef071c7272a2b37d60028b7fe70f9fd3a8d43d2d7')
          || url.startsWith('https://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-beijing.aliyuncs.com/dist/tensorflow/images/sha256%3A02fde75423b21c534ca1bf6ef071c7272a2b37d60028b7fe70f9fd3a8d43d2d7'));
      });

      it('should upload file with headers', async () => {
        const cacheKey = key + '-cache';
        const info = await nfs.upload(__filename, {
          key: cacheKey,
        });
        if (config.mode === 'public') {
          assert.equal(typeof info.url, 'string');
          const r = await urllib.request(info.url, {
            method: 'GET',
          });
          // console.log(r.status, r.headers);
          assert.equal(r.status, 200);
          assert.equal(r.headers['cache-control'], 'max-age=0, s-maxage=60');
        } else {
          assert.equal(typeof info.key, 'string');
          const url = await nfs.url(info.key);
          // console.log(url);
          const r = await urllib.request(url, {
            method: 'GET',
          });
          // console.log(r.status, r.headers);
          assert.equal(r.status, 200);
          assert.equal(r.headers['cache-control'], 'max-age=0, s-maxage=60');
        }
      });

      it('should remove the file', async () => {
        const tmpfile = path.join(__dirname, '.tmp-file.js');
        await nfs.download(key, tmpfile);
        await nfs.remove(key);
        try {
          await nfs.download(key, tmpfile);
          throw new Error('should not run this');
        } catch (err) {
          assert.equal(err.name, 'NoSuchKeyError');
        }
      });

      it('should list files', async () => {
        const prefix = item.prefix.substring(1);
        const files = await nfs.list(`${prefix}/-/`);
        assert(files);
        assert(files.length);
      });

      it('should list with max', async () => {
        const prefix = item.prefix.substring(1);
        const files = await nfs.list(`${prefix}/-/`, {
          max: 1,
        });
        assert(files);
        assert(files.length > 0);
      });
    });
  });

  describe('cluster client', () => {
    it('should create signature url with bucket2', async () => {
      const nfs = new Client({
        cluster: masterSlaveClusterConfig.cluster,
      });
      const key = '/foo/bar/ok.tgz';
      let url = await nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      assert.equal(typeof url, 'string');
      // console.log(url);
      assert.equal(url.indexOf('https://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      url = await nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET });
      assert.equal(typeof url, 'string');
      // console.log(url);
      assert.equal(url.indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      // default bucket
      url = await nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 + '-not-exists' });
      assert.equal(typeof url, 'string');
      // console.log(url);
      assert.equal(url.indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      // not availables
      nfs.client.availables[1] = false;
      url = await nfs.url(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      nfs.client.availables[1] = true;
      assert.equal(typeof url, 'string');
      // console.log(url);
      assert.equal(url.indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);
    });

    it('should multi urls', async () => {
      const nfs = new Client({
        cluster: masterSlaveClusterConfig.cluster,
      });
      const key = '/foo/bar/ok.tgz';
      let urls = await nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      // console.log(urls);
      assert.equal(urls[0].indexOf('https://' + process.env.OSS_CNPM_BUCKET2 + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      urls = await nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      // console.log(urls);
      assert.equal(urls[0].indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      // default bucket
      urls = await nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 + '-not-exists' });
      assert(Array.isArray(urls));
      assert(urls.length === 2);
      // console.log(urls);
      assert.equal(urls[0].indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      // not availables
      nfs.client.availables[1] = false;
      urls = await nfs.urls(key, { bucket: process.env.OSS_CNPM_BUCKET2 });
      nfs.client.availables[1] = true;
      assert(Array.isArray(urls));
      assert(urls.length === 1);
      // console.log(urls);
      assert.equal(urls[0].indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);

      urls = await nfs.urls(key);
      assert(Array.isArray(urls));
      assert(urls.length === 1);
      // console.log(urls);
      assert.equal(urls[0].indexOf('https://' + process.env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com' + key), 0);
    });
  });
});
