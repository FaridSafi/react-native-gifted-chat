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

const Bundler = require('./Bundler');
const DeltaBundler = require('./DeltaBundler');
const ResourceNotFoundError = require('./IncrementalBundler/ResourceNotFoundError');

const crypto = require('crypto');
const fs = require('fs');
const getGraphId = require('./lib/getGraphId');
const getPrependedScripts = require('./lib/getPrependedScripts');
const path = require('path');
const transformHelpers = require('./lib/transformHelpers');

import type {Options as DeltaBundlerOptions} from './DeltaBundler/types.flow';
import type {DeltaResult, Module, Graph} from './DeltaBundler';
import type {GraphId} from './lib/getGraphId';
import type {TransformInputOptions} from './lib/transformHelpers';
import type {ConfigT} from 'metro-config/src/configTypes.flow';

export opaque type RevisionId: string = string;

export type OutputGraph = Graph<>;

type OtherOptions = {|
  +onProgress: $PropertyType<DeltaBundlerOptions<>, 'onProgress'>,
  +shallow: boolean,
|};

export type GraphRevision = {|
  // Identifies the last computed revision.
  +id: RevisionId,
  +date: Date,
  +graphId: GraphId,
  +graph: OutputGraph,
  +prepend: $ReadOnlyArray<Module<>>,
|};

function createRevisionId(): RevisionId {
  return crypto.randomBytes(8).toString('hex');
}

function revisionIdFromString(str: string): RevisionId {
  return str;
}

class IncrementalBundler {
  _config: ConfigT;
  _bundler: Bundler;
  _deltaBundler: DeltaBundler<>;
  _revisionsById: Map<RevisionId, Promise<GraphRevision>> = new Map();
  _revisionsByGraphId: Map<GraphId, Promise<GraphRevision>> = new Map();

  static revisionIdFromString = revisionIdFromString;

  constructor(config: ConfigT) {
    this._config = config;
    this._bundler = new Bundler(config);
    this._deltaBundler = new DeltaBundler(this._bundler);
  }

  end(): void {
    this._deltaBundler.end();
    this._bundler.end();
  }

  getBundler(): Bundler {
    return this._bundler;
  }

  getDeltaBundler(): DeltaBundler<> {
    return this._deltaBundler;
  }

  getRevision(revisionId: RevisionId): ?Promise<GraphRevision> {
    return this._revisionsById.get(revisionId);
  }

  getRevisionByGraphId(graphId: GraphId): ?Promise<GraphRevision> {
    return this._revisionsByGraphId.get(graphId);
  }

  async buildGraphForEntries(
    entryFiles: $ReadOnlyArray<string>,
    transformOptions: TransformInputOptions,
    otherOptions?: OtherOptions = {
      onProgress: null,
      shallow: false,
    },
  ): Promise<OutputGraph> {
    const absoluteEntryFiles = entryFiles.map((entryFile: string) =>
      path.resolve(this._config.projectRoot, entryFile),
    );

    await Promise.all(
      absoluteEntryFiles.map(
        (entryFile: string) =>
          new Promise((resolve: void => void, reject: mixed => mixed) => {
            // This should throw an error if the file doesn't exist.
            // Using this instead of fs.exists to account for SimLinks.
            fs.realpath(entryFile, err => {
              if (err) {
                reject(new ResourceNotFoundError(entryFile));
              } else {
                resolve();
              }
            });
          }),
      ),
    );

    const graph = await this._deltaBundler.buildGraph(absoluteEntryFiles, {
      resolve: await transformHelpers.getResolveDependencyFn(
        this._bundler,
        transformOptions.platform,
      ),
      transform: await transformHelpers.getTransformFn(
        absoluteEntryFiles,
        this._bundler,
        this._deltaBundler,
        this._config,
        transformOptions,
      ),
      onProgress: otherOptions.onProgress,
      experimentalImportBundleSupport: this._config.transformer
        .experimentalImportBundleSupport,
      shallow: otherOptions.shallow,
    });

    this._config.serializer.experimentalSerializerHook(graph, {
      added: graph.dependencies,
      modified: new Map(),
      deleted: new Set(),
      reset: true,
    });

    return graph;
  }

  async buildGraph(
    entryFile: string,
    transformOptions: TransformInputOptions,
    otherOptions?: OtherOptions = {
      onProgress: null,
      shallow: false,
    },
  ): Promise<{|+graph: OutputGraph, +prepend: $ReadOnlyArray<Module<>>|}> {
    const graph = await this.buildGraphForEntries(
      [entryFile],
      transformOptions,
      otherOptions,
    );

    const transformOptionsWithoutType = {
      customTransformOptions: transformOptions.customTransformOptions,
      dev: transformOptions.dev,
      experimentalImportSupport: transformOptions.experimentalImportSupport,
      hot: transformOptions.hot,
      minify: transformOptions.minify,
      unstable_disableES6Transforms:
        transformOptions.unstable_disableES6Transforms,
      platform: transformOptions.platform,
    };

    const prepend = await getPrependedScripts(
      this._config,
      transformOptionsWithoutType,
      this._bundler,
      this._deltaBundler,
    );

    return {
      prepend,
      graph,
    };
  }

  // TODO T34760750 (alexkirsz) Eventually, I'd like to get to a point where
  // this class exposes only initializeGraph and updateGraph.
  async initializeGraph(
    entryFile: string,
    transformOptions: TransformInputOptions,
    otherOptions?: OtherOptions = {
      onProgress: null,
      shallow: false,
    },
  ): Promise<{delta: DeltaResult<>, revision: GraphRevision}> {
    const graphId = getGraphId(entryFile, transformOptions, {
      shallow: otherOptions.shallow,
      experimentalImportBundleSupport: this._config.transformer
        .experimentalImportBundleSupport,
    });
    const revisionId = createRevisionId();
    const revisionPromise = (async () => {
      const {graph, prepend} = await this.buildGraph(
        entryFile,
        transformOptions,
        otherOptions,
      );
      return {
        id: revisionId,
        date: new Date(),
        graphId,
        graph,
        prepend,
      };
    })();

    this._revisionsById.set(revisionId, revisionPromise);
    this._revisionsByGraphId.set(graphId, revisionPromise);
    try {
      const revision = await revisionPromise;
      const delta = {
        added: revision.graph.dependencies,
        modified: new Map(),
        deleted: new Set(),
        reset: true,
      };
      return {
        revision,
        delta,
      };
    } catch (err) {
      // Evict a bad revision from the cache since otherwise
      // we'll keep getting it even after the build is fixed.
      this._revisionsById.delete(revisionId);
      this._revisionsByGraphId.delete(graphId);
      throw err;
    }
  }

  async updateGraph(
    revision: GraphRevision,
    reset: boolean,
  ): Promise<{delta: DeltaResult<>, revision: GraphRevision}> {
    const delta = await this._deltaBundler.getDelta(revision.graph, {
      reset,
      shallow: false,
    });

    this._config.serializer.experimentalSerializerHook(revision.graph, delta);

    if (
      delta.added.size > 0 ||
      delta.modified.size > 0 ||
      delta.deleted.size > 0
    ) {
      this._revisionsById.delete(revision.id);
      revision = {
        ...revision,
        // Generate a new revision id, to be used to verify the next incremental
        // request.
        id: crypto.randomBytes(8).toString('hex'),
        date: new Date(),
      };
      const revisionPromise = Promise.resolve(revision);
      this._revisionsById.set(revision.id, revisionPromise);
      this._revisionsByGraphId.set(revision.graphId, revisionPromise);
    }

    return {revision, delta};
  }
}

module.exports = IncrementalBundler;
