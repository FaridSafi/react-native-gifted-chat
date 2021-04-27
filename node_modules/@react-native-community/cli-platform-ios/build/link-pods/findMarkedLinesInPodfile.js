"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findMarkedLinesInPodfile;
exports.MARKER_TEXT = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const MARKER_TEXT = '# Add new pods below this line';
exports.MARKER_TEXT = MARKER_TEXT;

function findMarkedLinesInPodfile(podLines) {
  const result = [];

  for (let i = 0, len = podLines.length; i < len; i++) {
    if (podLines[i].includes(MARKER_TEXT)) {
      result.push({
        line: i + 1,
        indentation: podLines[i].indexOf('#')
      });
    }
  }

  return result;
}