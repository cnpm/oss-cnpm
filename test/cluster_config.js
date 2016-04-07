'use strict';

const env = process.env;

module.exports = {
  // mode: 'public',
  // mode: env.OSS_CNPM_MODE,
  cdnBaseUrl: 'http://' + env.OSS_CNPM_BUCKET + '.oss-cn-hangzhou.aliyuncs.com',
  defaultHeaders: {
    'Cache-Control': 'max-age=0, s-maxage=60',
  },
  cluster: [
    {
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      bucket: env.OSS_CNPM_BUCKET,
      accessKeyId: env.OSS_CNPM_ID,
      accessKeySecret: env.OSS_CNPM_SECRET,
    },
    {
      endpoint: 'oss-cn-shenzhen.aliyuncs.com',
      bucket: env.OSS_CNPM_BUCKET2,
      accessKeyId: env.OSS_CNPM_ID,
      accessKeySecret: env.OSS_CNPM_SECRET,
    },
  ],
};
