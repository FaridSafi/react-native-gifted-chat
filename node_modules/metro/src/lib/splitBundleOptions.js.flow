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

import type {BundleOptions, SplitBundleOptions} from '../shared/types.flow';

/**
 * Splits a BundleOptions object into smaller, more manageable parts.
 */
function splitBundleOptions(options: BundleOptions): SplitBundleOptions {
  return {
    entryFile: options.entryFile,
    transformOptions: {
      customTransformOptions: options.customTransformOptions,
      dev: options.dev,
      hot: options.hot,
      minify: options.minify,
      platform: options.platform,
      type: 'module',
    },
    serializerOptions: {
      excludeSource: options.excludeSource,
      inlineSourceMap: options.inlineSourceMap,
      modulesOnly: options.modulesOnly,
      runModule: options.runModule,
      sourceMapUrl: options.sourceMapUrl,
      sourceUrl: options.sourceUrl,
    },
    graphOptions: {
      shallow: options.shallow,
    },
    onProgress: options.onProgress,
  };
}

module.exports = splitBundleOptions;
