/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+metro_bundler
 * @format
 * @flow strict-local
 */

'use strict';

const nullthrows = require('nullthrows');

import type {CustomTransformOptions} from '../JSTransformer/worker';

const PREFIX = 'transform.';

module.exports = function parseCustomTransformOptions(urlObj: {
  query?: {[string]: string},
}): CustomTransformOptions {
  const customTransformOptions = Object.create(null);
  const query = nullthrows(urlObj.query);

  Object.keys(query).forEach((key: string) => {
    if (key.startsWith(PREFIX)) {
      customTransformOptions[key.substr(PREFIX.length)] = query[key];
    }
  });

  return customTransformOptions;
};
