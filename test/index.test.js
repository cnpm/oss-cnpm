/**!
 * Copyright(c) cnpm and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const oss = require('../');
const config = require('./config');
const masterSlaveClusterConfig = require('./cluster_config');

const roundRobinClusterConfig = {};
for (let key in masterSlaveClusterConfig) {
  roundRobinClusterConfig[key] = masterSlaveClusterConfig[key];
}
roundRobinClusterConfig.schedule = 'roundRobin';

describe('index.test.js', function () {
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
      var nfs = item.nfs;
      var key = item.prefix + '/-/example2.js-' + process.version;

      it('should upload file', function* () {
        var info = yield nfs.upload(__filename, {key: key});
        if (config.mode === 'public') {
          assert.equal(typeof info.url, 'string');
        } else {
          assert.equal(typeof info.key, 'string');
        }
      });

      it('should download file', function* () {
        var tmpfile = path.join(__dirname, '.tmp-file.js');
        yield nfs.download(key, tmpfile);
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should get download stream', function* () {
        var tmpfile = path.join(__dirname, '.tmp-file.js');
        var stream = yield nfs.createDownloadStream(key);
        var ws = fs.createWriteStream(tmpfile);
        function end() {
          return function (callback) {
            ws.on('close', callback);
          };
        }
        stream.pipe(ws);
        yield end();
        assert.equal(fs.readFileSync(tmpfile, 'utf8'), fs.readFileSync(__filename, 'utf8'));
      });

      it('should create signature url', function* () {
        const url = yield nfs.url(key);
        assert.equal(typeof url, 'string');
      });

      it('should remove the file', function* () {
        var tmpfile = path.join(__dirname, '.tmp-file.js');
        yield nfs.download(key, tmpfile);
        yield nfs.remove(key);
        try {
          yield nfs.download(key, tmpfile);
          throw new Error('should not run this');
        } catch (err) {
          assert.equal(err.name, 'NoSuchKeyError');
        }
      });

    });
  });
});
