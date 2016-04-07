'use strict';

const env = process.env;

module.exports = {
  cdnBaseUrl: 'https://foo.com',
  bucket: env.OSS_CNPM_BUCKET,
  accessKeyId: env.OSS_CNPM_ID,
  accessKeySecret: env.OSS_CNPM_SECRET,
  // mode: env.OSS_CNPM_MODE,
};
