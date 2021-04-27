/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
"use strict";

const generate = require("@babel/generator").default;

const generateOptions = {
  concise: true,
  sourceType: "module"
};

exports.codeFromAst = ast => generate(ast, generateOptions).code;

exports.comparableCode = code => code.trim().replace(/\s+/g, " ");
