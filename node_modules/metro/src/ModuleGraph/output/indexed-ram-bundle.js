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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
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

const buildSourcemapWithMetadata = require("../../shared/output/RamBundle/buildSourcemapWithMetadata.js");

const invariant = require("invariant");

const _require = require("../../Bundler/util"),
  createRamBundleGroups = _require.createRamBundleGroups;

const _require2 = require("../../shared/output/RamBundle/as-indexed-file"),
  buildTableAndContents = _require2.buildTableAndContents,
  createModuleGroups = _require2.createModuleGroups;

const _require3 = require("./util"),
  getModuleCodeAndMap = _require3.getModuleCodeAndMap,
  partition = _require3.partition,
  toModuleTransport = _require3.toModuleTransport;

function asIndexedRamBundle(_ref) {
  let filename = _ref.filename,
    idsForPath = _ref.idsForPath,
    modules = _ref.modules,
    preloadedModules = _ref.preloadedModules,
    ramGroupHeads = _ref.ramGroupHeads,
    requireCalls = _ref.requireCalls;

  const idForPath = x => idsForPath(x).moduleId;

  const _partition = partition(modules, preloadedModules),
    _partition2 = _slicedToArray(_partition, 2),
    startup = _partition2[0],
    deferred = _partition2[1];

  const startupModules = _toConsumableArray(startup).concat(
    _toConsumableArray(requireCalls)
  );

  const deferredModules = deferred.map(m => toModuleTransport(m, idsForPath));

  for (const m of deferredModules) {
    invariant(
      m.id >= 0,
      "A script (non-module) cannot be part of the deferred modules of a RAM bundle " +
        `(\`${m.sourcePath}\`, id=${m.id})`
    );
  }

  const ramGroups = createRamBundleGroups(
    ramGroupHeads || [],
    deferredModules,
    subtree
  );
  const moduleGroups = createModuleGroups(ramGroups, deferredModules);
  const tableAndContents = buildTableAndContents(
    startupModules
      .map(
        m =>
          getModuleCodeAndMap(m, idForPath, {
            enableIDInlining: true
          }).moduleCode
      )
      .join("\n"),
    deferredModules,
    moduleGroups,
    "utf8"
  );
  return {
    code: Buffer.concat(tableAndContents),
    map: buildSourcemapWithMetadata({
      fixWrapperOffset: false,
      lazyModules: deferredModules,
      moduleGroups,
      startupModules: startupModules.map(m => toModuleTransport(m, idsForPath))
    })
  };
}

function* subtree(moduleTransport, moduleTransportsByPath) {
  let seen =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : new Set();
  seen.add(moduleTransport.id);

  for (const _ref2 of moduleTransport.dependencies) {
    const path = _ref2.path;
    const dependency = moduleTransportsByPath.get(path);

    if (dependency && !seen.has(dependency.id)) {
      yield dependency.id;
      yield* subtree(dependency, moduleTransportsByPath, seen);
    }
  }
}

function createBuilder(preloadedModules, ramGroupHeads) {
  return x =>
    asIndexedRamBundle(
      _objectSpread({}, x, {
        preloadedModules,
        ramGroupHeads
      })
    );
}

exports.createBuilder = createBuilder;
