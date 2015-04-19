oss-cnpm
========

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/oss-cnpm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/oss-cnpm
[travis-image]: https://img.shields.io/travis/cnpm/oss-cnpm.svg?style=flat-square
[travis-url]: https://travis-ci.org/cnpm/oss-cnpm
[coveralls-image]: https://img.shields.io/coveralls/cnpm/oss-cnpm.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cnpm/oss-cnpm?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/cnpm/oss-cnpm.svg?style=flat-square
[david-url]: https://david-dm.org/cnpm/oss-cnpm
[download-image]: https://img.shields.io/npm/dm/oss-cnpm.svg?style=flat-square
[download-url]: https://npmjs.org/package/oss-cnpm

oss wraper for [cnpmjs.org NFS](https://github.com/cnpm/cnpmjs.org/wiki/NFS-Guide)

## Usage

```js
var oss = require('oss-cnpm');

var client = oss({
  accessKeyId: 'your id',
  accessKeySecret: 'your secret',
  region: 'your bucket region',
  bucket: 'your bucket',
  mode: 'public or private',
});
```

## License

[MIT](LICENSE)
