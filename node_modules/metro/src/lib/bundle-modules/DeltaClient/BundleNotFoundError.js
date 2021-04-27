/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

class BundleNotFoundError extends Error {
  constructor(bundleKey) {
    super(
      `The Delta Client could not find a bundle corresponding to \`${bundleKey}\` in its bundle cache. ` +
        "Use `deltaClient.registerBundle` to register a new bundle."
    );
  }
}

module.exports = BundleNotFoundError;
