const assert = require('assert');
const Client = require('..');
const config = require('./config');

describe('test/fix_url.test.js', () => {
  it('should auto fix internal oss url to public', async () => {
    const nfs = new Client({
      ...config,
      endpoint: 'https://oss-cn-beijing-internal.aliyuncs.com',
    });
    const url = await nfs.url('foo/bar.txt');
    assert(url.startsWith('https://oss-cnpm-unittest1.oss-cn-beijing.aliyuncs.com/foo/bar.txt?OSSAccessKeyId='));
  });

  it('should support cdnBaseUrl', async () => {
    const nfs = new Client({
      ...config,
      cdnBaseUrl: 'https://foo.com',
    });
    const url = await nfs.url('foo/bar.txt');
    assert.equal(url, 'https://foo.com/foo/bar.txt');
  });
});
