/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

export type Result<+TResolution, +TCandidates> =
  | {|+type: 'resolved', +resolution: TResolution|}
  | {|+type: 'failed', +candidates: TCandidates|};

export type Resolution = FileResolution | {|+type: 'empty'|};

export type AssetFileResolution = $ReadOnlyArray<string>;
export type FileResolution =
  | {|+type: 'sourceFile', +filePath: string|}
  | {|+type: 'assetFiles', +filePaths: AssetFileResolution|};

export type FileAndDirCandidates = {|
  +dir: FileCandidates,
  +file: FileCandidates,
|};

/**
 * This is a way to describe what files we tried to look for when resolving
 * a module name as file. This is mainly used for error reporting, so that
 * we can explain why we cannot resolve a module.
 */
export type FileCandidates =
  // We only tried to resolve a specific asset.
  | {|+type: 'asset', +name: string|}
  // We attempted to resolve a name as being a source file (ex. JavaScript,
  // JSON...), in which case there can be several extensions we tried, for
  // example `/js/foo.ios.js`, `/js/foo.js`, etc. for a single prefix '/js/foo'.
  | {|
      +type: 'sourceFile',
      filePathPrefix: string,
      +candidateExts: $ReadOnlyArray<string>,
    |};

/**
 * Check existence of a single file.
 */
export type DoesFileExist = (filePath: string) => boolean;
export type IsAssetFile = (fileName: string) => boolean;

/**
 * Given a directory path and the base asset name, return a list of all the
 * asset file names that match the given base name in that directory. Return
 * null if there's no such named asset. `platform` is used to identify
 * platform-specific assets, ex. `foo.ios.js` instead of a generic `foo.js`.
 */
export type ResolveAsset = (
  dirPath: string,
  assetName: string,
  platform: string | null,
) => ?$ReadOnlyArray<string>;

export type FileContext = {
  +doesFileExist: DoesFileExist,
  +isAssetFile: IsAssetFile,
  +preferNativePlatform: boolean,
  +redirectModulePath: (modulePath: string) => string | false,
  +resolveAsset: ResolveAsset,
  +sourceExts: $ReadOnlyArray<string>,
};

export type FileOrDirContext = FileContext & {
  /**
   * This should return the path of the "main" module of the specified
   * `package.json` file, after post-processing: for example, applying the
   * 'browser' field if necessary.
   *
   * FIXME: move the post-processing here. Right now it is
   * located in `node-haste/Package.js`, and fully duplicated in
   * `ModuleGraph/node-haste/Package.js` (!)
   */
  +getPackageMainPath: (packageJsonPath: string) => string,
};

export type HasteContext = FileOrDirContext & {
  /**
   * Given a name, this should return the full path to the file that provides
   * a Haste module of that name. Ex. for `Foo` it may return `/smth/Foo.js`.
   */
  +resolveHasteModule: (name: string) => ?string,
  /**
   * Given a name, this should return the full path to the package manifest that
   * provides a Haste package of that name. Ex. for `Foo` it may return
   * `/smth/Foo/package.json`.
   */
  +resolveHastePackage: (name: string) => ?string,
};

export type ModulePathContext = FileOrDirContext & {
  /**
   * Full path of the module that is requiring or importing the module to be
   * resolved.
   */
  +originModulePath: string,
};

export type ResolutionContext = ModulePathContext &
  HasteContext & {
    allowHaste: boolean,
    extraNodeModules: ?{[string]: string},
    originModulePath: string,
    resolveRequest?: ?CustomResolver,
  };

export type CustomResolver = (
  ResolutionContext,
  string,
  string | null,
) => Resolution;
