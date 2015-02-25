oss-cnpm
========

oss wraper for [cnpmjs.org](http://cnpmjs.org)

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
