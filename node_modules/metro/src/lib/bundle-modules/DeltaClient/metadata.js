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

const fetchBundleMetadata =
  /*#__PURE__*/
  (function() {
    var _ref = _asyncToGenerator(function*(bundleUrl, revisionId) {
      const url = new URL(bundleUrl);
      url.pathname = url.pathname.replace(/\.(bundle|js)$/, ".meta");
      url.searchParams.append("revisionId", revisionId);
      const res = yield fetch(url.href, {
        includeCredentials: true
      });
      const json = yield res.json();

      if (res.status != 200 && res.status != 304) {
        throw new Error(
          `Error retrieving metadata for the bundle \`${bundleUrl}\`: ${
            json.type
          }: ${json.message}`
        );
      }

      return json;
    });

    return function fetchBundleMetadata(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

module.exports = {
  fetchBundleMetadata
};
