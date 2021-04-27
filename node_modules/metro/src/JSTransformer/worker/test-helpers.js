/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+js_foundation
 * @format
 */
"use strict";

const generate = require("@babel/generator").default;

const _require = require("@babel/core"),
  transformSync = _require.transformSync;

function transform(code, plugins, options) {
  const optionsPlugins = plugins.length
    ? plugins.map(plugin => [plugin, options])
    : [
        () => ({
          visitor: {}
        })
      ];
  const babelOptions = {
    ast: true,
    babelrc: false,
    code: false,
    compact: true,
    configFile: false,
    plugins: optionsPlugins,
    sourceType: "module"
  };
  return generate(transformSync(code, babelOptions).ast).code;
}

function compare(plugins, code, expected) {
  let options =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const result = transform(code, plugins, options);
  const reference = transform(expected, [], {});
  expect(result).toBe(reference);
}

exports.transform = transform;
exports.compare = compare;
