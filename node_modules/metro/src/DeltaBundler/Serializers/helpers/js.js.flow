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

const addParamsToDefineCall = require('../../../lib/addParamsToDefineCall');
const invariant = require('invariant');
const path = require('path');

import type {JsOutput} from '../../../JSTransformer/worker';
import type {MixedOutput, Module, Dependency} from '../../types.flow';

export type Options = {
  +createModuleId: string => number | string,
  +dev: boolean,
  +projectRoot: string,
};

function wrapModule(module: Module<>, options: Options): string {
  const output = getJsOutput(module);

  if (output.type.startsWith('js/script')) {
    return output.data.code;
  }

  const moduleId = options.createModuleId(module.path);
  const params = [
    moduleId,
    Array.from(module.dependencies.values()).map((dependency: Dependency) => {
      return options.createModuleId(dependency.absolutePath);
    }),
  ];

  // Add the module relative path as the last parameter (to make it easier to do
  // requires by name when debugging).
  if (options.dev) {
    params.push(path.relative(options.projectRoot, module.path));
  }

  return addParamsToDefineCall(output.data.code, ...params);
}

function getJsOutput(module: Module<>): JsOutput {
  const jsModules = module.output.filter(({type}) => type.startsWith('js/'));

  invariant(
    jsModules.length === 1,
    `Modules must have exactly one JS output, but ${module.path} has ${
      jsModules.length
    } JS outputs.`,
  );

  const jsOutput = (jsModules[0]: any);

  invariant(
    Number.isFinite(jsOutput.data.lineCount),
    `JS output must populate lineCount, but ${module.path} has ${
      jsOutput.type
    } output with lineCount '${jsOutput.data.lineCount}'`,
  );

  return jsOutput;
}

function isJsModule(module: Module<>): boolean {
  return module.output.filter(isJsOutput).length > 0;
}

function isJsOutput(output: MixedOutput): boolean %checks {
  return output.type.startsWith('js/');
}

module.exports = {
  getJsOutput,
  isJsModule,
  wrapModule,
};
