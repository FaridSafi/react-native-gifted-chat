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

const addParamsToDefineCall = require("../../lib/addParamsToDefineCall");

const generate = require("../worker/generate");

const mergeSourceMaps = require("../worker/mergeSourceMaps");

const reverseDependencyMapReferences = require("./reverse-dependency-map-references");

const virtualModule = require("../module").virtual;

const _require = require("@babel/core"),
  transformSync = _require.transformSync;

// Transformed modules have the form
//   __d(function(require, module, global, exports, dependencyMap) {
//       /* code */
//   });
//
// This function adds the numeric module ID, and an array with dependencies of
// the dependencies of the module before the closing parenthesis.
function addModuleIdsToModuleWrapper(module, idForPath) {
  const dependencies = module.dependencies,
    file = module.file;
  const code = file.code; // calling `idForPath` on the module itself first gives us a lower module id
  // for the file itself than for its dependencies. That reflects their order
  // in the bundle.

  const fileId = idForPath(file);
  const paramsToAdd = [fileId];

  if (dependencies.length) {
    paramsToAdd.push(dependencies.map(idForPath));
  }

  return addParamsToDefineCall.apply(void 0, [code].concat(paramsToAdd));
}

exports.addModuleIdsToModuleWrapper = addModuleIdsToModuleWrapper;

function inlineModuleIds(module, idForPath) {
  const dependencies = module.dependencies,
    file = module.file;
  const code = file.code,
    map = file.map,
    path = file.path; // calling `idForPath` on the module itself first gives us a lower module id
  // for the file itself than for its dependencies. That reflects their order
  // in the bundle.

  const fileId = idForPath(file);
  const dependencyIds = dependencies.map(idForPath);

  const _transformSync = transformSync(code, {
      ast: true,
      babelrc: false,
      code: false,
      configFile: false,
      plugins: [
        [
          reverseDependencyMapReferences,
          {
            dependencyIds
          }
        ]
      ]
    }),
    ast = _transformSync.ast;

  const _generate = generate(ast, path, "", true),
    generatedCode = _generate.code,
    generatedMap = _generate.map;

  return {
    moduleCode: addParamsToDefineCall(generatedCode, fileId),
    moduleMap: map && generatedMap && mergeSourceMaps(path, map, generatedMap)
  };
}

exports.inlineModuleIds = inlineModuleIds;

/**
 * 1. Adds the module ids to a file if the file is a module. If it's not (e.g.
 *    a script) it just keeps it as-is.
 * 2. Packs the function map into the file's source map, if one exists.
 */
function getModuleCodeAndMap(module, idForPath, options) {
  const file = module.file;
  let moduleCode, moduleMap;

  if (file.type !== "module") {
    moduleCode = file.code;
    moduleMap = file.map;
  } else if (!options.enableIDInlining) {
    moduleCode = addModuleIdsToModuleWrapper(module, idForPath);
    moduleMap = file.map;
  } else {
    var _inlineModuleIds = inlineModuleIds(module, idForPath);

    moduleCode = _inlineModuleIds.moduleCode;
    moduleMap = _inlineModuleIds.moduleMap;
  }

  if (moduleMap && moduleMap.sources) {
    const x_facebook_sources = [];

    if (moduleMap.sources.length >= 1) {
      x_facebook_sources.push([module.file.functionMap]);
    }

    moduleMap = _objectSpread({}, moduleMap, {
      x_facebook_sources
    });
  }

  return {
    moduleCode,
    moduleMap
  };
}

exports.getModuleCodeAndMap = getModuleCodeAndMap; // Concatenates many iterables, by calling them sequentially.

exports.concat = function* concat() {
  for (
    var _len = arguments.length, iterables = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    iterables[_key] = arguments[_key];
  }

  for (const it of iterables) {
    yield* it;
  }
}; // Creates an idempotent function that returns numeric IDs for objects based
// on their `path` property.

exports.createIdForPathFn = () => {
  const seen = new Map();
  let next = 0;
  return _ref => {
    let path = _ref.path;
    let id = seen.get(path);

    if (id == null) {
      id = next++;
      seen.set(path, id);
    }

    return id;
  };
}; // creates a series of virtual modules with require calls to the passed-in
// modules.

exports.requireCallsTo = function*(modules, idForPath, getRunModuleStatement) {
  for (const module of modules) {
    const id = idForPath(module.file);
    yield virtualModule(
      getRunModuleStatement(id),
      `/<generated>/require-${id}.js`
    );
  }
}; // Divides the modules into two types: the ones that are loaded at startup, and
// the ones loaded deferredly (lazy loaded).

exports.partition = (modules, preloadedModules) => {
  const startup = [];
  const deferred = [];

  for (const module of modules) {
    (preloadedModules.has(module.file.path) ? startup : deferred).push(module);
  }

  return [startup, deferred];
}; // Transforms a new Module object into an old one, so that it can be passed
// around code.

exports.toModuleTransport = (module, idsForPath) => {
  const dependencies = module.dependencies,
    file = module.file;

  const _getModuleCodeAndMap = getModuleCodeAndMap(
      module,
      x => idsForPath(x).moduleId,
      {
        enableIDInlining: true
      }
    ),
    moduleCode = _getModuleCodeAndMap.moduleCode,
    moduleMap = _getModuleCodeAndMap.moduleMap;

  return {
    code: moduleCode,
    dependencies,
    // ID is required but we provide an invalid one for "script"s.
    id: file.type === "module" ? idsForPath(file).localId : -1,
    map: moduleMap,
    name: file.path,
    sourcePath: file.path
  };
};
