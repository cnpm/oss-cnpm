# Changelog

## [5.0.0](https://github.com/cnpm/oss-cnpm/compare/v4.0.1...v5.0.0) (2023-10-05)


### ⚠ BREAKING CHANGES

* Drop Node.js < 16 support

Upgrade oss-client to v2

### Features

* drop cluster-mode support ([#29](https://github.com/cnpm/oss-cnpm/issues/29)) ([f2e22de](https://github.com/cnpm/oss-cnpm/commit/f2e22dee2a3f3e6c0a7d2a6734018a9cd7136292))

## [4.0.1](https://github.com/cnpm/oss-cnpm/compare/v4.0.0...v4.0.1) (2022-12-17)


### Bug Fixes

* Auto release on github action ([f0bcfa9](https://github.com/cnpm/oss-cnpm/commit/f0bcfa9a7b19a615ecf64a7d8487ea0636e8d544))

---


4.0.0 / 2022-10-23
==================

**features**
  * [[`7796069`](http://github.com/cnpm/oss-cnpm/commit/7796069d96f13017c33b4b2dd46d04ebc32c98fa)] - 📦 NEW: [BREAKING] Use oss-client instead of ali-oss (#28) (fengmk2 <<fengmk2@gmail.com>>)

**others**
  * [[`d90e4d8`](http://github.com/cnpm/oss-cnpm/commit/d90e4d8a5351fc2d6492ce547aee7d6456f768c7)] - Create codeql.yml (fengmk2 <<fengmk2@gmail.com>>)

3.0.2 / 2021-12-13
==================

**others**
  * [[`79a0a6a`](http://github.com/cnpm/oss-cnpm/commit/79a0a6a1bfc080017dd000f72f3b1db8a38b3a6f)] - 🐛 FIX: Autofix internal oss endpoint (#27) (fengmk2 <<fengmk2@gmail.com>>)

3.0.1 / 2021-12-12
==================

**others**
  * [[`259aeeb`](http://github.com/cnpm/oss-cnpm/commit/259aeebbe5f459c4abf5dd3a687248056ebdfae5)] - 🐛 FIX: appendBytes support custom headers (#26) (fengmk2 <<fengmk2@gmail.com>>)

3.0.0 / 2021-12-12
==================

**others**
  * [[`5657ec0`](http://github.com/cnpm/oss-cnpm/commit/5657ec0fae0d86901f45f3ca5a97b4b4d8fae3d6)] - ‼️ BREAKING: refactor with async/await (#25) (fengmk2 <<fengmk2@gmail.com>>)

2.6.0 / 2021-04-30
==================

**features**
  * [[`a265b4c`](http://github.com/cnpm/oss-cnpm/commit/a265b4c126aabd30f56eefeedda19a5f143996c3)] - feat: impl list api (#24) (killa <<killa123@126.com>>)

2.5.0 / 2020-07-27
==================

**features**
  * [[`8550fcf`](http://github.com/cnpm/oss-cnpm/commit/8550fcfb85c33878001676cd2e3132a7a62c70f8)] - feat: support encode name (#23) (fengmk2 <<fengmk2@gmail.com>>)

2.4.1 / 2018-06-05
==================

**fixes**
  * [[`44a6a75`](http://github.com/cnpm/oss-cnpm/commit/44a6a75a7e993e02381d7d6ce673f904865501d9)] - fix: should keep one url when bucket missing (fengmk2 <<fengmk2@gmail.com>>)

2.4.0 / 2018-06-05
==================

**features**
  * [[`6bca566`](http://github.com/cnpm/oss-cnpm/commit/6bca56654ad04604d57912d51f715fc3bfb5c261)] - feat: support nfs.urls(key, options) (#19) (fengmk2 <<fengmk2@gmail.com>>)

2.3.0 / 2018-05-21
==================

**features**
  * [[`9cdf8c9`](http://github.com/cnpm/oss-cnpm/commit/9cdf8c9efc54e4fc545378bddf13084cad3f6a33)] - feat: nfs.url() support options.bucket (#18) (fengmk2 <<fengmk2@gmail.com>>)

2.2.0 / 2018-01-03
==================

**others**
  * [[`03235fe`](http://github.com/cnpm/oss-cnpm/commit/03235fe271d67e2a6b0f4a48b877549895366db1)] - signature supports additional options (hyj1991 <<hugh.hyj@alibaba-inc.com>>)

2.1.0 / 2016-04-08
==================

  * feat: support upload file with custom headers
  * feat: support OSS CDN Url

2.0.1 / 2015-09-30
==================

 * use ali-oss@3

2.0.0 / 2015-09-29
==================

 * test: use eslint
 * test: use codecov.io
 * feat: support oss cluster client

1.1.1 / 2015-04-20
==================

 * fix stream

1.1.0 / 2015-04-20
==================

 * add createDownloadStream()
 * Upgrade ali-oss to v2

1.0.1 / 2015-02-01
==================

 * fix: url() is not generator

1.0.0 / 2015-01-31
==================

 * feat: support url(key)

0.2.2 / 2014-04-14
==================

 * support oss public mode

0.2.1 / 2014-04-11
==================

  * update ali-oss, support timeout
  * Merge pull request #6 from cnpm/simplify
  * fix history

0.2.0 / 2014-04-10
==================

  * use ali-oss

0.1.1 / 2014-03-07
==================

  * add uploadBuffer and jshint, update thunkify-wrap
  * simplify thunkify

0.1.0 / 2014-02-28

  * keep thunkify, let it use on co and callback ways both

0.0.4 / 2014-02-28
==================

  * Merge pull request #1 from cnpm/update-oss
  * rm co
  * update oss-client to 0.3.4

0.0.3 / 2014-02-28
==================

  * translate to thunkify
  * Release 0.0.2
  * fix prefix / error

0.0.2 / 2014-01-14
==================

  * fix prefix / error

0.0.1 / 2014-01-14
==================

  * complete wraper oss for cnpmjs.org
  * Initial commit
