oss-cnpm
========

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/oss-cnpm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/oss-cnpm
[travis-image]: https://img.shields.io/travis/cnpm/oss-cnpm.svg?style=flat-square
[travis-url]: https://travis-ci.org/cnpm/oss-cnpm
[coveralls-image]: https://img.shields.io/coveralls/cnpm/oss-cnpm.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cnpm/oss-cnpm?branch=master
[david-image]: https://img.shields.io/david/cnpm/oss-cnpm.svg?style=flat-square
[david-url]: https://david-dm.org/cnpm/oss-cnpm
[download-image]: https://img.shields.io/npm/dm/oss-cnpm.svg?style=flat-square
[download-url]: https://npmjs.org/package/oss-cnpm

oss wraper for [cnpmjs.org NFS](https://github.com/cnpm/cnpmjs.org/wiki/NFS-Guide)

## Usage

```js
const oss = require('oss-cnpm');

const client = oss.create({
  accessKeyId: 'your id',
  accessKeySecret: 'your secret',
  // change to your endpoint
  endpoint: 'oss-cn-shenzhen.aliyuncs.com',
  bucket: 'your bucket',
  mode: 'public or private',
});
```

### Cluster mode

```js
const oss = require('oss-cnpm');

const client = oss.create({
  mode: 'public or private',
  schedule: 'masterSlave or roundRobin', // defualt is masterSlave
  cluster: [
    {
      accessKeyId: 'your id1',
      accessKeySecret: 'your secret1',
      endpoint: 'oss-cn-shenzhen.aliyuncs.com',
      bucket: 'your bucket1',
    },
    {
      accessKeyId: 'your id2',
      accessKeySecret: 'your secret2',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      bucket: 'your bucket2',
    },
  ],
});
```

## Test keys

https://github.com/cnpm/oss-cnpm/wiki

## License

[MIT](LICENSE)
