/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import typeof {types as BabelTypes} from '@babel/core';
import type {Path} from '@babel/traverse';

type State = {|
  opts: {|
    +dependencyIds: $ReadOnlyArray<number>,
  |},
|};

function reverseDependencyMapReferences({types: t}: {types: BabelTypes}) {
  return {
    visitor: {
      CallExpression(path: Path, state: State) {
        const {node} = path;

        if (node.callee.name === '__d') {
          const lastArg = node.arguments[0].params.slice(-1)[0];
          const depMapName = lastArg && lastArg.name;

          if (!depMapName) {
            return;
          }

          const scope = path.get('arguments.0.body').scope;
          const binding = scope.getBinding(depMapName);

          binding.referencePaths.forEach(({parentPath}) => {
            const memberNode = parentPath.node;

            if (
              memberNode.type === 'MemberExpression' &&
              memberNode.property.type === 'NumericLiteral'
            ) {
              parentPath.replaceWith(
                t.numericLiteral(
                  state.opts.dependencyIds[memberNode.property.value],
                ),
              );
            }
          });
        }
      },
    },
  };
}

module.exports = reverseDependencyMapReferences;
