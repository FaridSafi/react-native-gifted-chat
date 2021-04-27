/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

import typeof {types as BabelTypes} from '@babel/core';

function constantFoldingPlugin(context: {types: BabelTypes}) {
  const t = context.types;

  const evaluate = function(path: Object) {
    const state = {safe: true};
    const unsafe = (path: Object, state: Object) => (state.safe = false);

    path.traverse(
      {
        CallExpression: unsafe,
        AssignmentExpression: unsafe,
      },
      state,
    );

    try {
      return state.safe ? path.evaluate() : {confident: false, value: null};
    } catch (err) {
      return {confident: false, value: null};
    }
  };

  const FunctionDeclaration = {
    exit(path: Object, state: Object): void {
      const binding =
        path.node.id !== null && path.scope.getBinding(path.node.id.name);

      if (binding && !binding.referenced) {
        state.stripped = true;
        path.remove();
      }
    },
  };

  const FunctionExpression = {
    exit(path: Object, state: Object): void {
      const parentPath = path.parentPath;

      if (t.isVariableDeclarator(parentPath)) {
        const binding = parentPath.scope.getBinding(parentPath.node.id.name);

        if (binding && !binding.referenced) {
          state.stripped = true;
          parentPath.remove();
        }
      }
    },
  };

  const Conditional = {
    exit(path: Object, state: Object): void {
      const node = path.node;
      const result = evaluate(path.get('test'));

      if (result.confident) {
        state.stripped = true;

        if (result.value || node.alternate) {
          path.replaceWith(result.value ? node.consequent : node.alternate);
        } else if (!result.value) {
          path.remove();
        }
      }
    },
  };

  const Expression = {
    exit(path: Object): void {
      const result = evaluate(path);

      if (result.confident) {
        path.replaceWith(t.valueToNode(result.value));
        path.skip();
      }
    },
  };

  const LogicalExpression = {
    exit(path: Object): void {
      const node = path.node;
      const result = evaluate(path.get('left'));

      if (result.confident) {
        const value = result.value;

        switch (node.operator) {
          case '||':
            path.replaceWith(value ? node.left : node.right);
            break;

          case '&&':
            path.replaceWith(value ? node.right : node.left);
            break;

          case '??':
            path.replaceWith(value == null ? node.right : node.left);
            break;
        }
      }
    },
  };

  const Program = {
    enter(path: Object, state: Object): void {
      state.stripped = false;
    },

    exit(path: Object, state: Object): void {
      path.traverse(
        {
          ArrowFunctionExpression: FunctionExpression,
          ConditionalExpression: Conditional,
          FunctionDeclaration,
          FunctionExpression,
          IfStatement: Conditional,
        },
        state,
      );

      if (state.stripped) {
        path.scope.crawl();

        // Re-traverse all program, if we removed any blocks. Manually re-call
        // enter and exit, because traversing a Program node won't call them.
        Program.enter(path, state);
        path.traverse(visitor);
        Program.exit(path, state);
      }
    },
  };

  const visitor = {
    BinaryExpression: Expression,
    LogicalExpression,
    Program: {...Program}, // Babel mutates objects passed.
    UnaryExpression: Expression,
  };

  return {visitor};
}

module.exports = constantFoldingPlugin;
