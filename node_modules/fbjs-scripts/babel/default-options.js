/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assign = require('object-assign');

module.exports = function(options) {
  return {
    presets: [
      require('babel-preset-fbjs/configure')({
        rewriteModules: assign({
          map: require('../third-party-module-map'),
        }, options.moduleOpts),
      }),
    ],
    plugins: options.plugins || [],
  };
};
