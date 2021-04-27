/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
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

const nullthrows = require("nullthrows");

const generate = require("@babel/generator").default;
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

const template = require("@babel/template").default;
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

const traverse = require("@babel/traverse").default;

const types = require("@babel/types");

/**
 * Produces a Babel template that will throw at runtime when the require call
 * is reached. This makes dynamic require errors catchable by libraries that
 * want to use them.
 */
const dynamicRequireErrorTemplate = template(`
  (function(line) {
    throw new Error(
      'Dynamic require defined at line ' + line + '; not supported by Metro',
    );
  })(LINE)
`);
/**
 * Produces a Babel template that transforms an "import(...)" call into a
 * "require(...)" call to the asyncRequire specified.
 */

const makeAsyncRequireTemplate = template(`
  require(ASYNC_REQUIRE_MODULE_PATH)(MODULE_ID, MODULE_NAME)
`);
const makeAsyncPrefetchTemplate = template(`
  require(ASYNC_REQUIRE_MODULE_PATH).prefetch(MODULE_ID, MODULE_NAME)
`);
/**
 * Transform all the calls to `require()` and `import()` in a file into ID-
 * independent code, and return the list of dependencies. For example, a call
 * like `require('Foo')` could be transformed to `require(_depMap[3], 'Foo')`
 * where `_depMap` is provided by the outer scope. As such, we don't need to
 * know the actual module ID.
 *
 * The second argument is only provided for debugging purposes.
 */

function collectDependencies(ast, options) {
  const visited = new WeakSet();
  const state = {
    asyncRequireModulePathStringLiteral: null,
    dependency: 0,
    dependencyCalls: new Set(),
    dependencyData: new Map(),
    dependencyIndexes: new Map(),
    dependencyMapIdentifier: null,
    dynamicRequires: options.dynamicRequires,
    keepRequireNames: options.keepRequireNames,
    disableRequiresTransform: !!options.disableRequiresTransform
  };
  const visitor = {
    CallExpression(path, state) {
      if (visited.has(path.node)) {
        return;
      }

      const callee = path.get("callee");
      const name = callee.node.name;

      if (callee.isImport()) {
        processImportCall(path, state, {
          prefetchOnly: false
        });
        return;
      }

      if (name === "__prefetchImport" && !path.scope.getBinding(name)) {
        processImportCall(path, state, {
          prefetchOnly: true
        });
        return;
      }

      if (state.dependencyCalls.has(name) && !path.scope.getBinding(name)) {
        visited.add(processRequireCall(path, state).node);
      }
    },

    ImportDeclaration(path, state) {
      const dep = getDependency(state, path.node.source.value, {
        prefetchOnly: false
      });
      dep.data.isAsync = false;
    },

    Program(path, state) {
      state.asyncRequireModulePathStringLiteral = types.stringLiteral(
        options.asyncRequireModulePath
      );
      state.dependencyMapIdentifier = path.scope.generateUidIdentifier(
        "dependencyMap"
      );
      state.dependencyCalls = new Set(
        ["require"].concat(_toConsumableArray(options.inlineableCalls))
      );
    }
  };
  traverse(ast, visitor, null, state); // Compute the list of dependencies.

  const dependencies = new Array(state.dependency);

  for (const _ref of state.dependencyData) {
    var _ref2 = _slicedToArray(_ref, 2);

    const name = _ref2[0];
    const data = _ref2[1];
    dependencies[nullthrows(state.dependencyIndexes.get(name))] = {
      name,
      data
    };
  }

  return {
    ast,
    dependencies,
    dependencyMapName: nullthrows(state.dependencyMapIdentifier).name
  };
}

function processImportCall(path, state, options) {
  const name = getModuleNameFromCallArgs(path);

  if (name == null) {
    throw new InvalidRequireCallError(path);
  }

  const dep = getDependency(state, name, options);

  if (!options.prefetchOnly) {
    delete dep.data.isPrefetchOnly;
  }

  if (state.disableRequiresTransform) {
    return path;
  }

  const ASYNC_REQUIRE_MODULE_PATH = state.asyncRequireModulePathStringLiteral;
  const MODULE_ID = types.memberExpression(
    state.dependencyMapIdentifier,
    types.numericLiteral(dep.index),
    true
  );
  const MODULE_NAME = types.stringLiteral(name);

  if (!options.prefetchOnly) {
    path.replaceWith(
      makeAsyncRequireTemplate({
        ASYNC_REQUIRE_MODULE_PATH,
        MODULE_ID,
        MODULE_NAME
      })
    );
  } else {
    path.replaceWith(
      makeAsyncPrefetchTemplate({
        ASYNC_REQUIRE_MODULE_PATH,
        MODULE_ID,
        MODULE_NAME
      })
    );
  }

  return path;
}

function processRequireCall(path, state) {
  const name = getModuleNameFromCallArgs(path);

  if (name == null) {
    if (state.dynamicRequires === "reject") {
      throw new InvalidRequireCallError(path);
    }

    path.replaceWith(
      dynamicRequireErrorTemplate({
        LINE: "" + path.node.loc.start.line
      })
    );
    return path;
  }

  const dep = getDependency(state, name, {
    prefetchOnly: false
  });
  dep.data.isAsync = false;
  delete dep.data.isPrefetchOnly;

  if (state.disableRequiresTransform) {
    return path;
  }

  const moduleIDExpression = types.memberExpression(
    state.dependencyMapIdentifier,
    types.numericLiteral(dep.index),
    true
  );
  path.node.arguments = state.keepRequireNames
    ? [moduleIDExpression, types.stringLiteral(name)]
    : [moduleIDExpression];
  return path;
}

function getDependency(state, name, options) {
  let index = state.dependencyIndexes.get(name);
  let data = state.dependencyData.get(name);

  if (!data) {
    index = state.dependency++;
    data = {
      isAsync: true
    };

    if (options.prefetchOnly) {
      data.isPrefetchOnly = true;
    }

    state.dependencyIndexes.set(name, index);
    state.dependencyData.set(name, data);
  }

  return {
    index: nullthrows(index),
    data: nullthrows(data)
  };
}

function getModuleNameFromCallArgs(path) {
  if (path.get("arguments").length !== 1) {
    throw new InvalidRequireCallError(path);
  }

  const result = path.get("arguments.0").evaluate();

  if (result.confident && typeof result.value === "string") {
    return result.value;
  }

  return null;
}

collectDependencies.getModuleNameFromCallArgs = getModuleNameFromCallArgs;

class InvalidRequireCallError extends Error {
  constructor(_ref3) {
    let node = _ref3.node;
    const line = node.loc && node.loc.start && node.loc.start.line;
    super(
      `Invalid call at line ${line || "<unknown>"}: ${generate(node).code}`
    );
  }
}

collectDependencies.InvalidRequireCallError = InvalidRequireCallError;
module.exports = collectDependencies;
