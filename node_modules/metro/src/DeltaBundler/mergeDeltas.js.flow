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

import type {DeltaBundle} from '../lib/bundle-modules/types.flow';

function mergeDeltas(delta1: DeltaBundle, delta2: DeltaBundle): DeltaBundle {
  const added1 = new Map(delta1.added);
  const modified1 = new Map(delta1.modified);
  const deleted1 = new Set(delta1.deleted);
  const added2 = new Map(delta2.added);
  const modified2 = new Map(delta2.modified);
  const deleted2 = new Set(delta2.deleted);
  const added = new Map();
  const modified = new Map();
  const deleted = new Set();

  for (const [id, code] of added1) {
    if (!deleted2.has(id) && !modified2.has(id)) {
      added.set(id, code);
    }
  }

  for (const [id, code] of modified1) {
    if (!deleted2.has(id) && !modified2.has(id)) {
      modified.set(id, code);
    }
  }

  for (const id of deleted1) {
    if (!added2.has(id)) {
      deleted.add(id);
    }
  }

  for (const [id, code] of added2) {
    if (deleted1.has(id)) {
      modified.set(id, code);
    } else {
      added.set(id, code);
    }
  }

  for (const [id, code] of modified2) {
    if (added1.has(id)) {
      added.set(id, code);
    } else {
      modified.set(id, code);
    }
  }

  for (const id of deleted2) {
    if (!added1.has(id)) {
      deleted.add(id);
    }
  }

  return {
    added: [...added.entries()],
    modified: [...modified.entries()],
    deleted: [...deleted],
  };
}

module.exports = mergeDeltas;
