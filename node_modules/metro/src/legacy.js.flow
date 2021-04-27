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

const blacklist = require('metro-config/src/defaults/blacklist');
const invariant = require('invariant');

const {Logger} = require('metro-core');
const {fromRawMappings, toSegmentTuple} = require('metro-source-map');

import type Server from './Server';
import type {ConfigT} from 'metro-config/src/configTypes.flow';

exports.createBlacklist = blacklist;
exports.sourceMaps = {fromRawMappings, compactMapping: toSegmentTuple};
exports.createServer = createServer;
exports.Logger = Logger;

type PublicBundleOptions = {|
  +dev?: boolean,
  +entryFile: string,
  +inlineSourceMap?: boolean,
  +minify?: boolean,
  +platform?: string,
  +runModule?: boolean,
  +sourceMapUrl?: string,
|};

/**
 * This is a public API, so we don't trust the value and purposefully downgrade
 * it as `mixed`. Because it understands `invariant`, Flow ensure that we
 * refine these values completely.
 */
function assertPublicBundleOptions(bo: mixed): PublicBundleOptions {
  invariant(
    typeof bo === 'object' && bo != null,
    'bundle options must be an object',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.dev === undefined || typeof bo.dev === 'boolean',
    'bundle options field `dev` must be a boolean',
  );
  const {entryFile} = bo;
  invariant(
    typeof entryFile === 'string',
    'bundle options must contain a string field `entryFile`',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.inlineSourceMap === undefined || typeof bo.inlineSourceMap === 'boolean',
    'bundle options field `inlineSourceMap` must be a boolean',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.minify === undefined || typeof bo.minify === 'boolean',
    'bundle options field `minify` must be a boolean',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.platform === undefined || typeof bo.platform === 'string',
    'bundle options field `platform` must be a string',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.runModule === undefined || typeof bo.runModule === 'boolean',
    'bundle options field `runModule` must be a boolean',
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.sourceMapUrl === undefined || typeof bo.sourceMapUrl === 'string',
    'bundle options field `sourceMapUrl` must be a boolean',
  );
  return {entryFile, ...bo};
}

exports.build = async function(
  options: ConfigT,
  bundleOptions: PublicBundleOptions,
): Promise<{code: string, map: string}> {
  // TODO: Find out if this is used at all
  // // eslint-disable-next-line lint/strictly-null
  // if (options.targetBabelVersion !== undefined) {
  //   process.env.BABEL_VERSION = String(options.targetBabelVersion);
  // }
  var server = createNonPersistentServer(options);
  const ServerClass = require('./Server');

  const result = await server.build({
    ...ServerClass.DEFAULT_BUNDLE_OPTIONS,
    ...assertPublicBundleOptions(bundleOptions),
    bundleType: 'todo',
  });

  server.end();

  return result;
};

exports.getOrderedDependencyPaths = async function(
  options: ConfigT,
  depOptions: {
    +dev: boolean,
    +entryFile: string,
    +minify: boolean,
    +platform: string,
  },
): Promise<Array<string>> {
  var server = createNonPersistentServer(options);

  try {
    return await server.getOrderedDependencyPaths(depOptions);
  } finally {
    server.end();
  }
};

function createServer(options: ConfigT): Server {
  // Some callsites may not be Flowified yet.
  invariant(
    options.transformer.assetRegistryPath != null,
    'createServer() requires assetRegistryPath',
  );

  const ServerClass = require('./Server');
  return new ServerClass(options);
}

function createNonPersistentServer(config: ConfigT): Server {
  return createServer(config);
}
