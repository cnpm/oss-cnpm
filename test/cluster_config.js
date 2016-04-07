'use strict';

const env = process.env;

module.exports = {
  // mode: env.OSS_CNPM_MODE,
  cdnBaseUrl: 'https://foo.com',
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
