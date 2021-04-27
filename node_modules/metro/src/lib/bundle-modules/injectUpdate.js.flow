/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';

import type {HmrUpdate} from './types.flow';

const inject = ({module: [id, code], sourceURL}) => {
  // Some engines do not support `sourceURL` as a comment. We expose a
  // `globalEvalWithSourceUrl` function to handle updates in that case.
  if (global.globalEvalWithSourceUrl) {
    global.globalEvalWithSourceUrl(code, sourceURL);
  } else {
    // eslint-disable-next-line no-eval
    eval(code);
  }
};

function injectUpdate(update: HmrUpdate): void {
  update.added.forEach(inject);
  update.modified.forEach(inject);
}

module.exports = injectUpdate;
