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

// flowlint-next-line untyped-import:off
const util = require('source-map/lib/util');

// Extracted from source-map@0.5.6's SourceMapConsumer
function normalizeSourcePath(
  sourceInput: string,
  map: {+sourceRoot?: ?string},
): string {
  const {sourceRoot} = map;
  let source = sourceInput;

  source = String(source);
  // Some source maps produce relative source paths like "./foo.js" instead of
  // "foo.js".  Normalize these first so that future comparisons will succeed.
  // See bugzil.la/1090768.
  source = util.normalize(source);
  // Always ensure that absolute sources are internally stored relative to
  // the source root, if the source root is absolute. Not doing this would
  // be particularly problematic when the source root is a prefix of the
  // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
  source =
    sourceRoot != null && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
      ? util.relative(sourceRoot, source)
      : source;

  return source;
}

module.exports = normalizeSourcePath;
