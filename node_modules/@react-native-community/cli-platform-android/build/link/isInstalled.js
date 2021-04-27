"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInstalled;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

var _makeBuildPatch = _interopRequireDefault(require("./patches/makeBuildPatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function isInstalled(config, name) {
  const buildGradle = _fs().default.readFileSync(config.buildGradlePath, 'utf8');

  return (0, _makeBuildPatch.default)(name).installPattern.test(buildGradle);
}