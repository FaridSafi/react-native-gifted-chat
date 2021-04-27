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

const getAppendScripts = require("../../lib/getAppendScripts");

const getTransitiveDependencies = require("./helpers/getTransitiveDependencies");

const nullthrows = require("nullthrows");

const path = require("path");

const _require = require("../../Bundler/util"),
  createRamBundleGroups = _require.createRamBundleGroups;

const _require2 = require("./helpers/js"),
  isJsModule = _require2.isJsModule,
  wrapModule = _require2.wrapModule;

const _require3 = require("./sourceMapObject"),
  sourceMapObject = _require3.sourceMapObject;

function getRamBundleInfo(_x, _x2, _x3, _x4) {
  return _getRamBundleInfo.apply(this, arguments);
}
/**
 * Returns the options needed to create a RAM bundle.
 */

function _getRamBundleInfo() {
  _getRamBundleInfo = _asyncToGenerator(function*(
    entryPoint,
    pre,
    graph,
    options
  ) {
    let modules = _toConsumableArray(pre).concat(
      _toConsumableArray(graph.dependencies.values())
    );

    modules = modules.concat(
      getAppendScripts(entryPoint, modules, graph.importBundleNames, options)
    );
    modules.forEach(module => options.createModuleId(module.path));
    const ramModules = modules
      .filter(isJsModule)
      .filter(options.processModuleFilter)
      .map(module => ({
        id: options.createModuleId(module.path),
        code: wrapModule(module, options),
        map: sourceMapObject([module], {
          excludeSource: options.excludeSource,
          processModuleFilter: options.processModuleFilter
        }),
        name: path.basename(module.path),
        sourcePath: module.path,
        source: module.getSource().toString(),
        type: nullthrows(
          module.output.find(_ref => {
            let type = _ref.type;
            return type.startsWith("js");
          })
        ).type
      }));

    const _ref2 = yield _getRamOptions(
        entryPoint,
        {
          dev: options.dev,
          platform: options.platform
        },
        filePath => getTransitiveDependencies(filePath, graph),
        options.getTransformOptions
      ),
      preloadedModules = _ref2.preloadedModules,
      ramGroups = _ref2.ramGroups;

    const startupModules = [];
    const lazyModules = [];
    ramModules.forEach(module => {
      if (preloadedModules.hasOwnProperty(module.sourcePath)) {
        startupModules.push(module);
        return;
      }

      if (module.type.startsWith("js/script")) {
        startupModules.push(module);
        return;
      }

      if (module.type.startsWith("js/module")) {
        lazyModules.push(module);
      }
    });
    const groups = createRamBundleGroups(
      ramGroups,
      lazyModules,
      (module, dependenciesByPath) => {
        const deps = getTransitiveDependencies(module.sourcePath, graph);
        const output = new Set();

        for (const dependency of deps) {
          const module = dependenciesByPath.get(dependency);

          if (module) {
            output.add(module.id);
          }
        }

        return output;
      }
    );
    return {
      getDependencies: filePath => getTransitiveDependencies(filePath, graph),
      groups,
      lazyModules,
      startupModules
    };
  });
  return _getRamBundleInfo.apply(this, arguments);
}

function _getRamOptions(_x5, _x6, _x7, _x8) {
  return _getRamOptions2.apply(this, arguments);
}

function _getRamOptions2() {
  _getRamOptions2 = _asyncToGenerator(function*(
    entryFile,
    options,
    getDependencies,
    getTransformOptions
  ) {
    if (getTransformOptions == null) {
      return {
        preloadedModules: {},
        ramGroups: []
      };
    }

    const _ref3 = yield getTransformOptions(
        [entryFile],
        {
          dev: options.dev,
          hot: true,
          platform: options.platform
        },
        /*#__PURE__*/

        /* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an
         * error found when Flow v0.99 was deployed. To see the error, delete this
         * comment and run Flow. */
        (function() {
          var _ref4 = _asyncToGenerator(function*(x) {
            return Array.from(getDependencies);
          });

          return function(_x9) {
            return _ref4.apply(this, arguments);
          };
        })()
      ),
      preloadedModules = _ref3.preloadedModules,
      ramGroups = _ref3.ramGroups;

    return {
      preloadedModules: preloadedModules || {},
      ramGroups: ramGroups || []
    };
  });
  return _getRamOptions2.apply(this, arguments);
}

module.exports = getRamBundleInfo;
