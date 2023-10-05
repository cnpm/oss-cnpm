# oss-cnpm

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

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/985607?v=4" width="100px;"/><br/><sub><b>dead-horse</b></sub>](https://github.com/dead-horse)<br/>|[<img src="https://avatars.githubusercontent.com/u/6897780?v=4" width="100px;"/><br/><sub><b>killagu</b></sub>](https://github.com/killagu)<br/>|[<img src="https://avatars.githubusercontent.com/u/32174276?v=4" width="100px;"/><br/><sub><b>semantic-release-bot</b></sub>](https://github.com/semantic-release-bot)<br/>|
| :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Fri Oct 06 2023 00:15:31 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
