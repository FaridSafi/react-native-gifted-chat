/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */
"use strict";
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

const traverse = require("@babel/traverse").default;

const babelGenerate = require("@babel/generator").default;

function optimizeDependencies(
  ast,
  dependencies,
  dependencyMapName,
  requireNames
) {
  const visited = new WeakSet();
  const context = {
    oldToNewIndex: new Map(),
    dependencies: []
  };
  const visitor = {
    CallExpression(path) {
      const node = path.node;

      if (visited.has(node)) {
        return;
      }

      if (isRequireCall(node.callee, requireNames)) {
        processRequireCall(node);
        visited.add(node);
      }
    },

    MemberExpression(path, state) {
      const node = path.node;

      if (visited.has(node)) {
        return;
      }

      if (isDepMapAccess(node, dependencyMapName)) {
        processDepMapAccess(context, node, dependencies);
        visited.add(node);
      }
    }
  };
  traverse(ast, visitor);
  return context.dependencies;
}

function isRequireCall(callee, requireNames) {
  return callee.type === "Identifier" && requireNames.has(callee.name);
}

function processRequireCall(node) {
  if (node.arguments.length != 2) {
    throw new InvalidRequireCallError(
      "Post-transform calls to require() expect 2 arguments, the first " +
        "of which has the shape `_dependencyMapName[123]`, " +
        `but this was found: \`${babelGenerate(node).code}\``
    );
  }

  node.arguments = [node.arguments[0]];
  return node;
}

function isDepMapAccess(node, depMapName) {
  return (
    node.computed &&
    node.object.type === "Identifier" &&
    node.object.name === depMapName &&
    node.property.type === "NumericLiteral"
  );
}

function processDepMapAccess(context, node, deps) {
  const index = node.property.value;
  const newIx = translateDependencyIndex(context, deps, index);

  if (newIx !== node.property.value) {
    node.property.value = newIx;
  }
}

function translateDependencyIndex(context, deps, index) {
  let newIndex = context.oldToNewIndex.get(index);

  if (newIndex != null) {
    return newIndex;
  }

  const dep = deps[index];

  if (dep == null) {
    throw new Error(
      `${index} is not a known module index. Existing mappings: ${deps
        .map((n, i) => `${i} => ${n.name}`)
        .join(", ")}`
    );
  }

  newIndex = context.dependencies.push(dep) - 1;
  context.oldToNewIndex.set(index, newIndex);
  return newIndex;
}

class InvalidRequireCallError extends Error {
  constructor(message) {
    super(message);
  }
}

optimizeDependencies.InvalidRequireCallError = InvalidRequireCallError;
module.exports = optimizeDependencies;
