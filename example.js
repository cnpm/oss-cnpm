var oss = require('./');
var fs = require('fs');
var assert = require('assert');
var co = require('co');

var nfs = oss.create(require('./config'));
var key = '/heaps/-/example2.js';
var srcPath = __dirname + '/example.js';
var distPath = '/tmp/example.js';

co(function *() {
  var r = yield nfs.upload(srcPath, {key: key});
  console.log('upload success: %j', r);
  r = yield nfs.download(key, distPath);
  assert(fs.existsSync(distPath));
  console.log('download success: %j', r);
  fs.unlinkSync(distPath);

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
