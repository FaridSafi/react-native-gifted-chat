# changelog

## 1.0.1

* Handle overflow cases ([#9](https://github.com/Rich-Harris/vlq/pull/9))

## 1.0.0

* Rewrite in TypeScript, include definitions in package ([#6](https://github.com/Rich-Harris/vlq/pull/6))

## 0.2.3

* Add LICENSE to npm package

## 0.2.2

* Expose `pkg.module`, not `jsnext:main`

## 0.2.1

* Performance boost - vlq no longer checks that you've passed a number or an array into `vlq.encode()`, making it significantly faster

## 0.2.0

* Author as ES6 module, accessible to ES6-aware systems via the `jsnext:main` field in `package.json`

## 0.1.0

* First release
