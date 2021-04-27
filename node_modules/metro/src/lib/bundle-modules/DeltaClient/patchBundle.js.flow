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

import type {Bundle, DeltaBundle} from '../types.flow';

/**
 * Patches a bundle with a delta.
 */
function patchBundle(bundle: Bundle, delta: DeltaBundle): Bundle {
  const map = new Map(bundle.modules);

  for (const [key, value] of delta.modified) {
    map.set(key, value);
  }

  for (const [key, value] of delta.added) {
    map.set(key, value);
  }

  for (const key of delta.deleted) {
    map.delete(key);
  }

  const modules = Array.from(map.entries());

  return {
    pre: bundle.pre,
    post: bundle.post,
    modules,
  };
}

module.exports = patchBundle;
