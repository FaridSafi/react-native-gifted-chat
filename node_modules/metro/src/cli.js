#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict"; //flowlint untyped-import:off

const yargs = require("yargs"); //flowlint untyped-import:error

const _require = require("./index"),
  attachMetroCli = _require.attachMetroCli;

attachMetroCli(yargs.demandCommand(1)).argv;
