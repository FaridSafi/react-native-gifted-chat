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

const convertConfig = require("./convertConfig");

const getDefaultConfig = require("./defaults");

const _require = require("./loadConfig"),
  loadConfig = _require.loadConfig,
  resolveConfig = _require.resolveConfig,
  mergeConfig = _require.mergeConfig;

module.exports = {
  loadConfig,
  resolveConfig,
  mergeConfig,
  getDefaultConfig,
  convert: convertConfig
};
