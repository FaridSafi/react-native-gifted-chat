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

const {greatestLowerBound} = require('metro-source-map/src/Consumer/search');
const {
  SourceMetadataMapConsumer,
} = require('metro-symbolicate/src/Symbolication');

import type {ExplodedSourceMap} from '../DeltaBundler/Serializers/getExplodedSourceMap';
import type {ConfigT} from 'metro-config/src/configTypes.flow';

export type StackFrameInput = {
  +file: ?string,
  +lineNumber: ?number,
  +column: ?number,
  +methodName: ?string,
};
export type StackFrameOutput = $ReadOnly<{
  ...StackFrameInput,
  +collapse: boolean,
}>;
type ExplodedSourceMapModule = $ElementType<ExplodedSourceMap, number>;
type Position = {|+line1Based: number, column0Based: number|};

function createFunctionNameGetter(
  module: ExplodedSourceMapModule,
): Position => ?string {
  const consumer = new SourceMetadataMapConsumer(
    {
      version: 3,
      mappings: '',
      sources: ['dummy'],
      names: [],
      x_facebook_sources: [[module.functionMap]],
    },
    name => name /* no normalization needed */,
  );
  return ({line1Based, column0Based}) =>
    consumer.functionNameFor({
      line: line1Based,
      column: column0Based,
      source: 'dummy',
    });
}

async function symbolicate(
  stack: $ReadOnlyArray<StackFrameInput>,
  maps: Iterable<[string, ExplodedSourceMap]>,
  config: ConfigT,
): Promise<$ReadOnlyArray<StackFrameOutput>> {
  const mapsByUrl = new Map();
  for (const [url, map] of maps) {
    mapsByUrl.set(url, map);
  }
  const functionNameGetters = new Map();

  function findModule(frame: StackFrameInput): ?ExplodedSourceMapModule {
    const map = mapsByUrl.get(frame.file);
    if (!map || frame.lineNumber == null) {
      return null;
    }
    const moduleIndex = greatestLowerBound(
      map,
      frame.lineNumber,
      (target, candidate) => target - candidate.firstLine1Based,
    );
    if (moduleIndex == null) {
      return null;
    }
    return map[moduleIndex];
  }

  function findOriginalPos(
    frame: StackFrameInput,
    module: ExplodedSourceMapModule,
  ): ?Position {
    if (
      module.map == null ||
      frame.lineNumber == null ||
      frame.column == null
    ) {
      return null;
    }
    const generatedPosInModule = {
      line1Based: frame.lineNumber - module.firstLine1Based + 1,
      column0Based: frame.column,
    };
    const mappingIndex = greatestLowerBound(
      module.map,
      generatedPosInModule,
      (target, candidate) => {
        if (target.line1Based === candidate[0]) {
          return target.column0Based - candidate[1];
        }
        return target.line1Based - candidate[0];
      },
    );
    if (mappingIndex == null) {
      return null;
    }
    const mapping = module.map[mappingIndex];
    if (
      mapping[0] !== generatedPosInModule.line1Based ||
      mapping.length < 4 /* no source line/column info */
    ) {
      return null;
    }
    return {
      // $FlowFixMe: Length checks do not refine tuple unions.
      line1Based: mapping[2],
      // $FlowFixMe: Length checks do not refine tuple unions.
      column0Based: mapping[3],
    };
  }

  function findFunctionName(originalPos, module): ?string {
    if (module.functionMap) {
      let getFunctionName = functionNameGetters.get(module);
      if (!getFunctionName) {
        getFunctionName = createFunctionNameGetter(module);
        functionNameGetters.set(module, getFunctionName);
      }
      return getFunctionName(originalPos);
    }
    return null;
  }

  function symbolicateFrame(frame: StackFrameInput): StackFrameInput {
    const module = findModule(frame);
    if (!module) {
      return frame;
    }
    if (!Array.isArray(module.map)) {
      throw new Error(
        `Unexpected module with serialized source map found: ${module.path}`,
      );
    }
    const originalPos = findOriginalPos(frame, module);
    if (!originalPos) {
      return frame;
    }
    const methodName =
      findFunctionName(originalPos, module) ?? frame.methodName;
    return {
      ...frame,
      methodName,
      file: module.path,
      lineNumber: originalPos.line1Based,
      column: originalPos.column0Based,
    };
  }

  async function customizeFrame(
    frame: StackFrameInput,
  ): Promise<StackFrameOutput> {
    const customizations =
      (await config.symbolicator.customizeFrame(frame)) || {};
    return {...frame, collapse: false, ...customizations};
  }

  return Promise.all(stack.map(symbolicateFrame).map(customizeFrame));
}

module.exports = symbolicate;
