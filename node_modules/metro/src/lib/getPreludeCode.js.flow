/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

function getPreludeCode({
  extraVars,
  isDev,
}: {|
  +extraVars?: {[string]: mixed},
  +isDev: boolean,
|}): string {
  const vars = [
    '__BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now()',
    `__DEV__=${String(isDev)}`,
    ...formatExtraVars(extraVars),
    'process=this.process||{}',
  ];
  return `var ${vars.join(',')};${processEnv(
    isDev ? 'development' : 'production',
  )}`;
}

const excluded = new Set(['__BUNDLE_START_TIME__', '__DEV__', 'process']);

function formatExtraVars(extraVars: ?{[string]: mixed}): Array<string> {
  const assignments = [];

  for (const key in extraVars) {
    if (extraVars.hasOwnProperty(key) && !excluded.has(key)) {
      /* $FlowFixMe(>=0.95.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.95 was deployed. To see the error, delete
       * this comment and run Flow. */
      assignments.push(`${key}=${JSON.stringify(extraVars[key])}`);
    }
  }

  return assignments;
}

function processEnv(nodeEnv: string): string {
  return `process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||${JSON.stringify(
    nodeEnv,
  )};`;
}

module.exports = getPreludeCode;
