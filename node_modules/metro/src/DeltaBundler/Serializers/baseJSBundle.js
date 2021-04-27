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

const getAppendScripts = require("../../lib/getAppendScripts");

const processModules = require("./helpers/processModules");

function baseJSBundle(entryPoint, preModules, graph, options) {
  for (const module of graph.dependencies.values()) {
    options.createModuleId(module.path);
  }

  const processModulesOptions = {
    filter: options.processModuleFilter,
    createModuleId: options.createModuleId,
    dev: options.dev,
    projectRoot: options.projectRoot
  }; // Do not prepend polyfills or the require runtime when only modules are requested

  if (options.modulesOnly) {
    preModules = [];
  }

  const preCode = processModules(preModules, processModulesOptions)
    .map(_ref => {
      let _ref2 = _slicedToArray(_ref, 2),
        _ = _ref2[0],
        code = _ref2[1];

      return code;
    })
    .join("\n");

  const modules = _toConsumableArray(graph.dependencies.values()).sort(
    (a, b) => options.createModuleId(a.path) - options.createModuleId(b.path)
  );

  const postCode = processModules(
    getAppendScripts(
      entryPoint,
      _toConsumableArray(preModules).concat(_toConsumableArray(modules)),
      graph.importBundleNames,
      {
        asyncRequireModulePath: options.asyncRequireModulePath,
        createModuleId: options.createModuleId,
        getRunModuleStatement: options.getRunModuleStatement,
        inlineSourceMap: options.inlineSourceMap,
        projectRoot: options.projectRoot,
        runBeforeMainModule: options.runBeforeMainModule,
        runModule: options.runModule,
        sourceMapUrl: options.sourceMapUrl,
        sourceUrl: options.sourceUrl
      }
    ),
    processModulesOptions
  )
    .map(_ref3 => {
      let _ref4 = _slicedToArray(_ref3, 2),
        _ = _ref4[0],
        code = _ref4[1];

      return code;
    })
    .join("\n");
  return {
    pre: preCode,
    post: postCode,
    modules: processModules(
      _toConsumableArray(graph.dependencies.values()),
      processModulesOptions
    ).map(_ref5 => {
      let _ref6 = _slicedToArray(_ref5, 2),
        module = _ref6[0],
        code = _ref6[1];

      return [options.createModuleId(module.path), code];
    })
  };
}

module.exports = baseJSBundle;
