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

function mergeDeltas(delta1, delta2) {
  const added1 = new Map(delta1.added);
  const modified1 = new Map(delta1.modified);
  const deleted1 = new Set(delta1.deleted);
  const added2 = new Map(delta2.added);
  const modified2 = new Map(delta2.modified);
  const deleted2 = new Set(delta2.deleted);
  const added = new Map();
  const modified = new Map();
  const deleted = new Set();

  for (const _ref of added1) {
    var _ref2 = _slicedToArray(_ref, 2);

    const id = _ref2[0];
    const code = _ref2[1];

    if (!deleted2.has(id) && !modified2.has(id)) {
      added.set(id, code);
    }
  }

  for (const _ref3 of modified1) {
    var _ref4 = _slicedToArray(_ref3, 2);

    const id = _ref4[0];
    const code = _ref4[1];

    if (!deleted2.has(id) && !modified2.has(id)) {
      modified.set(id, code);
    }
  }

  for (const id of deleted1) {
    if (!added2.has(id)) {
      deleted.add(id);
    }
  }

  for (const _ref5 of added2) {
    var _ref6 = _slicedToArray(_ref5, 2);

    const id = _ref6[0];
    const code = _ref6[1];

    if (deleted1.has(id)) {
      modified.set(id, code);
    } else {
      added.set(id, code);
    }
  }

  for (const _ref7 of modified2) {
    var _ref8 = _slicedToArray(_ref7, 2);

    const id = _ref8[0];
    const code = _ref8[1];

    if (added1.has(id)) {
      added.set(id, code);
    } else {
      modified.set(id, code);
    }
  }

  for (const id of deleted2) {
    if (!added1.has(id)) {
      deleted.add(id);
    }
  }

  return {
    added: _toConsumableArray(added.entries()),
    modified: _toConsumableArray(modified.entries()),
    deleted: _toConsumableArray(deleted)
  };
}

module.exports = mergeDeltas;
