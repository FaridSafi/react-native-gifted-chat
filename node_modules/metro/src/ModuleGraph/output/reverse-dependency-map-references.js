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

function reverseDependencyMapReferences(_ref) {
  let t = _ref.types;
  return {
    visitor: {
      CallExpression(path, state) {
        const node = path.node;

        if (node.callee.name === "__d") {
          const lastArg = node.arguments[0].params.slice(-1)[0];
          const depMapName = lastArg && lastArg.name;

          if (!depMapName) {
            return;
          }

          const scope = path.get("arguments.0.body").scope;
          const binding = scope.getBinding(depMapName);
          binding.referencePaths.forEach(_ref2 => {
            let parentPath = _ref2.parentPath;
            const memberNode = parentPath.node;

            if (
              memberNode.type === "MemberExpression" &&
              memberNode.property.type === "NumericLiteral"
            ) {
              parentPath.replaceWith(
                t.numericLiteral(
                  state.opts.dependencyIds[memberNode.property.value]
                )
              );
            }
          });
        }
      }
    }
  };
}

module.exports = reverseDependencyMapReferences;
