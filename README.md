oss-cnpm
========

oss wraper for [cnpmjs.org](http://cnpmjs.org)

## Usage

```js
var oss = require('oss-cnpm');

var client = oss({
  bucket: 'your bucket',
  accessKeyId: 'your id',
  accessKeySecret: 'your secret',
  mode: 'public or private',
});
```
