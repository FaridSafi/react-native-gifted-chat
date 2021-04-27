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

import type {Bundle, ModuleMap, BundleMetadata} from '../types.flow';

function sliceModules(
  moduleLengths: $ReadOnlyArray<[number, number]>,
  str: string,
  startOffset: number,
): [number, ModuleMap] {
  const modules = [];
  let offset = startOffset;
  for (const [id, length] of moduleLengths) {
    modules.push([id, str.slice(offset, offset + length)]);
    if (length > 0) {
      // Modules are separated by a line break, when their code is non-null.
      offset += length + 1;
    }
  }
  return [offset, modules];
}

/**
 * Parses a bundle from an embedded delta bundle.
 */
function stringToBundle(str: string, metadata: BundleMetadata): Bundle {
  const pre = str.slice(0, metadata.pre);
  const [offset, modules] = sliceModules(
    metadata.modules,
    str,
    // There's a line break after the pre segment, when it exists.
    pre.length > 0 ? pre.length + 1 : 0,
  );
  // We technically don't need the bundle post segment length, since it should
  // normally continue until the end.
  const post = str.slice(offset, offset + metadata.post);

  return {
    pre,
    post,
    modules,
  };
}

module.exports = stringToBundle;
