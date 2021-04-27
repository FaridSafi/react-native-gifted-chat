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

const {
  initialTraverseDependencies,
  reorderGraph,
  traverseDependencies,
} = require('./traverseDependencies');
const {EventEmitter} = require('events');

import type DependencyGraph from '../node-haste/DependencyGraph';
import type {DeltaResult, Graph, Options} from './types.flow';

/**
 * This class is in charge of calculating the delta of changed modules that
 * happen between calls. To do so, it subscribes to file changes, so it can
 * traverse the files that have been changed between calls and avoid having to
 * traverse the whole dependency tree for trivial small changes.
 */
class DeltaCalculator<T> extends EventEmitter {
  _dependencyGraph: DependencyGraph;
  _options: Options<T>;

  _currentBuildPromise: ?Promise<DeltaResult<T>>;
  _deletedFiles: Set<string> = new Set();
  _modifiedFiles: Set<string> = new Set();

  _graph: Graph<T>;

  constructor(
    entryPoints: $ReadOnlyArray<string>,
    dependencyGraph: DependencyGraph,
    options: Options<T>,
  ) {
    super();

    this._options = options;
    this._dependencyGraph = dependencyGraph;

    this._graph = {
      dependencies: new Map(),
      entryPoints,
      importBundleNames: new Set(),
    };

    this._dependencyGraph
      .getWatcher()
      .on('change', this._handleMultipleFileChanges);
  }

  /**
   * Stops listening for file changes and clears all the caches.
   */
  end(): void {
    this._dependencyGraph
      .getWatcher()
      .removeListener('change', this._handleMultipleFileChanges);

    this.removeAllListeners();

    // Clean up all the cache data structures to deallocate memory.
    this._graph = {
      dependencies: new Map(),
      entryPoints: this._graph.entryPoints,
      importBundleNames: new Set(),
    };
    this._modifiedFiles = new Set();
    this._deletedFiles = new Set();
  }

  /**
   * Main method to calculate the delta of modules. It returns a DeltaResult,
   * which contain the modified/added modules and the removed modules.
   */
  async getDelta({
    reset,
    shallow,
  }: {
    reset: boolean,
    shallow: boolean,
  }): Promise<DeltaResult<T>> {
    // If there is already a build in progress, wait until it finish to start
    // processing a new one (delta server doesn't support concurrent builds).
    if (this._currentBuildPromise) {
      await this._currentBuildPromise;
    }

    // We don't want the modified files Set to be modified while building the
    // bundle, so we isolate them by using the current instance for the bundling
    // and creating a new instance for the file watcher.
    const modifiedFiles = this._modifiedFiles;
    this._modifiedFiles = new Set();
    const deletedFiles = this._deletedFiles;
    this._deletedFiles = new Set();

    // Concurrent requests should reuse the same bundling process. To do so,
    // this method stores the promise as an instance variable, and then it's
    // removed after it gets resolved.
    this._currentBuildPromise = this._getChangedDependencies(
      modifiedFiles,
      deletedFiles,
    );

    let result;

    const numDependencies = this._graph.dependencies.size;

    try {
      result = await this._currentBuildPromise;
    } catch (error) {
      // In case of error, we don't want to mark the modified files as
      // processed (since we haven't actually created any delta). If we do not
      // do so, asking for a delta after an error will produce an empty Delta,
      // which is not correct.
      modifiedFiles.forEach((file: string) => this._modifiedFiles.add(file));
      deletedFiles.forEach((file: string) => this._deletedFiles.add(file));

      // If after an error the number of modules has changed, we could be in
      // a weird state. As a safe net we clean the dependency modules to force
      // a clean traversal of the graph next time.
      if (this._graph.dependencies.size !== numDependencies) {
        this._graph.dependencies = new Map();
      }

      throw error;
    } finally {
      this._currentBuildPromise = null;
    }

    // Return all the modules if the client requested a reset delta.
    if (reset) {
      reorderGraph(this._graph, {shallow});

      return {
        added: this._graph.dependencies,
        modified: new Map(),
        deleted: new Set(),
        reset: true,
      };
    }

    return result;
  }

  /**
   * Returns the graph with all the dependencies. Each module contains the
   * needed information to do the traversing (dependencies, inverseDependencies)
   * plus some metadata.
   */
  getGraph(): Graph<T> {
    return this._graph;
  }

  _handleMultipleFileChanges = ({eventsQueue}) => {
    eventsQueue.forEach(this._handleFileChange);
  };

  /**
   * Handles a single file change. To avoid doing any work before it's needed,
   * the listener only stores the modified file, which will then be used later
   * when the delta needs to be calculated.
   */
  _handleFileChange = ({
    type,
    filePath,
  }: {
    type: string,
    filePath: string,
  }): mixed => {
    if (type === 'delete') {
      this._deletedFiles.add(filePath);
      this._modifiedFiles.delete(filePath);
    } else {
      this._deletedFiles.delete(filePath);
      this._modifiedFiles.add(filePath);
    }

    // Notify users that there is a change in some of the bundle files. This
    // way the client can choose to refetch the bundle.
    this.emit('change');
  };

  async _getChangedDependencies(
    modifiedFiles: Set<string>,
    deletedFiles: Set<string>,
  ): Promise<DeltaResult<T>> {
    if (!this._graph.dependencies.size) {
      const {added} = await initialTraverseDependencies(
        this._graph,
        this._options,
      );

      return {
        added,
        modified: new Map(),
        deleted: new Set(),
        reset: true,
      };
    }

    // If a file has been deleted, we want to invalidate any other file that
    // depends on it, so we can process it and correctly return an error.
    deletedFiles.forEach((filePath: string) => {
      const module = this._graph.dependencies.get(filePath);

      if (module) {
        module.inverseDependencies.forEach((path: string) => {
          // Only mark the inverse dependency as modified if it's not already
          // marked as deleted (in that case we can just ignore it).
          if (!deletedFiles.has(path)) {
            modifiedFiles.add(path);
          }
        });
      }
    });

    // We only want to process files that are in the bundle.
    const modifiedDependencies = Array.from(modifiedFiles).filter(
      (filePath: string) => this._graph.dependencies.has(filePath),
    );

    // No changes happened. Return empty delta.
    if (modifiedDependencies.length === 0) {
      return {
        added: new Map(),
        modified: new Map(),
        deleted: new Set(),
        reset: false,
      };
    }

    const {added, modified, deleted} = await traverseDependencies(
      modifiedDependencies,
      this._graph,
      this._options,
    );

    return {
      added,
      modified,
      deleted,
      reset: false,
    };
  }
}

module.exports = DeltaCalculator;
