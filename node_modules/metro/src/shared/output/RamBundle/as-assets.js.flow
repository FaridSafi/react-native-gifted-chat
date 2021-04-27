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

const MAGIC_RAM_BUNDLE_NUMBER = require('./magic-number');

const buildSourcemapWithMetadata = require('./buildSourcemapWithMetadata');
const mkdirp = require('mkdirp');
const path = require('path');
const relativizeSourceMapInline = require('../../../lib/relativizeSourceMap');
const writeFile = require('../writeFile');
const writeSourceMap = require('./write-sourcemap');

const {joinModules} = require('./util');

import type {RamBundleInfo} from '../../../DeltaBundler/Serializers/getRamBundleInfo';
import type {ModuleTransportLike} from '../../../shared/types.flow';
import type {OutputOptions} from '../../types.flow';
// must not start with a dot, as that won't go into the apk
const MAGIC_RAM_BUNDLE_FILENAME = 'UNBUNDLE';
const MODULES_DIR = 'js-modules';

/**
 * Saves all JS modules of an app as single files
 * The startup code (prelude, polyfills etc.) are written to the file
 * designated by the `bundleOuput` option.
 * All other modules go into a 'js-modules' folder that in the same parent
 * directory as the startup file.
 */
function saveAsAssets(
  bundle: RamBundleInfo,
  options: OutputOptions,
  log: (...args: Array<string>) => void,
): Promise<mixed> {
  const {
    bundleOutput,
    bundleEncoding: encoding,
    sourcemapOutput,
    sourcemapSourcesRoot,
  } = options;

  log('start');
  const {startupModules, lazyModules} = bundle;
  log('finish');
  const startupCode = joinModules(startupModules);

  log('Writing bundle output to:', bundleOutput);
  const modulesDir = path.join(path.dirname(bundleOutput), MODULES_DIR);
  const writeUnbundle = createDir(modulesDir).then(
    // create the modules directory first
    () =>
      Promise.all([
        writeModules(lazyModules, modulesDir, encoding),
        writeFile(bundleOutput, startupCode, encoding),
        writeMagicFlagFile(modulesDir),
      ]),
  );
  writeUnbundle.then(() => log('Done writing unbundle output'));

  if (sourcemapOutput) {
    const sourceMap = buildSourcemapWithMetadata({
      fixWrapperOffset: true,
      lazyModules: lazyModules.concat(),
      moduleGroups: null,
      startupModules: startupModules.concat(),
    });
    if (sourcemapSourcesRoot !== undefined) {
      relativizeSourceMapInline(sourceMap, sourcemapSourcesRoot);
    }
    const wroteSourceMap = writeSourceMap(
      sourcemapOutput,
      JSON.stringify(sourceMap),
      log,
    );

    return Promise.all([writeUnbundle, wroteSourceMap]);
  } else {
    return writeUnbundle;
  }
}

function createDir(dirName: string): Promise<empty> {
  return new Promise((resolve: void => void, reject: mixed => mixed) =>
    mkdirp(dirName, error => (error ? reject(error) : resolve())),
  );
}

function writeModuleFile(
  module: ModuleTransportLike,
  modulesDir: string,
  encoding: void | 'ascii' | 'utf16le' | 'utf8',
): Promise<mixed> {
  const {code, id} = module;
  return writeFile(path.join(modulesDir, id + '.js'), code, encoding);
}

function writeModules(
  modules: $ReadOnlyArray<ModuleTransportLike>,
  modulesDir: string,
  encoding: void | 'ascii' | 'utf16le' | 'utf8',
): Promise<Array<mixed>> {
  const writeFiles = modules.map(
    (module: ModuleTransportLike): Promise<mixed> =>
      writeModuleFile(module, modulesDir, encoding),
  );
  return Promise.all(writeFiles);
}

function writeMagicFlagFile(outputDir: string): Promise<mixed> {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(MAGIC_RAM_BUNDLE_NUMBER, 0);
  return writeFile(path.join(outputDir, MAGIC_RAM_BUNDLE_FILENAME), buffer);
}

module.exports = saveAsAssets;
