/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";
/**
 * By knowing all the valid platforms, we're able to say that "foo.ios.png" is
 * effectively the asset "foo" specific to "ios", and not a generic asset
 * "foo.ios". This is important so that we can discard asset variants that don't
 * match the platform being built.
 */

const VALID_PLATFORMS = new Set(["ios", "android", "web"]);
module.exports = {
  VALID_PLATFORMS
};
