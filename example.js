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
  console.log('download success: %j', r);
  fs.unlinkSync(distPath);

  // upload Buffer
  r = yield nfs.upload(new Buffer('foo'), {key: '/oss-cnpm-example/-/test.js'});
  console.log('upload buffer success: %j', r);

  r = yield nfs.remove(key);
  console.log('remove %j', r);

  try {
    yield nfs.download(key, distPath + '.error');
  } catch (err) {
    console.log('remove success: %s', err.stack);
  }
})();

// callback work
nfs.upload(srcPath, {key: key + '2'}, function (err, r) {
  if (err) {
    throw err;
  }
  console.log('upload callback work: %j', r);
});
