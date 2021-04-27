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

import type {ModuleMap, DeltaBundle} from '../lib/bundle-modules/types.flow';

function computeDelta(entries1: ModuleMap, entries2: ModuleMap): DeltaBundle {
  const modules1 = new Map(entries1);
  const modules2 = new Map(entries2);
  const added = new Map();
  const modified = new Map();
  const deleted = new Set();

  for (const [id, code] of modules1.entries()) {
    const newCode = modules2.get(id);
    if (newCode == null) {
      deleted.add(id);
    } else if (newCode !== code) {
      modified.set(id, newCode);
    }
  }

  for (const [id, code] of modules2.entries()) {
    if (!modules1.has(id)) {
      added.set(id, code);
    }
  }

  return {
    added: [...added.entries()],
    modified: [...modified.entries()],
    deleted: [...deleted],
  };
}

module.exports = computeDelta;
