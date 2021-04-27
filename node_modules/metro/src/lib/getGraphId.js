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

const canonicalize = require("metro-core/src/canonicalize");

function getGraphId(entryFile, options, _ref) {
  let shallow = _ref.shallow,
    experimentalImportBundleSupport = _ref.experimentalImportBundleSupport;
  return JSON.stringify(
    {
      entryFile,
      options: {
        customTransformOptions:
          options.customTransformOptions != null
            ? options.customTransformOptions
            : null,
        dev: options.dev,
        experimentalImportSupport: options.experimentalImportSupport || false,
        hot: options.hot,
        minify: options.minify,
        unstable_disableES6Transforms: options.unstable_disableES6Transforms,
        platform: options.platform != null ? options.platform : null,
        type: options.type,
        experimentalImportBundleSupport,
        shallow
      }
    },
    canonicalize
  );
}

module.exports = getGraphId;
