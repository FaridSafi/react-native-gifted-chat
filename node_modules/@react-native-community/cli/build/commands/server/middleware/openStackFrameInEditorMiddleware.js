"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOpenStackFrameInEditorMiddleware;

var _launchEditor = _interopRequireDefault(require("../launchEditor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getOpenStackFrameInEditorMiddleware({
  watchFolders
}) {
  return (req, res, next) => {
    if (req.url === '/open-stack-frame') {
      const frame = JSON.parse(req.rawBody);
      (0, _launchEditor.default)(frame.file, frame.lineNumber, watchFolders);
      res.end('OK');
    } else {
      next();
    }
  };
}