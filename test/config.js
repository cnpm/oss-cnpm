'use strict';

const env = process.env;

module.exports = {
  cdnBaseUrl: 'http://' + env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com',
  bucket: env.OSS_CNPM_BUCKET,
  accessKeyId: env.OSS_CNPM_ID,
  accessKeySecret: env.OSS_CNPM_SECRET,
  defaultHeaders: {
    'Cache-Control': 'max-age=0, s-maxage=60',
  },
  // mode: 'public',
  // mode: env.OSS_CNPM_MODE,
};
