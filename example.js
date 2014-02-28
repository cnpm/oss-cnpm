var oss = require('./');
var fs = require('fs');
var assert = require('assert');
var co = require('co');

var nfs = oss.create(require('./config'));
var key = 'heaps/-/heaps-0.0.0.tgz';
var srcPath = './src.tgz';
var distPath = './dist.tgz';

co(function *() {
  yield nfs.upload(srcPath, {key: key});
  console.log('upload success');
  yield nfs.download(key, distPath);
  assert(fs.existsSync(distPath));
  console.log('download success');
  fs.unlinkSync(distPath);
  yield nfs.remove(key);
  try {
    yield nfs.download(key, distPath);
  } catch (err) {
    console.log('remove success');
  }
})();
