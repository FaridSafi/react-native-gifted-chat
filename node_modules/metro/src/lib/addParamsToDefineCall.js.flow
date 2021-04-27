/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

/**
 * Simple way of adding additional parameters to the end of the define calls.
 *
 * This is used to add extra information to the generaic compiled modules (like
 * the dependencyMap object or the list of inverse dependencies).
 */
function addParamsToDefineCall(
  code: string,
  ...paramsToAdd: Array<mixed>
): string {
  const index = code.lastIndexOf(')');
  const params = paramsToAdd.map(param =>
    param !== undefined ? JSON.stringify(param) : 'undefined',
  );

  return code.slice(0, index) + ',' + params.join(',') + code.slice(index);
}

module.exports = addParamsToDefineCall;
