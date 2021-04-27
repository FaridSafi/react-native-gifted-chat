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

const getAppendScripts = require("../../lib/getAppendScripts");

const processModules = require("./helpers/processModules");

const _require = require("./helpers/js"),
  getJsOutput = _require.getJsOutput,
  isJsModule = _require.isJsModule;

function deltaJSBundle(entryPoint, pre, delta, revisionId, graph, options) {
  const processModuleFilter = options.processModuleFilter;
  const processOpts = {
    filter: processModuleFilter,
    dev: options.dev,
    createModuleId: options.createModuleId,
    projectRoot: options.projectRoot
  };
  const added = processModules(
    _toConsumableArray(delta.added.values()),
    processOpts
  ).map(_ref => {
    let _ref2 = _slicedToArray(_ref, 2),
      module = _ref2[0],
      code = _ref2[1];

    return [options.createModuleId(module.path), code];
  });

  if (delta.reset) {
    const modules = _toConsumableArray(graph.dependencies.values()).sort(
      (a, b) => options.createModuleId(a.path) - options.createModuleId(b.path)
    );

    const appendScripts = getAppendScripts(
      entryPoint,
      _toConsumableArray(pre).concat(_toConsumableArray(modules)),
      graph.importBundleNames,
      options
    );
    return {
      base: true,
      revisionId,
      pre: pre
        .filter(isJsModule)
        .filter(processModuleFilter)
        .map(module => getJsOutput(module).data.code)
        .join("\n"),
      post: appendScripts
        .filter(isJsModule)
        .filter(processModuleFilter)
        .map(module => getJsOutput(module).data.code)
        .join("\n"),
      modules: _toConsumableArray(added)
    };
  }

  const modified = processModules(
    _toConsumableArray(delta.modified.values()),
    processOpts
  ).map(_ref3 => {
    let _ref4 = _slicedToArray(_ref3, 2),
      module = _ref4[0],
      code = _ref4[1];

    return [options.createModuleId(module.path), code];
  });

  const deleted = _toConsumableArray(delta.deleted).map(path =>
    options.createModuleId(path)
  );

  return {
    base: false,
    revisionId,
    added,
    modified,
    deleted
  };
}

module.exports = deltaJSBundle;
