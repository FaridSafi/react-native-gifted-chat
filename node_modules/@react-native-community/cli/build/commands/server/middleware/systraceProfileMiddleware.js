"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = systraceProfileMiddleware;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function systraceProfileMiddleware(req, res, next) {
  if (req.url !== '/systrace') {
    next();
    return;
  }

  _cliTools().logger.info('Dumping profile information...');

  const dumpName = `/tmp/dump_${Date.now()}.json`;

  _fs().default.writeFileSync(dumpName, req.rawBody);

  const response = `Your profile was saved at:\n${dumpName}\n\n` + 'On Google Chrome navigate to chrome://tracing and then click on "load" ' + 'to load and visualise your profile.\n\n' + 'This message is also printed to your console by the packager so you can copy it :)';

  _cliTools().logger.info(response);

  res.end(response);
}