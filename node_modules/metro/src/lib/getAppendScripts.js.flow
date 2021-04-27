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

const countLines = require('./countLines');
const getInlineSourceMappingURL = require('../DeltaBundler/Serializers/helpers/getInlineSourceMappingURL');
const nullthrows = require('nullthrows');
const path = require('path');
const sourceMapString = require('../DeltaBundler/Serializers/sourceMapString');

import type {Module} from '../DeltaBundler';

type Options<T: number | string> = {
  +asyncRequireModulePath: string,
  +createModuleId: string => T,
  +getRunModuleStatement: T => string,
  +inlineSourceMap: ?boolean,
  +projectRoot: string,
  +runBeforeMainModule: $ReadOnlyArray<string>,
  +runModule: boolean,
  +sourceMapUrl: ?string,
  +sourceUrl: ?string,
};

function getAppendScripts<T: number | string>(
  entryPoint: string,
  modules: $ReadOnlyArray<Module<>>,
  importBundleNames: Set<string>,
  options: Options<T>,
): $ReadOnlyArray<Module<>> {
  const output = [];

  if (importBundleNames.size) {
    const importBundleNamesObject = Object.create(null);
    importBundleNames.forEach(absolutePath => {
      const bundlePath = path.relative(options.projectRoot, absolutePath);
      importBundleNamesObject[options.createModuleId(absolutePath)] =
        bundlePath.slice(0, -path.extname(bundlePath).length) + '.bundle';
    });
    const code = `(function(){var $$=${options.getRunModuleStatement(
      options.createModuleId(options.asyncRequireModulePath),
    )}$$.addImportBundleNames(${String(
      JSON.stringify(importBundleNamesObject),
    )})})();`;
    output.push({
      path: '$$importBundleNames',
      dependencies: new Map(),
      getSource: (): Buffer => Buffer.from(''),
      inverseDependencies: new Set(),
      output: [
        {
          type: 'js/script/virtual',
          data: {
            code,
            lineCount: countLines(code),
            map: [],
          },
        },
      ],
    });
  }

  if (options.runModule) {
    const paths = [...options.runBeforeMainModule, entryPoint];

    for (const path of paths) {
      if (modules.some((module: Module<>) => module.path === path)) {
        const code = options.getRunModuleStatement(
          options.createModuleId(path),
        );
        output.push({
          path: `require-${path}`,
          dependencies: new Map(),
          getSource: (): Buffer => Buffer.from(''),
          inverseDependencies: new Set(),
          output: [
            {
              type: 'js/script/virtual',
              data: {
                code,
                lineCount: countLines(code),
                map: [],
              },
            },
          ],
        });
      }
    }
  }

  if (options.inlineSourceMap || options.sourceMapUrl) {
    const sourceMappingURL = options.inlineSourceMap
      ? getInlineSourceMappingURL(
          sourceMapString(modules, {
            processModuleFilter: (): boolean => true,
            excludeSource: false,
          }),
        )
      : nullthrows(options.sourceMapUrl);

    const code = `//# sourceMappingURL=${sourceMappingURL}`;
    output.push({
      path: 'source-map',
      dependencies: new Map(),
      getSource: (): Buffer => Buffer.from(''),
      inverseDependencies: new Set(),
      output: [
        {
          type: 'js/script/virtual',
          data: {
            code,
            lineCount: countLines(code),
            map: [],
          },
        },
      ],
    });
  }

  if (options.sourceUrl) {
    const code = `//# sourceURL=${options.sourceUrl}`;
    output.push({
      path: 'source-url',
      dependencies: new Map(),
      getSource: (): Buffer => Buffer.from(''),
      inverseDependencies: new Set(),
      output: [
        {
          type: 'js/script/virtual',
          data: {
            code,
            lineCount: countLines(code),
            map: [],
          },
        },
      ],
    });
  }

  return output;
}

module.exports = getAppendScripts;
