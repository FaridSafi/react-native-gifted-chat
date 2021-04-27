/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";

function formatFileCandidates(candidates) {
  if (candidates.type === "asset") {
    return candidates.name;
  }

  return `${candidates.filePathPrefix}(${candidates.candidateExts
    .filter(Boolean)
    .join("|")})`;
}

module.exports = formatFileCandidates;
