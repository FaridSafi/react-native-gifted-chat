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

import type {Ast} from '@babel/core';
import type {
  MixedSourceMap,
  FBSourceFunctionMap,
  BasicSourceMap,
} from 'metro-source-map';
import type {TransformResultDependency} from 'metro/src/DeltaBundler';

export type BuildResult = GraphResult;

export type Callback<A = void, B = void> = (Error => void) &
  ((null | void, A, B) => void);

export type Dependency = {|
  id: string,
  +isAsync: boolean,
  +isPrefetchOnly: boolean,
  path: string,
|};

export type File = {|
  code: string,
  map: ?BasicSourceMap,
  functionMap: ?FBSourceFunctionMap,
  path: string,
  type: CodeFileTypes,
  libraryIdx: ?number,
  soundResources?: ?Array<string>,
|};

type CodeFileTypes = 'module' | 'script';

export type GraphFn = (
  entryPoints: Iterable<string>,
  // platform: string,
) => GraphResult;

export type GraphResult = {|
  entryModules: Array<Module>,
  modules: Array<Module>,
|};

export type ModuleIds = {|
  /**
   * The module ID is global across all bundles and identifies the module
   * uniquely. This is useful to cache modules that has been loaded already at
   * the app level.
   */
  +moduleId: number,
  /**
   * The local ID is local to each bundle. For example bundle zero may have a
   * module with local ID 1, and bundle one a module with the same local ID.
   * This is useful so that RAM bundles tables start at zero, but the `moduleId`
   * will be used otherwise.
   */
  +localId: number,
|};

/**
 * Indempotent function that gets us the IDs corresponding to a particular
 * module identified by path.
 */
export type IdsForPathFn = ({path: string}) => ModuleIds;

export type LoadResult = {
  file: File,
  dependencies: $ReadOnlyArray<TransformResultDependency>,
};

export type LoadFn = (file: string) => LoadResult;

export type Module = {|
  dependencies: Array<Dependency>,
  file: File,
|};

export type PostProcessModules = (
  modules: $ReadOnlyArray<Module>,
  entryPoints: Array<string>,
) => $ReadOnlyArray<Module>;

export type OutputFnArg = {|
  filename: string,
  idsForPath: IdsForPathFn,
  modules: Iterable<Module>,
  requireCalls: Iterable<Module>,
  sourceMapPath?: ?string,
  bundleOrderFile?: ?string,
  enableIDInlining: boolean,
  segmentID: number,
|};
export type OutputFn<
  M: MixedSourceMap = MixedSourceMap,
> = OutputFnArg => OutputResult<M>;

export type OutputResult<M: MixedSourceMap> = {|
  code: string | Buffer,
  extraFiles?: Iterable<[string, string | Buffer]>,
  map: M,
|};

export type PackageData = {|
  browser?: Object | string,
  main?: string,
  name?: string,
  'react-native'?: Object | string,
|};

export type ResolveFn = (id: string, source: ?string) => string;

export type TransformerResult = {|
  ast: ?Ast,
  code: string,
  map: ?BasicSourceMap,
|};

export type TransformResult = {|
  code: string,
  dependencies: $ReadOnlyArray<TransformResultDependency>,
  dependencyMapName?: string,
  map: ?BasicSourceMap,
  requireName: string,
  soundResources?: ?Array<string>,
  importNames?: {all: string, default: string},
  isESModule?: true,
|};

export type TransformResults = {[string]: TransformResult};

export type TransformVariants = {+[name: string]: {}};

export type TransformedCodeFile = {|
  +file: string,
  +functionMap: ?FBSourceFunctionMap,
  +hasteID: ?string,
  package?: PackageData,
  +transformed: TransformResults,
  +type: CodeFileTypes,
|};

export type ImageSize = {|+width: number, +height: number|};

export type AssetFile = {|
  /**
   * The path of the asset that is shared by all potential variants
   * of this asset. For example `foo/bar@3x.png` would have the
   * asset path `foo/bar.png`.
   */
  +assetPath: string,
  /**
   * The content is encoded in Base64 so that it can be stored in JSON files,
   * that are used to communicate between different commands of a Buck
   * build worker, for example.
   */
  +contentBase64: string,
  /**
   * Guessed from the file extension, for example `png` or `html`.
   */
  +contentType: string,
  /**
   * Hash of the asset file content.
   */
  +hash: string,
  /**
   * The path of the original file for this asset. For example
   * `foo/bar@3x.ios.png`. This is most useful for reporting purposes, such as
   * error messages.
   */
  +filePath: string,
  /**
   * If the asset is an image, this contain the size in physical pixels (ie.
   * regarless of whether it's a `@2x` or `@3x` version of a smaller image).
   */
  +physicalSize: ?ImageSize,
  /**
   * The platform this asset is designed for, for example `ios` if the file name
   * is `foo.ios.js`. `null` if the asset is not platform-specific.
   */
  +platform: ?string,
  /**
   * The scale this asset is designed for, for example `2`
   * if the file name is `foo@2x.png`.
   */
  +scale: number,
|};

export type TransformedSourceFile =
  | {|
      +type: 'code',
      +details: TransformedCodeFile,
    |}
  | {|
      +type: 'asset',
      +details: AssetFile,
    |}
  | {|
      +type: 'unknown',
    |};

export type LibraryOptions = {|
  dependencies?: Array<string>,
  optimize: boolean,
  platform?: string,
  rebasePath: string => string,
|};

export type Base64Content = string;
export type AssetContents = {
  +data: Base64Content,
  +outputPath: string,
};
export type AssetContentsByPath = {
  +[moduleFilePath: string]: $ReadOnlyArray<AssetContents>,
};

export type ResolvedCodeFile = {|
  +codeFile: TransformedCodeFile,
  /**
   * Imagine we have a source file that contains a `require('foo')`. The library
   * will resolve the path of the module `foo` and store it in this field along
   * all the other dependencies. For example, it could be
   * `{'foo': 'bar/foo.js', 'bar': 'node_modules/bar/index.js'}`.
   */
  +filePathsByDependencyName: {[dependencyName: string]: string},
|};

export type LibraryBoundCodeFile = {|
  ...ResolvedCodeFile,
  /**
   * Index of the library that this code file has been exported from.
   */
  +libraryIdx: number,
|};

/**
 * Describe a set of JavaScript files and the associated assets. It could be
 * depending on modules from other libraries. To be able to resolve these
 * dependencies, these libraries need to be provided by callsites (ex. Buck).
 */
export type Library = {|
  +files: Array<TransformedCodeFile>,
  /* cannot be a Map because it's JSONified later on */
  +assets: AssetContentsByPath,
|};

/**
 * Just like a `Library`, but it also contains module resolutions. For example
 * if there is a `require('foo')` in some JavaScript file, we keep track of the
 * path it resolves to, ex. `beep/glo/foo.js`.
 */
export type ResolvedLibrary = {|
  +files: $ReadOnlyArray<ResolvedCodeFile>,
  /* cannot be a Map because it's JSONified later on */
  +assets: AssetContentsByPath,
|};
