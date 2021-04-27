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

const DeltaCalculator = require('./DeltaBundler/DeltaCalculator');

import type Bundler from './Bundler';
import type {
  DeltaResult,
  Graph,
  // eslint-disable-next-line no-unused-vars
  MixedOutput,
  Options,
} from './DeltaBundler/types.flow';

export type {
  DeltaResult,
  Graph,
  MixedOutput,
  Module,
  TransformFn,
  TransformResult,
  TransformResultDependency,
  TransformResultWithSource,
} from './DeltaBundler/types.flow';

/**
 * `DeltaBundler` uses the `DeltaTransformer` to build bundle deltas. This
 * module handles all the transformer instances so it can support multiple
 * concurrent clients requesting their own deltas. This is done through the
 * `clientId` param (which maps a client to a specific delta transformer).
 */
class DeltaBundler<T = MixedOutput> {
  _bundler: Bundler;
  _deltaCalculators: Map<Graph<T>, DeltaCalculator<T>> = new Map();

  constructor(bundler: Bundler) {
    this._bundler = bundler;
  }

  end(): void {
    this._deltaCalculators.forEach((deltaCalculator: DeltaCalculator<T>) =>
      deltaCalculator.end(),
    );
    this._deltaCalculators = new Map();
  }

  async buildGraph(
    entryPoints: $ReadOnlyArray<string>,
    options: Options<T>,
  ): Promise<Graph<T>> {
    const depGraph = await this._bundler.getDependencyGraph();

    const deltaCalculator = new DeltaCalculator(entryPoints, depGraph, options);

    await deltaCalculator.getDelta({reset: true, shallow: options.shallow});
    const graph = deltaCalculator.getGraph();

    this._deltaCalculators.set(graph, deltaCalculator);

    return graph;
  }

  async getDelta(
    graph: Graph<T>,
    {reset, shallow}: {reset: boolean, shallow: boolean},
  ): Promise<DeltaResult<T>> {
    const deltaCalculator = this._deltaCalculators.get(graph);

    if (!deltaCalculator) {
      throw new Error('Graph not found');
    }

    return await deltaCalculator.getDelta({reset, shallow});
  }

  listen(graph: Graph<T>, callback: () => mixed): () => void {
    const deltaCalculator = this._deltaCalculators.get(graph);

    if (!deltaCalculator) {
      throw new Error('Graph not found');
    }

    deltaCalculator.on('change', callback);

    return () => {
      deltaCalculator.removeListener('change', callback);
    };
  }

  endGraph(graph: Graph<T>): void {
    const deltaCalculator = this._deltaCalculators.get(graph);

    if (!deltaCalculator) {
      throw new Error('Graph not found');
    }

    deltaCalculator.end();

    this._deltaCalculators.delete(graph);
  }
}

module.exports = DeltaBundler;
