'use strict';

const env = process.env;

module.exports = {
  // mode: 'public',
  // mode: env.OSS_CNPM_MODE,
  // cdnBaseUrl: 'https://' + env.OSS_CNPM_BUCKET + '.oss-cn-beijing.aliyuncs.com',
  defaultHeaders: {
    'Cache-Control': 'max-age=0, s-maxage=60',
  },
  cluster: [
    {
      // endpoint: 'oss-cn-beijing.aliyuncs.com',
      endpoint: 'https://oss-cn-beijing.aliyuncs.com',
      bucket: env.OSS_CNPM_BUCKET,
      accessKeyId: env.OSS_CNPM_ID,
      accessKeySecret: env.OSS_CNPM_SECRET,
    },
    {
      // endpoint: 'oss-cn-beijing.aliyuncs.com',
      endpoint: 'https://oss-cn-beijing.aliyuncs.com',
      bucket: env.OSS_CNPM_BUCKET2,
      accessKeyId: env.OSS_CNPM_ID,
      accessKeySecret: env.OSS_CNPM_SECRET,
    },
  ],
};
