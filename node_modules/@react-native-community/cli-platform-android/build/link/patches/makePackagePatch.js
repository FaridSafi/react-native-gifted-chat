"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makePackagePatch;

var _applyParams = _interopRequireDefault(require("./applyParams"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function makePackagePatch(packageInstance, params, prefix) {
  const processedInstance = (0, _applyParams.default)(packageInstance, params, prefix);
  return {
    pattern: 'new MainReactPackage()',
    patch: `,\n            ${processedInstance}`
  };
}