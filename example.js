var oss = require('./');
var fs = require('fs');
var assert = require('assert');

var nfs = oss.create(require('./config'));
var key = 'key';
var srcPath = './src.tgz';
var distPath = './dist.tgz';

nfs.upload(srcPath, {key: key}, function (err, data) {
  assert(!err);
  var ws = fs.createWriteStream(distPath);
  nfs.downloadStream(key, ws, function (err, data) {
    assert(!err);
  });
  ws.on('finish', function () {
    assert(fs.statSync(distPath));
    fs.unlinkSync(distPath);
    nfs.remove(key, function (err, data) {
      assert(!err);
      ws = fs.createWriteStream(distPath);
      nfs.downloadStream(key, ws, function (err, data) {
        assert(err);
      });
      ws.on('finish', function () {
        fs.unlinkSync(distPath);
      });
    });
  });
});
