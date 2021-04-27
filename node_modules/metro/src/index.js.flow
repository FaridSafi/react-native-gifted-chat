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

const IncrementalBundler = require('./IncrementalBundler');
const MetroHmrServer = require('./HmrServer');
const MetroServer = require('./Server');

const attachWebsocketServer = require('./lib/attachWebsocketServer');
const http = require('http');
const https = require('https');
const makeBuildCommand = require('./commands/build');
const makeDependenciesCommand = require('./commands/dependencies');
const makeServeCommand = require('./commands/serve');
const outputBundle = require('./shared/output/bundle');

const {readFile} = require('fs-extra');
const {loadConfig, mergeConfig, getDefaultConfig} = require('metro-config');
const {InspectorProxy} = require('metro-inspector-proxy');

import type {Graph} from './DeltaBundler';
import type {CustomTransformOptions} from './JSTransformer/worker';
import type {RequestOptions, OutputOptions} from './shared/types.flow.js';
import type {Server as HttpServer} from 'http';
import type {Server as HttpsServer} from 'https';
import type {
  ConfigT,
  InputConfigT,
  Middleware,
} from 'metro-config/src/configTypes.flow';
import typeof Yargs from 'yargs';

type MetroMiddleWare = {|
  attachHmrServer: (httpServer: HttpServer | HttpsServer) => void,
  end: () => void,
  metroServer: MetroServer,
  middleware: Middleware,
|};

async function getConfig(config: InputConfigT): Promise<ConfigT> {
  const defaultConfig = await getDefaultConfig(config.projectRoot);
  return mergeConfig(defaultConfig, config);
}

async function runMetro(config: InputConfigT): Promise<MetroServer> {
  const mergedConfig = await getConfig(config);

  mergedConfig.reporter.update({
    type: 'initialize_started',
    port: mergedConfig.server.port,
    // FIXME: We need to change that to watchFolders. It will be a
    // breaking since it affects custom reporter API.
    projectRoots: mergedConfig.watchFolders,
  });

  return new MetroServer(mergedConfig);
}

exports.runMetro = runMetro;
exports.loadConfig = loadConfig;

exports.createConnectMiddleware = async function(
  config: ConfigT,
): Promise<MetroMiddleWare> {
  const metroServer = await runMetro(config);

  let enhancedMiddleware = metroServer.processRequest;

  // Enhance the resulting middleware using the config options
  if (config.server.enhanceMiddleware) {
    enhancedMiddleware = config.server.enhanceMiddleware(
      enhancedMiddleware,
      metroServer,
    );
  }

  return {
    attachHmrServer(httpServer: HttpServer | HttpsServer): void {
      attachWebsocketServer({
        httpServer,
        path: '/hot',
        websocketServer: new MetroHmrServer(
          metroServer.getBundler(),
          metroServer.getCreateModuleId(),
          config,
        ),
      });
    },
    metroServer,
    middleware: enhancedMiddleware,
    end(): void {
      metroServer.end();
    },
  };
};

type RunServerOptions = {|
  host?: string,
  onReady?: (server: HttpServer | HttpsServer) => void,
  onError?: (Error & {|code?: string|}) => void,
  secure?: boolean,
  secureKey?: string,
  secureCert?: string,
  hmrEnabled?: boolean,
  runInspectorProxy?: boolean,
|};

exports.runServer = async (
  config: ConfigT,
  {
    host,
    onReady,
    onError,
    secure = false,
    secureKey,
    secureCert,
    hmrEnabled = false,
  }: RunServerOptions,
): Promise<HttpServer | HttpsServer> => {
  // Lazy require
  const connect = require('connect');

  const serverApp = connect();

  const {
    attachHmrServer,
    middleware,
    metroServer,
    end,
  } = await exports.createConnectMiddleware(config);

  serverApp.use(middleware);

  if (config.server.enableVisualizer) {
    let initializeVisualizerMiddleware;
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      ({initializeVisualizerMiddleware} = require('metro-visualizer'));
    } catch (e) {
      console.warn(
        "'config.server.enableVisualizer' is enabled but the 'metro-visualizer' package was not found - have you installed it?",
      );
    }
    if (initializeVisualizerMiddleware) {
      serverApp.use('/visualizer', initializeVisualizerMiddleware(metroServer));
    }
  }

  let inspectorProxy: ?InspectorProxy = null;
  if (config.server.runInspectorProxy) {
    inspectorProxy = new InspectorProxy();
  }

  let httpServer;

  if (secure) {
    httpServer = https.createServer(
      {
        key: await readFile(secureKey),
        cert: await readFile(secureCert),
      },
      serverApp,
    );
  } else {
    httpServer = http.createServer(serverApp);
  }

  httpServer.on('error', error => {
    onError && onError(error);
    end();
  });

  return new Promise(
    (
      resolve: (result: HttpServer | HttpsServer) => void,
      reject: mixed => mixed,
    ) => {
      httpServer.listen(config.server.port, host, () => {
        onReady && onReady(httpServer);
        if (hmrEnabled) {
          attachHmrServer(httpServer);
        }

        if (inspectorProxy) {
          inspectorProxy.addWebSocketListener(httpServer);

          // TODO(hypuk): Refactor inspectorProxy.processRequest into separate request handlers
          // so that we could provide routes (/json/list and /json/version) here.
          // Currently this causes Metro to give warning about T31407894.
          serverApp.use(inspectorProxy.processRequest.bind(inspectorProxy));
        }

        resolve(httpServer);
      });

      // Disable any kind of automatic timeout behavior for incoming
      // requests in case it takes the packager more than the default
      // timeout of 120 seconds to respond to a request.
      httpServer.timeout = 0;

      httpServer.on('error', error => {
        end();
        reject(error);
      });

      httpServer.on('close', () => {
        end();
      });
    },
  );
};

type BuildGraphOptions = {|
  entries: $ReadOnlyArray<string>,
  customTransformOptions?: CustomTransformOptions,
  dev?: boolean,
  minify?: boolean,
  onProgress?: (transformedFileCount: number, totalFileCount: number) => void,
  platform?: string,
  type?: 'module' | 'script',
|};

type RunBuildOptions = {|
  entry: string,
  dev?: boolean,
  out?: string,
  onBegin?: () => void,
  onComplete?: () => void,
  onProgress?: (transformedFileCount: number, totalFileCount: number) => void,
  minify?: boolean,
  output?: {
    build: (
      MetroServer,
      RequestOptions,
    ) => Promise<{code: string, map: string}>,
    save: (
      {code: string, map: string},
      OutputOptions,
      (...args: Array<string>) => void,
    ) => Promise<mixed>,
  },
  platform?: string,
  sourceMap?: boolean,
  sourceMapUrl?: string,
|};

exports.runBuild = async (
  config: ConfigT,
  {
    dev = false,
    entry,
    onBegin,
    onComplete,
    onProgress,
    minify = true,
    output = outputBundle,
    out,
    platform = 'web',
    sourceMap = false,
    sourceMapUrl,
  }: RunBuildOptions,
): Promise<{code: string, map: string}> => {
  const metroServer = await runMetro(config);

  try {
    const requestOptions: RequestOptions = {
      dev,
      entryFile: entry,
      inlineSourceMap: sourceMap && !sourceMapUrl,
      minify,
      platform,
      sourceMapUrl: sourceMap === false ? undefined : sourceMapUrl,
      createModuleIdFactory: config.serializer.createModuleIdFactory,
      onProgress,
    };

    if (onBegin) {
      onBegin();
    }

    const metroBundle = await output.build(metroServer, requestOptions);

    if (onComplete) {
      onComplete();
    }

    if (out) {
      const bundleOutput = out.replace(/(\.js)?$/, '.js');
      const sourcemapOutput =
        sourceMap === false ? undefined : out.replace(/(\.js)?$/, '.map');

      const outputOptions: OutputOptions = {
        bundleOutput,
        sourcemapOutput,
        dev,
        platform,
      };

      // eslint-disable-next-line no-console
      await output.save(metroBundle, outputOptions, console.log);
    }

    return metroBundle;
  } finally {
    await metroServer.end();
  }
};

exports.buildGraph = async function(
  config: InputConfigT,
  {
    customTransformOptions = Object.create(null),
    dev = false,
    entries,
    minify = false,
    onProgress,
    platform = 'web',
    type = 'module',
  }: BuildGraphOptions,
): Promise<Graph<>> {
  const mergedConfig = await getConfig(config);

  const bundler = new IncrementalBundler(mergedConfig);

  try {
    return await bundler.buildGraphForEntries(entries, {
      ...MetroServer.DEFAULT_GRAPH_OPTIONS,
      customTransformOptions,
      dev,
      minify,
      platform,
      type,
    });
  } finally {
    bundler.end();
  }
};

type BuildCommandOptions = {||} | null;
type ServeCommandOptions = {||} | null;

exports.attachMetroCli = function(
  yargs: Yargs,
  {
    build = {},
    serve = {},
    dependencies = {},
  }: {
    build: BuildCommandOptions,
    serve: ServeCommandOptions,
    dependencies: any,
  } = {},
): Yargs {
  if (build) {
    const {command, description, builder, handler} = makeBuildCommand();
    yargs.command(command, description, builder, handler);
  }
  if (serve) {
    const {command, description, builder, handler} = makeServeCommand();
    yargs.command(command, description, builder, handler);
  }
  if (dependencies) {
    const {command, description, builder, handler} = makeDependenciesCommand();
    yargs.command(command, description, builder, handler);
  }
  return yargs;
};

// The symbols below belong to the legacy API and should not be relied upon
Object.assign(exports, require('./legacy'));
