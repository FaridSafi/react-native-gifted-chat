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

const Resolver = {
  FailedToResolveNameError: require("./FailedToResolveNameError"),
  FailedToResolvePathError: require("./FailedToResolvePathError"),
  formatFileCandidates: require("./formatFileCandidates"),
  InvalidPackageError: require("./InvalidPackageError"),
  resolve: require("./resolve")
};
module.exports = Resolver;
