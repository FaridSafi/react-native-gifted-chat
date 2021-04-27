/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const Server = require('../../Server');

const relativizeSourceMapInline = require('../../lib/relativizeSourceMap');
const writeFile = require('./writeFile');

import type {OutputOptions, RequestOptions} from '../types.flow';
import type {MixedSourceMap} from 'metro-source-map';

function buildBundle(
  packagerClient: Server,
  requestOptions: RequestOptions,
): Promise<{code: string, map: string}> {
  return packagerClient.build({
    ...Server.DEFAULT_BUNDLE_OPTIONS,
    ...requestOptions,
    bundleType: 'bundle',
  });
}

function relativateSerializedMap(
  map: string,
  sourceMapSourcesRoot: string,
): string {
  const sourceMap = (JSON.parse(map): MixedSourceMap);
  relativizeSourceMapInline(sourceMap, sourceMapSourcesRoot);
  return JSON.stringify(sourceMap);
}

async function saveBundleAndMap(
  bundle: {code: string, map: string},
  options: OutputOptions,
  log: (...args: Array<string>) => void,
): Promise<mixed> {
  const {
    bundleOutput,
    bundleEncoding: encoding,
    sourcemapOutput,
    sourcemapSourcesRoot,
  } = options;

  const writeFns = [];

  writeFns.push(async () => {
    log('Writing bundle output to:', bundleOutput);
    await writeFile(bundleOutput, bundle.code, encoding);
    log('Done writing bundle output');
  });

  if (sourcemapOutput) {
    let {map} = bundle;
    if (sourcemapSourcesRoot !== undefined) {
      log('start relativating source map');
      map = relativateSerializedMap(map, sourcemapSourcesRoot);
      log('finished relativating');
    }

    writeFns.push(async () => {
      log('Writing sourcemap output to:', sourcemapOutput);
      await writeFile(sourcemapOutput, map, null);
      log('Done writing sourcemap output');
    });
  }

  // Wait until everything is written to disk.
  await Promise.all(writeFns.map((cb: void => mixed) => cb()));
}

exports.build = buildBundle;
exports.save = saveBundleAndMap;
exports.formatName = 'bundle';
