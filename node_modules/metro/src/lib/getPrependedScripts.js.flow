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

const countLines = require('./countLines');
const defaults = require('metro-config/src/defaults/defaults');
const getPreludeCode = require('./getPreludeCode');
const transformHelpers = require('./transformHelpers');

import type Bundler from '../Bundler';
import type DeltaBundler, {Module} from '../DeltaBundler';
import type {TransformInputOptions} from '../lib/transformHelpers';
import type {ConfigT} from 'metro-config/src/configTypes.flow';

async function getPrependedScripts(
  config: ConfigT,
  options: $Diff<
    TransformInputOptions,
    {type: $PropertyType<TransformInputOptions, 'type'>},
  >,
  bundler: Bundler,
  deltaBundler: DeltaBundler<>,
): Promise<$ReadOnlyArray<Module<>>> {
  // Get all the polyfills from the relevant option params (the
  // `getPolyfills()` method and the `polyfillModuleNames` variable).
  const polyfillModuleNames = config.serializer
    .getPolyfills({
      platform: options.platform,
    })
    .concat(config.serializer.polyfillModuleNames);

  const transformOptions: TransformInputOptions = {
    ...options,
    type: 'script',
  };

  const graph = await deltaBundler.buildGraph(
    [defaults.moduleSystem, ...polyfillModuleNames],
    {
      resolve: await transformHelpers.getResolveDependencyFn(
        bundler,
        options.platform,
      ),
      transform: await transformHelpers.getTransformFn(
        [defaults.moduleSystem, ...polyfillModuleNames],
        bundler,
        deltaBundler,
        config,
        transformOptions,
      ),
      onProgress: null,
      experimentalImportBundleSupport:
        config.transformer.experimentalImportBundleSupport,
      shallow: false,
    },
  );

  return [_getPrelude({dev: options.dev}), ...graph.dependencies.values()];
}

function _getPrelude({dev}: {dev: boolean}): Module<> {
  const code = getPreludeCode({isDev: dev});
  const name = '__prelude__';

  return {
    dependencies: new Map(),
    getSource: (): Buffer => Buffer.from(code),
    inverseDependencies: new Set(),
    path: name,
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
  };
}

module.exports = getPrependedScripts;
