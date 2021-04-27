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

// Note: the type `Response` is a built-in object in a service worker...
const REVISION_ID_HEADER = "X-Metro-Delta-ID";

function getRevisionId(bundleRes) {
  const revisionId = bundleRes.headers.get(REVISION_ID_HEADER);

  if (revisionId == null) {
    if (__DEV__) {
      throw new Error(
        `The \`${REVISION_ID_HEADER}\` header should be present on bundle responses from the Metro server.`
      );
    } else {
      // This should never happen since we fully control the cache contents in
      // the production version of the delta client.
      throw new Error("The bundle cache is corrupted.");
    }
  }

  return revisionId;
}

function createResponse(contents, revisionId) {
  let headersEntries =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : new Map();
  const headers = new Headers();

  for (const _ref of headersEntries) {
    var _ref2 = _slicedToArray(_ref, 2);

    const name = _ref2[0];
    const value = _ref2[1];
    headers.append(name, value);
  }

  headers.set(REVISION_ID_HEADER, revisionId);
  return new Response(contents, {
    headers
  });
}

module.exports = {
  createResponse,
  getRevisionId
};
