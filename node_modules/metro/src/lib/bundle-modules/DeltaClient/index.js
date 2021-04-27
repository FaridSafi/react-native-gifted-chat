/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

/* eslint-env worker, serviceworker */
"use strict";

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const BundleNotFoundError = require("./BundleNotFoundError");

const bundleToString = require("./bundleToString");

const patchBundle = require("./patchBundle");

const stringToBundle = require("./stringToBundle");

const _require = require("./bundleDB"),
  openDB = _require.openDB,
  getBundleMetadataFromDB = _require.getBundleMetadata,
  setBundleMetadata = _require.setBundleMetadata,
  removeBundleMetadata = _require.removeBundleMetadata;

const _require2 = require("./metadata"),
  fetchBundleMetadata = _require2.fetchBundleMetadata;

const _require3 = require("./response"),
  createResponse = _require3.createResponse,
  getRevisionId = _require3.getRevisionId;

function defaultGetDeltaBundle(_x, _x2, _x3) {
  return _defaultGetDeltaBundle.apply(this, arguments);
}

function _defaultGetDeltaBundle() {
  _defaultGetDeltaBundle = _asyncToGenerator(function*(
    bundleUrl,
    fromRevisionId,
    toRevisionId
  ) {
    const url = new URL(bundleUrl);
    url.pathname = url.pathname.replace(/\.(bundle|js)$/, ".delta");

    if (fromRevisionId != null) {
      url.searchParams.append("revisionId", fromRevisionId);
    }

    const res = yield fetch(url.href, {
      includeCredentials: true
    });
    const json = yield res.json();

    if (res.status != 200 && res.status != 304) {
      throw new Error(
        `Error retrieving delta for the bundle \`${bundleUrl}\`: ${
          json.type
        }: ${json.message}`
      );
    }

    return json;
  });
  return _defaultGetDeltaBundle.apply(this, arguments);
}

const DEFAULT_DB_NAME = "__metroBundleDB";
const CACHE_VERSION = 1;
const DEFAULT_CACHE_NAME = "__metroBundleCacheV" + CACHE_VERSION;

function create() {
  let _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$getDeltaBundle = _ref.getDeltaBundle,
    getDeltaBundle =
      _ref$getDeltaBundle === void 0
        ? defaultGetDeltaBundle
        : _ref$getDeltaBundle,
    _ref$getBundleMetadat = _ref.getBundleMetadata,
    getBundleMetadata =
      _ref$getBundleMetadat === void 0
        ? fetchBundleMetadata
        : _ref$getBundleMetadat,
    _ref$bundleCacheName = _ref.bundleCacheName,
    bundleCacheName =
      _ref$bundleCacheName === void 0
        ? DEFAULT_CACHE_NAME
        : _ref$bundleCacheName,
    _ref$bundleDBName = _ref.bundleDBName,
    bundleDBName =
      _ref$bundleDBName === void 0 ? DEFAULT_DB_NAME : _ref$bundleDBName;

  const cachePromise = caches.open(bundleCacheName);
  const dbPromise = openDB(DEFAULT_DB_NAME);

  const getBundle =
    /*#__PURE__*/
    (function() {
      var _ref2 = _asyncToGenerator(function*(
        bundleKey,
        revisionId,
        waitUntil
      ) {
        const cache = yield cachePromise;
        const db = yield dbPromise;
        const prevBundleRes = yield cache.match(bundleKey);

        if (prevBundleRes == null) {
          throw new BundleNotFoundError(bundleKey);
        }

        const prevRevisionId = getRevisionId(prevBundleRes);

        if (revisionId === prevRevisionId) {
          return prevBundleRes;
        }

        const _ref3 = yield Promise.all([
            prevBundleRes.text(),
            _asyncToGenerator(function*() {
              const metadata = yield getBundleMetadataFromDB(
                db,
                prevRevisionId
              );

              if (metadata != null) {
                return metadata;
              }

              return yield getBundleMetadata(bundleKey, prevRevisionId);
            })(),
            getDeltaBundle(bundleKey, prevRevisionId, revisionId)
          ]),
          _ref4 = _slicedToArray(_ref3, 3),
          prevStringBundle = _ref4[0],
          prevBundleMetadata = _ref4[1],
          delta = _ref4[2];

        const prevBundle = stringToBundle(prevStringBundle, prevBundleMetadata);
        const bundle = delta.base
          ? {
              pre: delta.pre,
              post: delta.post,
              modules: delta.modules
            }
          : patchBundle(prevBundle, {
              added: delta.added,
              modified: delta.modified,
              deleted: delta.deleted
            });

        const _bundleToString = bundleToString(bundle),
          stringBundle = _bundleToString.code,
          metadata = _bundleToString.metadata;

        const bundleRes = createResponse(
          stringBundle,
          revisionId,
          _toConsumableArray(prevBundleRes.headers).concat([
            ["Date", new Date().toUTCString()]
          ])
        );
        waitUntil(
          Promise.all([
            cache.put(bundleKey, bundleRes.clone()),
            setBundleMetadata(db, revisionId, metadata),
            removeBundleMetadata(db, prevRevisionId)
          ])
        );
        return bundleRes;
      });

      return function getBundle(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    })();

  const registerBundle = (
    bundleKey,
    initialRevisionId,
    initialBundleRes,
    waitUntil
  ) => {
    const res = createResponse(
      initialBundleRes.clone().body,
      initialRevisionId,
      initialBundleRes.headers
    );
    waitUntil(
      Promise.all([
        _asyncToGenerator(function*() {
          const cache = yield cachePromise;
          yield cache.put(bundleKey, res);
        })(),
        _asyncToGenerator(function*() {
          const db = yield dbPromise;
          const metadata = yield getBundleMetadataFromDB(db, initialRevisionId);

          if (metadata != null) {
            return;
          }

          yield setBundleMetadata(
            db,
            initialRevisionId,
            yield getBundleMetadata(bundleKey, initialRevisionId)
          );
        })()
      ])
    );
    return res;
  };

  return {
    getBundle,
    registerBundle
  };
}

module.exports = {
  create,
  BundleNotFoundError,
  CACHE_VERSION
};
