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

export type MixedOutput = {|
  +data: mixed,
  +type: string,
|};

export type TransformResultDependency = {|
  /**
   * The literal name provided to a require or import call. For example 'foo' in
   * case of `require('foo')`.
   */
  +name: string,

  /**
   * Extra data returned by the dependency extractor. Whatever is added here is
   * blindly piped by Metro to the serializers.
   */
  +data: {|
    /**
     * If `true` this dependency is due to a dynamic `import()` call. If `false`,
     * this dependency was pulled using a synchronous `require()` call.
     */
    +isAsync: boolean,
    /**
     * The dependency is actually a `__prefetchImport()` call.
     */
    +isPrefetchOnly?: true,
  |},
|};

export type Dependency = {|
  +absolutePath: string,
  +data: TransformResultDependency,
|};

export type Module<T = MixedOutput> = {|
  +dependencies: Map<string, Dependency>,
  +inverseDependencies: Set<string>,
  +output: $ReadOnlyArray<T>,
  +path: string,
  +getSource: () => Buffer,
|};

export type Graph<T = MixedOutput> = {|
  dependencies: Map<string, Module<T>>,
  importBundleNames: Set<string>,
  +entryPoints: $ReadOnlyArray<string>,
|};

export type TransformResult<T = MixedOutput> = $ReadOnly<{|
  dependencies: $ReadOnlyArray<TransformResultDependency>,
  output: $ReadOnlyArray<T>,
|}>;

export type TransformResultWithSource<T = MixedOutput> = $ReadOnly<{|
  ...TransformResult<T>,
  getSource: () => Buffer,
|}>;

export type TransformFn<T = MixedOutput> = string => Promise<
  TransformResultWithSource<T>,
>;

export type Options<T = MixedOutput> = {|
  +resolve: (from: string, to: string) => string,
  +transform: TransformFn<T>,
  +onProgress: ?(numProcessed: number, total: number) => mixed,
  +experimentalImportBundleSupport: boolean,
  +shallow: boolean,
|};

export type DeltaResult<T = MixedOutput> = {|
  +added: Map<string, Module<T>>,
  +modified: Map<string, Module<T>>,
  +deleted: Set<string>,
  +reset: boolean,
|};

export type SerializerOptions = {|
  +asyncRequireModulePath: string,
  +createModuleId: string => number,
  +dev: boolean,
  +getRunModuleStatement: (number | string) => string,
  +inlineSourceMap: ?boolean,
  +modulesOnly: boolean,
  +processModuleFilter: (module: Module<>) => boolean,
  +projectRoot: string,
  +runBeforeMainModule: $ReadOnlyArray<string>,
  +runModule: boolean,
  +sourceMapUrl: ?string,
  +sourceUrl: ?string,
|};
