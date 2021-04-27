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

function getTransitiveDependencies(path, graph) {
  const dependencies = _getDeps(path, graph, new Set()); // Remove the main entry point, since this method only returns the
  // dependencies.

  dependencies.delete(path);
  return dependencies;
}

function _getDeps(path, graph, deps) {
  if (deps.has(path)) {
    return deps;
  }

  const module = graph.dependencies.get(path);

  if (!module) {
    return deps;
  }

  deps.add(path);

  for (const dependency of module.dependencies.values()) {
    _getDeps(dependency.absolutePath, graph, deps);
  }

  return deps;
}

module.exports = getTransitiveDependencies;
