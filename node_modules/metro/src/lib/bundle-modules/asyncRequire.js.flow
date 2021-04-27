/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 */

'use strict';

// eslint-disable-next-line lint/flow-no-fixme
const dynamicRequire = (require: $FlowFixMe);
module.exports = function(moduleID: mixed): Promise<mixed> {
  return Promise.resolve().then(() => dynamicRequire.importAll(moduleID));
};
