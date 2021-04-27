/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */
"use strict";

const babelGenerate = require("@babel/generator").default;

function generate(ast, filename, sourceCode, compact) {
  const generated = babelGenerate(
    ast,
    {
      comments: false,
      compact,
      filename,
      sourceFileName: filename,
      sourceMaps: true,
      sourceMapTarget: filename
    },
    sourceCode
  );

  if (generated.map) {
    /* $FlowFixMe(>=0.109.0 site=react_native_fb) This \
    comment suppresses an error found when Flow v0.47 was deployed. To see \
    the error delete this comment and run Flow. */
    delete generated.map.sourcesContent;
  }

  return generated;
}

module.exports = generate;
