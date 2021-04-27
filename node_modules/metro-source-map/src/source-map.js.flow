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

const Consumer = require('./Consumer');
const Generator = require('./Generator');
const SourceMap = require('source-map');

import type {IConsumer} from './Consumer/types.flow';
export type {IConsumer};

// We need to export this for `metro-symbolicate`
const normalizeSourcePath = require('./Consumer/normalizeSourcePath');

const composeSourceMaps = require('./composeSourceMaps');
const {createIndexMap, BundleBuilder} = require('./BundleBuilder');
const {generateFunctionMap} = require('./generateFunctionMap');

import type {BabelSourceMapSegment} from '@babel/generator';

type GeneratedCodeMapping = [number, number];
type SourceMapping = [number, number, number, number];
type SourceMappingWithName = [number, number, number, number, string];

export type MetroSourceMapSegmentTuple =
  | SourceMappingWithName
  | SourceMapping
  | GeneratedCodeMapping;

export type FBSourcesArray = $ReadOnlyArray<?FBSourceMetadata>;
export type FBSourceMetadata = [?FBSourceFunctionMap];
export type FBSourceFunctionMap = {|
  +names: $ReadOnlyArray<string>,
  +mappings: string,
|};

export type FBSegmentMap = {
  [id: string]: MixedSourceMap,
};

export type BasicSourceMap = {|
  +file?: string,
  +mappings: string,
  +names: Array<string>,
  +sourceRoot?: string,
  +sources: Array<string>,
  +sourcesContent?: Array<?string>,
  +version: number,
  +x_facebook_offsets?: Array<number>,
  +x_metro_module_paths?: Array<string>,
  +x_facebook_sources?: FBSourcesArray,
  +x_facebook_segments?: FBSegmentMap,
|};

export type IndexMapSection = {
  map: IndexMap | BasicSourceMap,
  offset: {line: number, column: number},
};

export type IndexMap = {|
  +file?: string,
  +mappings?: void, // avoids SourceMap being a disjoint union
  +sections: Array<IndexMapSection>,
  +version: number,
  +x_facebook_offsets?: Array<number>,
  +x_metro_module_paths?: Array<string>,
  +x_facebook_sources?: FBSourcesArray,
  +x_facebook_segments?: FBSegmentMap,
|};

export type MixedSourceMap = IndexMap | BasicSourceMap;

function fromRawMappingsImpl(
  isBlocking: boolean,
  onDone: Generator => void,
  modules: $ReadOnlyArray<{
    /* $FlowFixMe(>=0.109.0 site=react_native_fb) This
    comment suppresses an error found when Flow v0.109 was deployed. To see
    the error delete this comment and run Flow. */
    +map: ?Array<MetroSourceMapSegmentTuple>,
    +functionMap: ?FBSourceFunctionMap,
    +path: string,
    +source: string,
    +code: string,
  }>,
  offsetLines: number,
): void {
  const modulesToProcess = modules.slice();
  const generator = new Generator();
  let carryOver = offsetLines;

  function processNextModule() {
    if (modulesToProcess.length === 0) {
      return true;
    }

    const mod = modulesToProcess.shift();
    const {code, map} = mod;
    if (Array.isArray(map)) {
      addMappingsForFile(generator, map, mod, carryOver);
    } else if (map != null) {
      throw new Error(
        `Unexpected module with full source map found: ${mod.path}`,
      );
    }
    carryOver = carryOver + countLines(code);
    return false;
  }

  function workLoop() {
    const time = process.hrtime();
    while (true) {
      const isDone = processNextModule();
      if (isDone) {
        onDone(generator);
        break;
      }
      if (!isBlocking) {
        // Keep the loop running but try to avoid blocking
        // for too long because this is not in a worker yet.
        const diff = process.hrtime(time);
        const NS_IN_MS = 1000000;
        if (diff[1] > 50 * NS_IN_MS) {
          // We've blocked for more than 50ms.
          // This code currently runs on the main thread,
          // so let's give Metro an opportunity to handle requests.
          setImmediate(workLoop);
          break;
        }
      }
    }
  }

  workLoop();
}

/**
 * Creates a source map from modules with "raw mappings", i.e. an array of
 * tuples with either 2, 4, or 5 elements:
 * generated line, generated column, source line, source line, symbol name.
 * Accepts an `offsetLines` argument in case modules' code is to be offset in
 * the resulting bundle, e.g. by some prefix code.
 */
function fromRawMappings(
  modules: $ReadOnlyArray<{
    +map: ?Array<MetroSourceMapSegmentTuple>,
    +functionMap: ?FBSourceFunctionMap,
    +path: string,
    +source: string,
    +code: string,
  }>,
  offsetLines: number = 0,
): Generator {
  let generator: void | Generator;
  fromRawMappingsImpl(
    true,
    g => {
      generator = g;
    },
    modules,
    offsetLines,
  );
  if (generator == null) {
    throw new Error('Expected fromRawMappingsImpl() to finish synchronously.');
  }
  return generator;
}

async function fromRawMappingsNonBlocking(
  modules: $ReadOnlyArray<{
    +map: ?Array<MetroSourceMapSegmentTuple>,
    +functionMap: ?FBSourceFunctionMap,
    +path: string,
    +source: string,
    +code: string,
  }>,
  offsetLines: number = 0,
): Promise<Generator> {
  return new Promise(resolve => {
    fromRawMappingsImpl(false, resolve, modules, offsetLines);
  });
}

/**
 * Transforms a standard source map object into a Raw Mappings object, to be
 * used across the bundler.
 */
function toBabelSegments(
  sourceMap: BasicSourceMap,
): Array<BabelSourceMapSegment> {
  const rawMappings = [];

  new SourceMap.SourceMapConsumer(sourceMap).eachMapping(map => {
    rawMappings.push({
      generated: {
        line: map.generatedLine,
        column: map.generatedColumn,
      },
      original: {
        line: map.originalLine,
        column: map.originalColumn,
      },
      source: map.source,
      name: map.name,
    });
  });

  return rawMappings;
}

function toSegmentTuple(
  mapping: BabelSourceMapSegment,
): MetroSourceMapSegmentTuple {
  const {column, line} = mapping.generated;
  const {name, original} = mapping;

  if (original == null) {
    return [line, column];
  }

  if (typeof name !== 'string') {
    return [line, column, original.line, original.column];
  }

  return [line, column, original.line, original.column, name];
}

function addMappingsForFile(generator, mappings, module, carryOver) {
  generator.startFile(module.path, module.source, module.functionMap);

  for (let i = 0, n = mappings.length; i < n; ++i) {
    addMapping(generator, mappings[i], carryOver);
  }

  generator.endFile();
}

function addMapping(generator, mapping, carryOver) {
  const n = mapping.length;
  const line = mapping[0] + carryOver;
  // lines start at 1, columns start at 0
  const column = mapping[1];
  if (n === 2) {
    generator.addSimpleMapping(line, column);
  } else if (n === 4) {
    const sourceMap: SourceMapping = (mapping: any);

    generator.addSourceMapping(line, column, sourceMap[2], sourceMap[3]);
  } else if (n === 5) {
    const sourceMap: SourceMappingWithName = (mapping: any);

    generator.addNamedSourceMapping(
      line,
      column,
      sourceMap[2],
      sourceMap[3],
      sourceMap[4],
    );
  } else {
    throw new Error(`Invalid mapping: [${mapping.join(', ')}]`);
  }
}

function countLines(string) {
  return string.split('\n').length;
}

module.exports = {
  BundleBuilder,
  composeSourceMaps,
  Consumer,
  createIndexMap,
  generateFunctionMap,
  fromRawMappings,
  fromRawMappingsNonBlocking,
  normalizeSourcePath,
  toBabelSegments,
  toSegmentTuple,
};
