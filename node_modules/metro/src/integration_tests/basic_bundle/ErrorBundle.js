/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */
"use strict"; // Add a random require to fill the bundle with some sourcecode.

require("./AssetRegistry");

const calcSum = value => {
  // some random function
  const error = new Error("SOURCEMAP: value: " + value);
  return error;
};

module.exports = calcSum("anything");
