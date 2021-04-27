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

function greatestLowerBound<T, U>(
  elements: $ReadOnlyArray<T>,
  target: U,
  comparator: (U, T) => number,
): ?number {
  let first = 0;
  let it = 0;
  let count = elements.length;
  let step;
  while (count > 0) {
    it = first;
    step = Math.floor(count / 2);
    it = it + step;
    if (comparator(target, elements[it]) >= 0) {
      first = ++it;
      count = count - (step + 1);
    } else {
      count = step;
    }
  }
  return first ? first - 1 : null;
}

module.exports = {greatestLowerBound};
