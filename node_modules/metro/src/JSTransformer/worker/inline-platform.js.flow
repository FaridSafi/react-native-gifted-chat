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

const importMap = new Map([['ReactNative', 'react-native']]);

function createInlinePlatformChecks(
  t: BabelTypes,
  requireName: string = 'require',
) {
  const isPlatformNode = (
    node: Object,
    scope: Object,
    isWrappedModule: boolean,
  ): boolean =>
    isPlatformOS(node, scope, isWrappedModule) ||
    isReactPlatformOS(node, scope, isWrappedModule);

  const isPlatformSelectNode = (
    node: Object,
    scope: Object,
    isWrappedModule: boolean,
  ): boolean =>
    isPlatformSelect(node, scope, isWrappedModule) ||
    isReactPlatformSelect(node, scope, isWrappedModule);

  const isPlatformOS = (node, scope, isWrappedModule: boolean): boolean =>
    t.isIdentifier(node.property, {name: 'OS'}) &&
    isImportOrGlobal(node.object, scope, [{name: 'Platform'}], isWrappedModule);

  const isReactPlatformOS = (node, scope, isWrappedModule: boolean): boolean =>
    t.isIdentifier(node.property, {name: 'OS'}) &&
    t.isMemberExpression(node.object) &&
    t.isIdentifier(node.object.property, {name: 'Platform'}) &&
    isImportOrGlobal(
      node.object.object,
      scope,
      [{name: 'React'}, {name: 'ReactNative'}],
      isWrappedModule,
    );

  const isPlatformSelect = (node, scope, isWrappedModule: boolean): boolean =>
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property, {name: 'select'}) &&
    isImportOrGlobal(
      node.callee.object,
      scope,
      [{name: 'Platform'}],
      isWrappedModule,
    );

  const isReactPlatformSelect = (
    node,
    scope,
    isWrappedModule: boolean,
  ): boolean =>
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property, {name: 'select'}) &&
    t.isMemberExpression(node.callee.object) &&
    t.isIdentifier(node.callee.object.property, {name: 'Platform'}) &&
    isImportOrGlobal(
      node.callee.object.object,
      scope,
      [{name: 'React'}, {name: 'ReactNative'}],
      isWrappedModule,
    );

  const isGlobal = (binding): boolean => !binding;

  const isRequireCall = (node, dependencyId: string, scope): boolean =>
    t.isCallExpression(node) &&
    t.isIdentifier(node.callee, {name: requireName}) &&
    checkRequireArgs(node.arguments, dependencyId);

  const isImport = (node, scope, patterns: Array<{|name: string|}>): boolean =>
    patterns.some((pattern: {|name: string|}) => {
      const importName = importMap.get(pattern.name) || pattern.name;
      return isRequireCall(node, importName, scope);
    });

  const isImportOrGlobal = (
    node,
    scope,
    patterns: Array<{|name: string|}>,
    isWrappedModule: boolean,
  ): boolean => {
    const identifier = patterns.find((pattern: {|name: string|}) =>
      t.isIdentifier(node, pattern),
    );
    return (
      (!!identifier &&
        isToplevelBinding(
          scope.getBinding(identifier.name),
          isWrappedModule,
        )) ||
      isImport(node, scope, patterns)
    );
  };

  const checkRequireArgs = (args, dependencyId: string): boolean => {
    const pattern = t.stringLiteral(dependencyId);
    return (
      t.isStringLiteral(args[0], pattern) ||
      (t.isMemberExpression(args[0]) &&
        t.isNumericLiteral(args[0].property) &&
        t.isStringLiteral(args[1], pattern))
    );
  };

  const isToplevelBinding = (binding, isWrappedModule: boolean): boolean =>
    isGlobal(binding) ||
    !binding.scope.parent ||
    (isWrappedModule && !binding.scope.parent.parent);

  return {
    isPlatformNode,
    isPlatformSelectNode,
  };
}

module.exports = createInlinePlatformChecks;
