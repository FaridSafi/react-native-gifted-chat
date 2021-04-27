/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const GraphNotFoundError = require('../IncrementalBundler/GraphNotFoundError');
const ResourceNotFoundError = require('../IncrementalBundler/ResourceNotFoundError');
const RevisionNotFoundError = require('../IncrementalBundler/RevisionNotFoundError');

const serializeError = require('serialize-error');

const {
  UnableToResolveError,
} = require('../node-haste/DependencyGraph/ModuleResolution');
const {AmbiguousModuleResolutionError} = require('metro-core');

import type {FormattedError} from './bundle-modules/types.flow';

export type CustomError = Error & {
  type?: string,
  filename?: string,
  lineNumber?: number,
  errors?: Array<{
    description: string,
    filename: string,
    lineNumber: number,
  }>,
};

function formatBundlingError(error: CustomError): FormattedError {
  if (error instanceof AmbiguousModuleResolutionError) {
    const he = error.hasteError;
    const message =
      "Ambiguous resolution: module '" +
      `${error.fromModulePath}\' tries to require \'${he.hasteName}\', but ` +
      'there are several files providing this module. You can delete or ' +
      'fix them: \n\n' +
      Object.keys(he.duplicatesSet)
        .sort()
        .map(dupFilePath => `${dupFilePath}`)
        .join('\n\n');

    return {
      type: 'AmbiguousModuleResolutionError',
      message,
      errors: [{description: message}],
    };
  }

  if (
    error instanceof UnableToResolveError ||
    (error instanceof Error &&
      (error.type === 'TransformError' || error.type === 'NotFoundError'))
  ) {
    error.errors = [
      {
        description: error.message,
        filename: error.filename,
        lineNumber: error.lineNumber,
      },
    ];

    return serializeError(error);
  } else if (error instanceof ResourceNotFoundError) {
    return {
      type: 'ResourceNotFoundError',
      errors: [],
      message: error.message,
    };
  } else if (error instanceof GraphNotFoundError) {
    return {
      type: 'GraphNotFoundError',
      errors: [],
      message: error.message,
    };
  } else if (error instanceof RevisionNotFoundError) {
    return {
      type: 'RevisionNotFoundError',
      errors: [],
      message: error.message,
    };
  } else {
    return {
      type: 'InternalError',
      errors: [],
      message: 'Metro Bundler has encountered an error: ' + error.message,
    };
  }
}

module.exports = formatBundlingError;
