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

import type {GraphId} from '../lib/getGraphId';

class GraphNotFoundError extends Error {
  graphId: GraphId;

  constructor(graphId: GraphId) {
    super(`The graph \`${graphId}\` was not found.`);
    this.graphId = graphId;
  }
}

module.exports = GraphNotFoundError;
