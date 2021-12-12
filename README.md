oss-cnpm
========

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/cnpm/oss-cnpm/actions/workflows/nodejs.yml/badge.svg)](https://github.com/cnpm/oss-cnpm/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/oss-cnpm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/oss-cnpm
[codecov-image]: https://codecov.io/github/cnpm/oss-cnpm/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/cnpm/oss-cnpm?branch=master
[download-image]: https://img.shields.io/npm/dm/oss-cnpm.svg?style=flat-square
[download-url]: https://npmjs.org/package/oss-cnpm

oss wraper for [cnpmjs.org NFS](https://github.com/cnpm/cnpmjs.org/wiki/NFS-Guide)

## Usage

```js
const Client = require('oss-cnpm');

const client = new Client({
  accessKeyId: 'your id',
  accessKeySecret: 'your secret',
  // change to your endpoint
  endpoint: 'https://oss-cn-shenzhen.aliyuncs.com',
  bucket: 'your bucket',
  mode: 'public or private',
});
```

## Test keys

https://github.com/cnpm/oss-cnpm/wiki

## License

[MIT](LICENSE)

## Contributors

[![](https://ergatejs.implements.io/badges/contributors/cnpm/oss-cnpm.svg?width=1250&size=96&padding=6)](https://github.com/cnpm/oss-cnpm/graphs/contributors)
