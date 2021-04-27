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
const MultipartResponse = require('./Server/MultipartResponse');

const baseJSBundle = require('./DeltaBundler/Serializers/baseJSBundle');
const bundleToString = require('./lib/bundle-modules/DeltaClient/bundleToString');
const deltaJSBundle = require('./DeltaBundler/Serializers/deltaJSBundle');
const getAllFiles = require('./DeltaBundler/Serializers/getAllFiles');
const getAssets = require('./DeltaBundler/Serializers/getAssets');
const getGraphId = require('./lib/getGraphId');
const getRamBundleInfo = require('./DeltaBundler/Serializers/getRamBundleInfo');
const sourceMapString = require('./DeltaBundler/Serializers/sourceMapString');
const splitBundleOptions = require('./lib/splitBundleOptions');
const debug = require('debug')('Metro:Server');
const formatBundlingError = require('./lib/formatBundlingError');
const mime = require('mime-types');
const parseOptionsFromUrl = require('./lib/parseOptionsFromUrl');
const transformHelpers = require('./lib/transformHelpers');
const parsePlatformFilePath = require('./node-haste/lib/parsePlatformFilePath');
const path = require('path');
const serializeDeltaJSBundle = require('./DeltaBundler/Serializers/helpers/serializeDeltaJSBundle');
const symbolicate = require('./Server/symbolicate');
const url = require('url');
const ResourceNotFoundError = require('./IncrementalBundler/ResourceNotFoundError');
const RevisionNotFoundError = require('./IncrementalBundler/RevisionNotFoundError');

const {getAsset} = require('./Assets');
const {
  getExplodedSourceMap,
} = require('./DeltaBundler/Serializers/getExplodedSourceMap');

import type {ExplodedSourceMap} from './DeltaBundler/Serializers/getExplodedSourceMap';
import type {IncomingMessage, ServerResponse} from 'http';
import type {Reporter} from './lib/reporting';
import type {GraphId} from './lib/getGraphId';
import type {RamBundleInfo} from './DeltaBundler/Serializers/getRamBundleInfo';
import type {
  BundleOptions,
  GraphOptions,
  SplitBundleOptions,
} from './shared/types.flow';
import type {
  ConfigT,
  VisualizerConfigT,
} from 'metro-config/src/configTypes.flow';
import type {AssetData} from './Assets';
import type {RevisionId} from './IncrementalBundler';
import type {Graph, Module} from './DeltaBundler/types.flow';
import type {CacheStore} from 'metro-cache';
import type {BundleVariant} from './lib/bundle-modules/types.flow';
import type DependencyGraph from './node-haste/DependencyGraph';
import type {MixedOutput, TransformResult} from './DeltaBundler/types.flow';
import type {StackFrameOutput} from './Server/symbolicate';

const {
  Logger,
  Logger: {createActionStartEntry, createActionEndEntry, log},
} = require('metro-core');

import type {
  ActionLogEntryData,
  ActionStartLogEntry,
  LogEntry,
} from 'metro-core/src/Logger';

export type SegmentLoadData = {[number]: [Array<number>, ?number]};
export type BundleMetadata = {
  hash: string,
  otaBuildNumber: ?string,
  mobileConfigs: Array<string>,
  segmentHashes: Array<string>,
  segmentLoadData: SegmentLoadData,
};

type ProcessStartContext = {|
  +buildID: string,
  +bundleOptions: BundleOptions,
  +graphId: GraphId,
  +graphOptions: GraphOptions,
  +mres: MultipartResponse,
  +req: IncomingMessage,
  +revisionId: ?RevisionId,
  ...SplitBundleOptions,
|};

type ProcessEndContext<T> = {|
  ...ProcessStartContext,
  +result: T,
|};

function debounceAndBatch(fn: () => void, delay: number): () => void {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

const DELTA_ID_HEADER = 'X-Metro-Delta-ID';
const FILES_CHANGED_COUNT_HEADER = 'X-Metro-Files-Changed-Count';

class Server {
  _config: ConfigT;
  _changeWatchers: Array<{
    req: IncomingMessage,
    res: ServerResponse,
  }>;
  _createModuleId: (path: string) => number;
  _reporter: Reporter;
  _logger: typeof Logger;
  _platforms: Set<string>;
  _nextBundleBuildID: number;
  _bundler: IncrementalBundler;
  _isEnded: boolean;

  constructor(config: ConfigT) {
    this._config = config;

    if (this._config.resetCache) {
      this._config.cacheStores.forEach((store: CacheStore<TransformResult<>>) =>
        store.clear(),
      );
      this._config.reporter.update({type: 'transform_cache_reset'});
    }

    this._reporter = config.reporter;
    this._logger = Logger;
    this._changeWatchers = [];
    this._platforms = new Set(this._config.resolver.platforms);
    this._isEnded = false;

    // TODO(T34760917): These two properties should eventually be instantiated
    // elsewhere and passed as parameters, since they are also needed by
    // the HmrServer.
    // The whole bundling/serializing logic should follow as well.
    this._createModuleId = config.serializer.createModuleIdFactory();
    this._bundler = new IncrementalBundler(config);

    const debouncedFileChangeHandler = debounceAndBatch(
      () => this._informChangeWatchers(),
      50,
    );

    // changes to the haste map can affect resolution of files in the bundle
    this._bundler
      .getBundler()
      .getDependencyGraph()
      .then((dependencyGraph: DependencyGraph) => {
        dependencyGraph.getWatcher().on('change', () => {
          // Make sure the file watcher event runs through the system before
          // we rebuild the bundles.
          debouncedFileChangeHandler();
        });
      });

    this._nextBundleBuildID = 1;
  }

  end() {
    if (!this._isEnded) {
      this._bundler.end();
      this._isEnded = true;
    }
  }

  getBundler(): IncrementalBundler {
    return this._bundler;
  }

  getCreateModuleId(): (path: string) => number {
    return this._createModuleId;
  }

  async build(options: BundleOptions): Promise<{code: string, map: string}> {
    const {
      entryFile,
      graphOptions,
      onProgress,
      serializerOptions,
      transformOptions,
    } = splitBundleOptions(options);

    const {prepend, graph} = await this._bundler.buildGraph(
      entryFile,
      transformOptions,
      {
        onProgress,
        shallow: graphOptions.shallow,
      },
    );

    const entryPoint = path.resolve(this._config.projectRoot, entryFile);

    const bundle = baseJSBundle(entryPoint, prepend, graph, {
      asyncRequireModulePath: this._config.transformer.asyncRequireModulePath,
      processModuleFilter: this._config.serializer.processModuleFilter,
      createModuleId: this._createModuleId,
      getRunModuleStatement: this._config.serializer.getRunModuleStatement,
      dev: transformOptions.dev,
      projectRoot: this._config.projectRoot,
      modulesOnly: serializerOptions.modulesOnly,
      runBeforeMainModule: this._config.serializer.getModulesRunBeforeMainModule(
        path.relative(this._config.projectRoot, entryPoint),
      ),
      runModule: serializerOptions.runModule,
      sourceMapUrl: serializerOptions.sourceMapUrl,
      sourceUrl: serializerOptions.sourceUrl,
      inlineSourceMap: serializerOptions.inlineSourceMap,
    });

    return {
      code: bundleToString(bundle).code,
      map: sourceMapString([...prepend, ...this._getSortedModules(graph)], {
        excludeSource: serializerOptions.excludeSource,
        processModuleFilter: this._config.serializer.processModuleFilter,
      }),
    };
  }

  async getRamBundleInfo(options: BundleOptions): Promise<RamBundleInfo> {
    const {
      entryFile,
      graphOptions,
      onProgress,
      serializerOptions,
      transformOptions,
    } = splitBundleOptions(options);

    const {prepend, graph} = await this._bundler.buildGraph(
      entryFile,
      transformOptions,
      {onProgress, shallow: graphOptions.shallow},
    );

    const entryPoint = path.resolve(this._config.projectRoot, entryFile);

    return await getRamBundleInfo(entryPoint, prepend, graph, {
      asyncRequireModulePath: this._config.transformer.asyncRequireModulePath,
      processModuleFilter: this._config.serializer.processModuleFilter,
      createModuleId: this._createModuleId,
      dev: transformOptions.dev,
      excludeSource: serializerOptions.excludeSource,
      getRunModuleStatement: this._config.serializer.getRunModuleStatement,
      getTransformOptions: this._config.transformer.getTransformOptions,
      platform: transformOptions.platform,
      projectRoot: this._config.projectRoot,
      modulesOnly: serializerOptions.modulesOnly,
      runBeforeMainModule: this._config.serializer.getModulesRunBeforeMainModule(
        path.relative(this._config.projectRoot, entryPoint),
      ),
      runModule: serializerOptions.runModule,
      sourceMapUrl: serializerOptions.sourceMapUrl,
      sourceUrl: serializerOptions.sourceUrl,
      inlineSourceMap: serializerOptions.inlineSourceMap,
    });
  }

  async getAssets(options: BundleOptions): Promise<$ReadOnlyArray<AssetData>> {
    const {entryFile, transformOptions, onProgress} = splitBundleOptions(
      options,
    );

    const {graph} = await this._bundler.buildGraph(
      entryFile,
      transformOptions,
      {onProgress, shallow: false},
    );

    return await getAssets(graph, {
      processModuleFilter: this._config.serializer.processModuleFilter,
      assetPlugins: this._config.transformer.assetPlugins,
      platform: transformOptions.platform,
      projectRoot: this._config.projectRoot,
      publicPath: this._config.transformer.publicPath,
    });
  }

  async getOrderedDependencyPaths(options: {
    +dev: boolean,
    +entryFile: string,
    +minify: boolean,
    +platform: string,
  }): Promise<Array<string>> {
    const {entryFile, transformOptions, onProgress} = splitBundleOptions({
      ...Server.DEFAULT_BUNDLE_OPTIONS,
      ...options,
      bundleType: 'bundle',
    });

    const {prepend, graph} = await this._bundler.buildGraph(
      entryFile,
      transformOptions,
      {onProgress, shallow: false},
    );

    const platform =
      transformOptions.platform ||
      parsePlatformFilePath(entryFile, this._platforms).platform;

    return await getAllFiles(prepend, graph, {
      platform,
      processModuleFilter: this._config.serializer.processModuleFilter,
    });
  }

  _informChangeWatchers() {
    const watchers = this._changeWatchers;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };

    watchers.forEach(function(w: {req: IncomingMessage, res: ServerResponse}) {
      w.res.writeHead(205, headers);
      w.res.end(JSON.stringify({changed: true}));
    });

    this._changeWatchers = [];
  }

  _processOnChangeRequest(req: IncomingMessage, res: ServerResponse) {
    const watchers = this._changeWatchers;

    watchers.push({
      req,
      res,
    });

    req.on('close', () => {
      for (let i = 0; i < watchers.length; i++) {
        if (watchers[i] && watchers[i].req === req) {
          watchers.splice(i, 1);
          break;
        }
      }
    });
  }

  _rangeRequestMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    data: string | Buffer,
    assetPath: string,
  ) {
    if (req.headers && req.headers.range) {
      const [rangeStart, rangeEnd] = req.headers.range
        .replace(/bytes=/, '')
        .split('-');
      const dataStart = parseInt(rangeStart, 10);
      const dataEnd = rangeEnd ? parseInt(rangeEnd, 10) : data.length - 1;
      const chunksize = dataEnd - dataStart + 1;

      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Range': `bytes ${dataStart}-${dataEnd}/${data.length}`,
        'Content-Type': mime.lookup(path.basename(assetPath)),
      });

      return data.slice(dataStart, dataEnd + 1);
    }

    return data;
  }

  async _processSingleAssetRequest(req: IncomingMessage, res: ServerResponse) {
    const urlObj = url.parse(decodeURI(req.url), true);
    const assetPath =
      urlObj && urlObj.pathname && urlObj.pathname.match(/^\/assets\/(.+)$/);

    if (!assetPath) {
      throw new Error('Could not extract asset path from URL');
    }

    const processingAssetRequestLogEntry = log(
      createActionStartEntry({
        action_name: 'Processing asset request',
        asset: assetPath[1],
      }),
    );

    try {
      const data = await getAsset(
        assetPath[1],
        this._config.projectRoot,
        this._config.watchFolders,
        /* $FlowFixMe: query may be empty for invalid URLs */
        urlObj.query.platform,
        this._config.resolver.assetExts,
      );
      // Tell clients to cache this for 1 year.
      // This is safe as the asset url contains a hash of the asset.
      if (process.env.REACT_NATIVE_ENABLE_ASSET_CACHING === true) {
        res.setHeader('Cache-Control', 'max-age=31536000');
      }
      res.end(this._rangeRequestMiddleware(req, res, data, assetPath[1]));
      process.nextTick(() => {
        log(createActionEndEntry(processingAssetRequestLogEntry));
      });
    } catch (error) {
      console.error(error.stack);
      res.writeHead(404);
      res.end('Asset not found');
    }
  }

  processRequest = (
    req: IncomingMessage,
    res: ServerResponse,
    next: (?Error) => mixed,
  ) => {
    this._processRequest(req, res, next).catch(next);
  };

  async _processRequest(
    req: IncomingMessage,
    res: ServerResponse,
    next: (?Error) => mixed,
  ) {
    const urlObj = url.parse(req.url, true);
    const {host} = req.headers;
    debug(`Handling request: ${host ? 'http://' + host : ''}${req.url}`);
    /* $FlowFixMe: Could be empty if the URL is invalid. */
    const pathname: string = urlObj.pathname;

    if (pathname.match(/\.bundle$/)) {
      await this._processBundleRequest(req, res);
    } else if (pathname.match(/\.map$/)) {
      await this._processSourceMapRequest(req, res);
    } else if (pathname.match(/\.assets$/)) {
      await this._processAssetsRequest(req, res);
    } else if (pathname.match(/\.delta$/)) {
      await this._processDeltaRequest(req, res);
    } else if (pathname.match(/\.meta/)) {
      await this._processMetadataRequest(req, res);
    } else if (pathname.match(/^\/onchange\/?$/)) {
      this._processOnChangeRequest(req, res);
    } else if (pathname.match(/^\/assets\//)) {
      await this._processSingleAssetRequest(req, res);
    } else if (pathname === '/symbolicate') {
      this._symbolicate(req, res);
    } else {
      next();
    }
  }

  _createRequestProcessor<T>({
    createStartEntry,
    createEndEntry,
    build,
    finish,
  }: {|
    +createStartEntry: (context: ProcessStartContext) => ActionLogEntryData,
    +createEndEntry: (
      context: ProcessEndContext<T>,
    ) => $Rest<ActionStartLogEntry, LogEntry>,
    +build: (context: ProcessStartContext) => Promise<T>,
    +finish: (context: ProcessEndContext<T>) => void,
  |}) {
    return async function requestProcessor(
      req: IncomingMessage,
      res: ServerResponse,
    ): Promise<void> {
      const mres = MultipartResponse.wrap(req, res);
      const {revisionId, options: bundleOptions} = parseOptionsFromUrl(
        url.format({
          ...url.parse(req.url),
          protocol: 'http',
          host: req.headers.host,
        }),
        new Set(this._config.resolver.platforms),
      );
      const {
        entryFile,
        graphOptions,
        transformOptions,
        serializerOptions,
      } = splitBundleOptions(bundleOptions);

      /**
       * `entryFile` is relative to projectRoot, we need to use resolution function
       * to find the appropriate file with supported extensions.
       */
      const resolutionFn = await transformHelpers.getResolveDependencyFn(
        this._bundler.getBundler(),
        transformOptions.platform,
      );
      const resolvedEntryFilePath = resolutionFn(
        `${this._config.projectRoot}/.`,
        entryFile,
      );
      const graphId = getGraphId(resolvedEntryFilePath, transformOptions, {
        shallow: graphOptions.shallow,
        experimentalImportBundleSupport: this._config.transformer
          .experimentalImportBundleSupport,
      });
      const buildID = this.getNewBuildID();

      let onProgress = null;
      if (this._config.reporter) {
        onProgress = (transformedFileCount: number, totalFileCount: number) => {
          mres.writeChunk(
            {'Content-Type': 'application/json'},
            JSON.stringify({done: transformedFileCount, total: totalFileCount}),
          );

          this._reporter.update({
            buildID,
            type: 'bundle_transform_progressed',
            transformedFileCount,
            totalFileCount,
          });
        };
      }

      this._reporter.update({
        buildID,
        bundleDetails: {
          entryFile: resolvedEntryFilePath,
          platform: transformOptions.platform,
          dev: transformOptions.dev,
          minify: transformOptions.minify,
          bundleType: bundleOptions.bundleType,
        },
        type: 'bundle_build_started',
      });

      const startContext = {
        buildID,
        bundleOptions,
        entryFile: resolvedEntryFilePath,
        graphId,
        graphOptions,
        mres,
        onProgress,
        req,
        revisionId,
        serializerOptions,
        transformOptions,
      };
      const logEntry = log(
        createActionStartEntry(createStartEntry(startContext)),
      );

      let result;
      try {
        result = await build(startContext);
      } catch (error) {
        const formattedError = formatBundlingError(error);

        const status = error instanceof ResourceNotFoundError ? 404 : 500;
        mres.writeHead(status, {
          'Content-Type': 'application/json; charset=UTF-8',
        });
        mres.end(JSON.stringify(formattedError));
        this._reporter.update({error, type: 'bundling_error'});

        log({
          action_name: 'bundling_error',
          error_type: formattedError.type,
          log_entry_label: 'bundling_error',
          bundle_id: graphId,
          build_id: buildID,
          stack: formattedError.message,
        });

        this._reporter.update({
          buildID,
          type: 'bundle_build_failed',
          bundleOptions,
        });

        return;
      }

      const endContext = {
        ...startContext,
        result,
      };
      finish(endContext);

      this._reporter.update({
        buildID,
        type: 'bundle_build_done',
      });

      log(
        createActionEndEntry({
          ...logEntry,
          ...createEndEntry(endContext),
        }),
      );
    };
  }

  _processDeltaRequest = this._createRequestProcessor({
    createStartEntry(context: ProcessStartContext) {
      return {
        action_name: 'Requesting delta',
        bundle_url: context.req.url,
        entry_point: context.entryFile,
        bundler: 'delta',
        build_id: context.buildID,
        bundle_options: context.bundleOptions,
        bundle_hash: context.graphId,
      };
    },
    createEndEntry(
      context: ProcessEndContext<{|
        bundle: BundleVariant,
        nextRevId: RevisionId,
        numModifiedFiles: number,
      |}>,
    ) {
      return {
        outdated_modules: context.result.numModifiedFiles,
      };
    },
    build: async ({
      entryFile,
      graphId,
      graphOptions,
      onProgress,
      revisionId,
      serializerOptions,
      transformOptions,
    }) => {
      // TODO(T34760593): We should eventually move to a model where this
      // endpoint is placed at /delta/:revisionId, and requesting an unknown revisionId
      // throws a 404.
      // However, this would break existing delta clients, since they expect the
      // endpoint to rebuild the graph, were it not found in cache.
      let revPromise;
      if (revisionId != null) {
        revPromise = this._bundler.getRevision(revisionId);
      }
      // Even if we receive a revisionId, it might have expired.
      if (revPromise == null) {
        revPromise = this._bundler.getRevisionByGraphId(graphId);
      }

      let delta;
      let revision;
      if (revPromise != null) {
        const prevRevision = await revPromise;

        ({delta, revision} = await this._bundler.updateGraph(
          prevRevision,
          prevRevision.id !== revisionId,
        ));
      } else {
        ({delta, revision} = await this._bundler.initializeGraph(
          entryFile,
          transformOptions,
          {onProgress, shallow: graphOptions.shallow},
        ));
      }

      const bundle = deltaJSBundle(
        entryFile,
        revision.prepend,
        delta,
        revision.id,
        revision.graph,
        {
          asyncRequireModulePath: this._config.transformer
            .asyncRequireModulePath,
          processModuleFilter: this._config.serializer.processModuleFilter,
          createModuleId: this._createModuleId,
          dev: transformOptions.dev,
          getRunModuleStatement: this._config.serializer.getRunModuleStatement,
          projectRoot: this._config.projectRoot,
          modulesOnly: serializerOptions.modulesOnly,
          runBeforeMainModule: this._config.serializer.getModulesRunBeforeMainModule(
            path.relative(this._config.projectRoot, entryFile),
          ),
          runModule: serializerOptions.runModule,
          sourceMapUrl: serializerOptions.sourceMapUrl,
          sourceUrl: serializerOptions.sourceUrl,
          inlineSourceMap: serializerOptions.inlineSourceMap,
        },
      );

      return {
        numModifiedFiles:
          delta.added.size + delta.modified.size + delta.deleted.size,
        nextRevId: revision.id,
        bundle,
      };
    },
    finish({mres, result}) {
      const bundle = serializeDeltaJSBundle.toJSON(result.bundle);
      mres.setHeader(
        FILES_CHANGED_COUNT_HEADER,
        String(result.numModifiedFiles),
      );
      mres.setHeader(DELTA_ID_HEADER, String(result.nextRevId));
      mres.setHeader('Content-Type', 'application/json');
      mres.setHeader('Content-Length', String(Buffer.byteLength(bundle)));
      mres.end(bundle);
    },
  });

  _processBundleRequest = this._createRequestProcessor({
    createStartEntry(context: ProcessStartContext) {
      return {
        action_name: 'Requesting bundle',
        bundle_url: context.req.url,
        entry_point: context.entryFile,
        bundler: 'delta',
        build_id: context.buildID,
        bundle_options: context.bundleOptions,
        bundle_hash: context.graphId,
      };
    },
    createEndEntry(
      context: ProcessEndContext<{|
        bundle: string,
        lastModifiedDate: Date,
        nextRevId: RevisionId,
        numModifiedFiles: number,
      |}>,
    ) {
      return {
        outdated_modules: context.result.numModifiedFiles,
      };
    },
    build: async ({
      entryFile,
      graphId,
      graphOptions,
      onProgress,
      serializerOptions,
      transformOptions,
    }) => {
      const revPromise = this._bundler.getRevisionByGraphId(graphId);

      const {delta, revision} = await (revPromise != null
        ? this._bundler.updateGraph(await revPromise, false)
        : this._bundler.initializeGraph(entryFile, transformOptions, {
            onProgress,
            shallow: graphOptions.shallow,
          }));

      const serializer =
        this._config.serializer.customSerializer ||
        ((...args) => bundleToString(baseJSBundle(...args)).code);

      const bundle = serializer(entryFile, revision.prepend, revision.graph, {
        asyncRequireModulePath: this._config.transformer.asyncRequireModulePath,
        processModuleFilter: this._config.serializer.processModuleFilter,
        createModuleId: this._createModuleId,
        getRunModuleStatement: this._config.serializer.getRunModuleStatement,
        dev: transformOptions.dev,
        projectRoot: this._config.projectRoot,
        modulesOnly: serializerOptions.modulesOnly,
        runBeforeMainModule: this._config.serializer.getModulesRunBeforeMainModule(
          path.relative(this._config.projectRoot, entryFile),
        ),
        runModule: serializerOptions.runModule,
        sourceMapUrl: serializerOptions.sourceMapUrl,
        sourceUrl: serializerOptions.sourceUrl,
        inlineSourceMap: serializerOptions.inlineSourceMap,
      });

      return {
        numModifiedFiles: delta.reset
          ? delta.added.size + revision.prepend.length
          : delta.added.size + delta.modified.size + delta.deleted.size,
        lastModifiedDate: revision.date,
        nextRevId: revision.id,
        bundle,
      };
    },
    finish({req, mres, result}) {
      if (
        // We avoid parsing the dates since the client should never send a more
        // recent date than the one returned by the Delta Bundler (if that's the
        // case it's fine to return the whole bundle).
        req.headers['if-modified-since'] ===
        result.lastModifiedDate.toUTCString()
      ) {
        debug('Responding with 304');
        mres.writeHead(304);
        mres.end();
      } else {
        mres.setHeader(
          FILES_CHANGED_COUNT_HEADER,
          String(result.numModifiedFiles),
        );
        mres.setHeader(DELTA_ID_HEADER, String(result.nextRevId));
        mres.setHeader('Content-Type', 'application/javascript');
        mres.setHeader('Last-Modified', result.lastModifiedDate.toUTCString());
        mres.setHeader(
          'Content-Length',
          String(Buffer.byteLength(result.bundle)),
        );
        mres.end(result.bundle);
      }
    },
  });

  // This function ensures that modules in source maps are sorted in the same
  // order as in a plain JS bundle.
  _getSortedModules(graph: Graph<>): $ReadOnlyArray<Module<>> {
    return [...graph.dependencies.values()].sort(
      (a: Module<MixedOutput>, b: Module<MixedOutput>) =>
        this._createModuleId(a.path) - this._createModuleId(b.path),
    );
  }

  _processSourceMapRequest = this._createRequestProcessor({
    createStartEntry(context: ProcessStartContext) {
      return {
        action_name: 'Requesting sourcemap',
        bundle_url: context.req.url,
        entry_point: context.entryFile,
        bundler: 'delta',
      };
    },
    createEndEntry(context: ProcessEndContext<string>) {
      return {
        bundler: 'delta',
      };
    },
    build: async ({
      entryFile,
      graphId,
      graphOptions,
      onProgress,
      serializerOptions,
      transformOptions,
    }) => {
      let revision;
      const revPromise = this._bundler.getRevisionByGraphId(graphId);
      if (revPromise == null) {
        ({revision} = await this._bundler.initializeGraph(
          entryFile,
          transformOptions,
          {onProgress, shallow: graphOptions.shallow},
        ));
      } else {
        revision = await revPromise;
      }

      let {prepend, graph} = revision;
      if (serializerOptions.modulesOnly) {
        prepend = [];
      }

      return sourceMapString([...prepend, ...this._getSortedModules(graph)], {
        excludeSource: serializerOptions.excludeSource,
        processModuleFilter: this._config.serializer.processModuleFilter,
      });
    },
    finish({mres, result}) {
      mres.setHeader('Content-Type', 'application/json');
      mres.end(result.toString());
    },
  });

  _processMetadataRequest = this._createRequestProcessor({
    createStartEntry(context: ProcessStartContext) {
      return {
        action_name: 'Requesting bundle metadata',
        bundle_url: context.req.url,
        entry_point: context.entryFile,
        bundler: 'delta',
      };
    },
    createEndEntry(context: ProcessEndContext<BundleMetadata>) {
      return {
        bundler: 'delta',
      };
    },
    build: async ({
      entryFile,
      transformOptions,
      serializerOptions,
      onProgress,
      revisionId,
    }) => {
      if (revisionId == null) {
        throw new Error(
          'You must provide a `revisionId` query parameter to the metadata endpoint.',
        );
      }

      let revision;
      const revPromise = this._bundler.getRevision(revisionId);
      if (revPromise == null) {
        throw new RevisionNotFoundError(revisionId);
      } else {
        revision = await revPromise;
      }

      const base = baseJSBundle(entryFile, revision.prepend, revision.graph, {
        asyncRequireModulePath: this._config.transformer.asyncRequireModulePath,
        processModuleFilter: this._config.serializer.processModuleFilter,
        createModuleId: this._createModuleId,
        getRunModuleStatement: this._config.serializer.getRunModuleStatement,
        dev: transformOptions.dev,
        projectRoot: this._config.projectRoot,
        modulesOnly: serializerOptions.modulesOnly,
        runBeforeMainModule: this._config.serializer.getModulesRunBeforeMainModule(
          path.relative(this._config.projectRoot, entryFile),
        ),
        runModule: serializerOptions.runModule,
        sourceMapUrl: serializerOptions.sourceMapUrl,
        sourceUrl: serializerOptions.sourceUrl,
        inlineSourceMap: serializerOptions.inlineSourceMap,
      });

      // $FlowFixMe the return value of an async function is always a Promise
      return bundleToString(base).metadata;
    },
    finish({mres, result}) {
      mres.setHeader('Content-Type', 'application/json');
      mres.end(JSON.stringify(result));
    },
  });

  _processAssetsRequest = this._createRequestProcessor({
    createStartEntry(context: ProcessStartContext) {
      return {
        action_name: 'Requesting assets',
        bundle_url: context.req.url,
        entry_point: context.entryFile,
        bundler: 'delta',
      };
    },
    createEndEntry(context: ProcessEndContext<$ReadOnlyArray<AssetData>>) {
      return {
        bundler: 'delta',
      };
    },
    build: async ({entryFile, transformOptions, onProgress}) => {
      const {graph} = await this._bundler.buildGraph(
        entryFile,
        transformOptions,
        {onProgress, shallow: false},
      );

      return await getAssets(graph, {
        processModuleFilter: this._config.serializer.processModuleFilter,
        assetPlugins: this._config.transformer.assetPlugins,
        platform: transformOptions.platform,
        publicPath: this._config.transformer.publicPath,
        projectRoot: this._config.projectRoot,
      });
    },
    finish({mres, result}) {
      mres.setHeader('Content-Type', 'application/json');
      mres.end(JSON.stringify(result));
    },
  });

  _symbolicate(req: IncomingMessage, res: ServerResponse) {
    const symbolicatingLogEntry = log(createActionStartEntry('Symbolicating'));

    debug('Start symbolication');

    /* $FlowFixMe: where is `rowBody` defined? Is it added by
     * the `connect` framework? */
    Promise.resolve(req.rawBody)
      .then((body: string) => {
        const stack = JSON.parse(body).stack;

        // In case of multiple bundles / HMR, some stack frames can have
        // different URLs from others
        const urls = new Set();
        stack.forEach(frame => {
          const sourceUrl = frame.file;
          // Skip `/debuggerWorker.js` which drives remote debugging because it
          // does not need to symbolication.
          // Skip anything except http(s), because there is no support for that yet
          if (
            sourceUrl != null &&
            !urls.has(sourceUrl) &&
            !sourceUrl.endsWith('/debuggerWorker.js') &&
            sourceUrl.startsWith('http')
          ) {
            urls.add(sourceUrl);
          }
        });

        const mapPromises = Array.from(urls.values()).map(
          this._explodedSourceMapForURL,
          this,
        );

        debug('Getting source maps for symbolication');
        return Promise.all(mapPromises).then(maps => {
          debug('Performing fast symbolication');
          const urlsToMaps = zip(urls.values(), maps);
          return symbolicate(stack, urlsToMaps, this._config);
        });
      })
      .then(
        (stack: $ReadOnlyArray<StackFrameOutput>) => {
          debug('Symbolication done');
          res.end(JSON.stringify({stack}));
          process.nextTick(() => {
            log(createActionEndEntry(symbolicatingLogEntry));
          });
        },
        error => {
          console.error(error.stack || error);
          res.statusCode = 500;
          res.end(JSON.stringify({error: error.message}));
        },
      );
  }

  async _explodedSourceMapForURL(reqUrl: string): Promise<ExplodedSourceMap> {
    const {options} = parseOptionsFromUrl(
      reqUrl,
      new Set(this._config.resolver.platforms),
    );

    const {
      entryFile,
      transformOptions,
      serializerOptions,
      graphOptions,
      onProgress,
    } = splitBundleOptions(options);

    /**
     * `entryFile` is relative to projectRoot, we need to use resolution function
     * to find the appropriate file with supported extensions.
     */
    const resolutionFn = await transformHelpers.getResolveDependencyFn(
      this._bundler.getBundler(),
      transformOptions.platform,
    );
    const resolvedEntryFilePath = resolutionFn(
      `${this._config.projectRoot}/.`,
      entryFile,
    );

    const graphId = getGraphId(resolvedEntryFilePath, transformOptions, {
      shallow: graphOptions.shallow,
      experimentalImportBundleSupport: this._config.transformer
        .experimentalImportBundleSupport,
    });
    let revision;
    const revPromise = this._bundler.getRevisionByGraphId(graphId);
    if (revPromise == null) {
      ({revision} = await this._bundler.initializeGraph(
        resolvedEntryFilePath,
        transformOptions,
        {onProgress, shallow: graphOptions.shallow},
      ));
    } else {
      revision = await revPromise;
    }

    let {prepend, graph} = revision;
    if (serializerOptions.modulesOnly) {
      prepend = [];
    }

    return getExplodedSourceMap(
      [...prepend, ...this._getSortedModules(graph)],
      {
        processModuleFilter: this._config.serializer.processModuleFilter,
      },
    );
  }

  getNewBuildID(): string {
    return (this._nextBundleBuildID++).toString(36);
  }

  getPlatforms(): $ReadOnlyArray<string> {
    return this._config.resolver.platforms;
  }

  getWatchFolders(): $ReadOnlyArray<string> {
    return this._config.watchFolders;
  }

  getVisualizerConfig(): $ReadOnly<VisualizerConfigT> {
    return this._config.visualizer;
  }

  static DEFAULT_GRAPH_OPTIONS = {
    customTransformOptions: Object.create(null),
    dev: true,
    hot: false,
    minify: false,
  };

  static DEFAULT_BUNDLE_OPTIONS = {
    ...Server.DEFAULT_GRAPH_OPTIONS,
    excludeSource: false,
    inlineSourceMap: false,
    modulesOnly: false,
    onProgress: null,
    runModule: true,
    shallow: false,
    sourceMapUrl: null,
    sourceUrl: null,
  };
}

function* zip<X, Y>(xs: Iterable<X>, ys: Iterable<Y>): Iterable<[X, Y]> {
  //$FlowIssue #9324959
  const ysIter: Iterator<Y> = ys[Symbol.iterator]();
  for (const x of xs) {
    const y = ysIter.next();
    if (y.done) {
      return;
    }
    yield [x, y.value];
  }
}

module.exports = Server;
