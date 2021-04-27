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

export type ModuleMap = $ReadOnlyArray<[number, string]>;

export type Bundle = {|
  +pre: string,
  +post: string,
  +modules: ModuleMap,
|};

export type DeltaBundle = {|
  +added: ModuleMap,
  +modified: ModuleMap,
  +deleted: $ReadOnlyArray<number>,
|};

export type BundleVariant =
  | {|+base: true, +revisionId: string, ...Bundle|}
  | {|+base: false, +revisionId: string, ...DeltaBundle|};

export type BundleMetadata = {|
  +pre: number,
  +post: number,
  +modules: $ReadOnlyArray<[number, number]>,
|};

export type FormattedError = {|
  +type: string,
  +message: string,
  +errors: Array<{description: string}>,
|};

export type HmrModule = {|
  +module: [number, string],
  +sourceMappingURL: string,
  +sourceURL: string,
|};

export type HmrUpdate = {|
  +added: $ReadOnlyArray<HmrModule>,
  +deleted: $ReadOnlyArray<number>,
  +isInitialUpdate: boolean,
  +modified: $ReadOnlyArray<HmrModule>,
  +revisionId: string,
|};

export type HmrUpdateMessage = {|
  +type: 'update',
  +body: HmrUpdate,
|};

export type HmrErrorMessage = {|
  +type: 'error',
  +body: FormattedError,
|};

export type HmrClientMessage =
  | {|
      +type: 'register-entrypoints',
      +entryPoints: Array<string>,
    |}
  | {|
      +type: 'log',
      +level:
        | 'trace'
        | 'info'
        | 'warn'
        | 'log'
        | 'group'
        | 'groupCollapsed'
        | 'groupEnd'
        | 'debug',
      +data: Array<mixed>,
    |}
  | {|
      +type: 'log-opt-in',
    |};

export type HmrMessage =
  | {|
      +type: 'bundle-registered',
    |}
  | {|
      +type: 'update-start',
      +body: {|
        +isInitialUpdate: boolean,
      |},
    |}
  | {|
      +type: 'update-done',
    |}
  | HmrUpdateMessage
  | HmrErrorMessage;
