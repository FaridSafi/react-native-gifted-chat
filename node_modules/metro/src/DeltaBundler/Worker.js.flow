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

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {stableHash} = require('metro-cache');

import type Transformer, {
  JsTransformOptions,
  JsTransformerConfig,
} from '../JSTransformer/worker';
import type {TransformResult} from './types.flow';
import type {LogEntry} from 'metro-core/src/Logger';

export type {
  JsTransformOptions as TransformOptions,
} from '../JSTransformer/worker';

export type Worker = {|
  +transform: typeof transform,
|};

export type TransformerFn = (
  string,
  Buffer,
  JsTransformOptions,
) => Promise<TransformResult<>>;

export type TransformerConfig = {
  transformerPath: string,
  transformerConfig: JsTransformerConfig,
};

type Data = $ReadOnly<{|
  result: TransformResult<>,
  sha1: string,
  transformFileStartLogEntry: LogEntry,
  transformFileEndLogEntry: LogEntry,
|}>;

const transformers: {[string]: Transformer} = {};

function getTransformer(
  projectRoot: string,
  {transformerPath, transformerConfig}: TransformerConfig,
): Transformer {
  const transformerKey = stableHash([
    projectRoot,
    transformerPath,
    transformerConfig,
  ]).toString('hex');

  if (transformers[transformerKey]) {
    return transformers[transformerKey];
  }

  // eslint-disable-next-line lint/flow-no-fixme
  // $FlowFixMe Transforming fixed types to generic types during refactor.
  const Transformer = require(transformerPath);
  transformers[transformerKey] = new Transformer(
    projectRoot,
    transformerConfig,
  );

  return transformers[transformerKey];
}

async function transform(
  filename: string,
  transformOptions: JsTransformOptions,
  projectRoot: string,
  transformerConfig: TransformerConfig,
): Promise<Data> {
  const transformer = getTransformer(projectRoot, transformerConfig);

  const transformFileStartLogEntry = {
    action_name: 'Transforming file',
    action_phase: 'start',
    file_name: filename,
    log_entry_label: 'Transforming file',
    start_timestamp: process.hrtime(),
  };

  const data = fs.readFileSync(path.resolve(projectRoot, filename));
  const sha1 = crypto
    .createHash('sha1')
    .update(data)
    .digest('hex');

  const result = await transformer.transform(filename, data, transformOptions);

  const transformFileEndLogEntry = getEndLogEntry(
    transformFileStartLogEntry,
    filename,
  );

  return {
    result,
    sha1,
    transformFileStartLogEntry,
    transformFileEndLogEntry,
  };
}

function getEndLogEntry(startLogEntry: LogEntry, filename: string): LogEntry {
  const timeDelta = process.hrtime(startLogEntry.start_timestamp);
  const duration_ms = Math.round((timeDelta[0] * 1e9 + timeDelta[1]) / 1e6);

  return {
    action_name: 'Transforming file',
    action_phase: 'end',
    file_name: filename,
    duration_ms,
    log_entry_label: 'Transforming file',
  };
}

((module.exports = {
  transform,
}): Worker);
