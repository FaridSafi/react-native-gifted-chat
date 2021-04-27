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
 * Serializes a bundle into a plain JS bundle.
 */
function bundleToString(bundle) {
  let code = bundle.pre.length > 0 ? bundle.pre + "\n" : "";
  const modules = [];
  const sortedModules = bundle.modules
    .slice() // The order of the modules needs to be deterministic in order for source
    // maps to work properly.
    .sort((a, b) => a[0] - b[0]);

  for (const _ref of sortedModules) {
    var _ref2 = _slicedToArray(_ref, 2);

    const id = _ref2[0];
    const moduleCode = _ref2[1];

    if (moduleCode.length > 0) {
      code += moduleCode + "\n";
    }

    modules.push([id, moduleCode.length]);
  }

  if (bundle.post.length > 0) {
    code += bundle.post;
  } else {
    code = code.slice(0, -1);
  }

  return {
    code,
    metadata: {
      pre: bundle.pre.length,
      post: bundle.post.length,
      modules
    }
  };
}

module.exports = bundleToString;
