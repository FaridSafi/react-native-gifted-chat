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

function computeDelta(entries1, entries2) {
  const modules1 = new Map(entries1);
  const modules2 = new Map(entries2);
  const added = new Map();
  const modified = new Map();
  const deleted = new Set();

  for (const _ref of modules1.entries()) {
    var _ref2 = _slicedToArray(_ref, 2);

    const id = _ref2[0];
    const code = _ref2[1];
    const newCode = modules2.get(id);

    if (newCode == null) {
      deleted.add(id);
    } else if (newCode !== code) {
      modified.set(id, newCode);
    }
  }

  for (const _ref3 of modules2.entries()) {
    var _ref4 = _slicedToArray(_ref3, 2);

    const id = _ref4[0];
    const code = _ref4[1];

    if (!modules1.has(id)) {
      added.set(id, code);
    }
  }

  return {
    added: _toConsumableArray(added.entries()),
    modified: _toConsumableArray(modified.entries()),
    deleted: _toConsumableArray(deleted)
  };
}

module.exports = computeDelta;
