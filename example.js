/**!
 * oss-cnpm - example.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var oss = require('./');
var fs = require('fs');
var assert = require('assert');
var co = require('co');
var nfs = oss.create(require('./config'));
var key = '/oss-cnpm-example/-/example2.js';
var srcPath = __dirname + '/example.js';
var distPath = '/tmp/example.js';

co(function *() {
  var r = yield nfs.upload(srcPath, {key: key});
  console.log('upload success: %j', r);
  r = yield nfs.download(key, distPath);
  assert(fs.existsSync(distPath));
  console.log('download success');
  fs.unlinkSync(distPath);
  r = yield nfs.remove(key);
  console.log('remove success');
  try {
    yield nfs.download(key, distPath + '.error');
  } catch (err) {
    console.log('get %s response %s', key, err.status);
  }
})();

// callback work
nfs.upload(srcPath, {key: key + '2'}, function (err, r) {
  if (err) {
    throw err;
  }
  console.log('upload callback work: %j', r);
});
