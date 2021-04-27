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

const MAGIC_UNBUNDLE_NUMBER = require("../../shared/output/RamBundle/magic-number");

const MAGIC_UNBUNDLE_FILENAME = "UNBUNDLE";
const JS_MODULES = "js-modules";

const buildSourcemapWithMetadata = require("../../shared/output/RamBundle/buildSourcemapWithMetadata.js");

const path = require("path");

const _require = require("./util"),
  getModuleCodeAndMap = _require.getModuleCodeAndMap,
  partition = _require.partition,
  toModuleTransport = _require.toModuleTransport;

function asMultipleFilesRamBundle(_ref) {
  let filename = _ref.filename,
    idsForPath = _ref.idsForPath,
    modules = _ref.modules,
    requireCalls = _ref.requireCalls,
    preloadedModules = _ref.preloadedModules;

  const idForPath = x => idsForPath(x).moduleId;

  const _partition = partition(modules, preloadedModules),
    _partition2 = _slicedToArray(_partition, 2),
    startup = _partition2[0],
    deferred = _partition2[1];

  const startupModules = _toConsumableArray(startup).concat(
    _toConsumableArray(requireCalls)
  );

  const deferredModules = deferred.map(m => toModuleTransport(m, idsForPath));
  const magicFileContents = Buffer.alloc(4); // Just concatenate all startup modules, one after the other.

  const code = startupModules
    .map(
      m =>
        getModuleCodeAndMap(m, idForPath, {
          enableIDInlining: true
        }).moduleCode
    )
    .join("\n"); // Write one file per module, wrapped with __d() call if it proceeds.

  const extraFiles = new Map();
  deferredModules.forEach(deferredModule => {
    extraFiles.set(
      path.join(JS_MODULES, deferredModule.id + ".js"),
      deferredModule.code
    );
  }); // Prepare and write magic number file.

  magicFileContents.writeUInt32LE(MAGIC_UNBUNDLE_NUMBER, 0);
  extraFiles.set(
    path.join(JS_MODULES, MAGIC_UNBUNDLE_FILENAME),
    magicFileContents
  ); // Create the source map (with no module groups, as they are ignored).

  const map = buildSourcemapWithMetadata({
    fixWrapperOffset: false,
    lazyModules: deferredModules,
    moduleGroups: null,
    startupModules: startupModules.map(m => toModuleTransport(m, idsForPath))
  });
  return {
    code,
    extraFiles,
    map
  };
}

function createBuilder(preloadedModules, ramGroupHeads) {
  return x =>
    asMultipleFilesRamBundle(
      _objectSpread({}, x, {
        preloadedModules,
        ramGroupHeads
      })
    );
}

exports.createBuilder = createBuilder;
