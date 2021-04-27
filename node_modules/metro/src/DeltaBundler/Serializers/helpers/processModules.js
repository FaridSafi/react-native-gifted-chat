/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
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

const _require = require("./js"),
  isJsModule = _require.isJsModule,
  wrapModule = _require.wrapModule;

function processModules(modules, _ref) {
  let _ref$filter = _ref.filter,
    filter = _ref$filter === void 0 ? () => true : _ref$filter,
    createModuleId = _ref.createModuleId,
    dev = _ref.dev,
    projectRoot = _ref.projectRoot;
  return _toConsumableArray(modules)
    .filter(isJsModule)
    .filter(filter)
    .map(module => [
      module,
      wrapModule(module, {
        createModuleId,
        dev,
        projectRoot
      })
    ]);
}

module.exports = processModules;
