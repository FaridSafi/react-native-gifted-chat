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

function sliceModules(moduleLengths, str, startOffset) {
  const modules = [];
  let offset = startOffset;

  for (const _ref of moduleLengths) {
    var _ref2 = _slicedToArray(_ref, 2);

    const id = _ref2[0];
    const length = _ref2[1];
    modules.push([id, str.slice(offset, offset + length)]);

    if (length > 0) {
      // Modules are separated by a line break, when their code is non-null.
      offset += length + 1;
    }
  }

  return [offset, modules];
}
/**
 * Parses a bundle from an embedded delta bundle.
 */

function stringToBundle(str, metadata) {
  const pre = str.slice(0, metadata.pre);

  const _sliceModules = sliceModules(
      metadata.modules,
      str, // There's a line break after the pre segment, when it exists.
      pre.length > 0 ? pre.length + 1 : 0
    ),
    _sliceModules2 = _slicedToArray(_sliceModules, 2),
    offset = _sliceModules2[0],
    modules = _sliceModules2[1]; // We technically don't need the bundle post segment length, since it should
  // normally continue until the end.

  const post = str.slice(offset, offset + metadata.post);
  return {
    pre,
    post,
    modules
  };
}

module.exports = stringToBundle;
