var env = process.env;

module.exports = {
  bucket: env.OSS_CNPM_BUCKET,
  accessKeyId: env.OSS_CNPM_ID,
  accessKeySecret: env.OSS_CNPM_SECRET,
  mode: env.OSS_CNPM_MODE,
  publicRoot: env.OSS_CNPM_PUBLIC_ROOT
};
