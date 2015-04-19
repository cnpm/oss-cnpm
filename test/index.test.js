/**!
 * oss-cnpm - test/index.test.js
 *
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

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var oss = require('../');
var config = require('./config');

describe('index.test.js', function () {
  var nfs = oss.create(config);
  var key = '/oss-cnpm-example/-/example2.js-' + process.version;
  if (process.execPath.indexOf('iojs') >= 0) {
    key += '-iojs';
  }

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

  it('should create signature url', function () {
    assert.equal(typeof nfs.url(key), 'string');
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
