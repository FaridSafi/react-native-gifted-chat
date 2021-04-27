/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
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

/**
 * Patches a bundle with a delta.
 */
function patchBundle(bundle, delta) {
  const map = new Map(bundle.modules);

  for (const _ref of delta.modified) {
    var _ref2 = _slicedToArray(_ref, 2);

    const key = _ref2[0];
    const value = _ref2[1];
    map.set(key, value);
  }

  for (const _ref3 of delta.added) {
    var _ref4 = _slicedToArray(_ref3, 2);

    const key = _ref4[0];
    const value = _ref4[1];
    map.set(key, value);
  }

  for (const key of delta.deleted) {
    map.delete(key);
  }

  const modules = Array.from(map.entries());
  return {
    pre: bundle.pre,
    post: bundle.post,
    modules
  };
}

module.exports = patchBundle;
