/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const Resolver = require("metro-resolver");

const invariant = require("invariant");

const path = require("path");

const util = require("util");

class ModuleResolver {
  constructor(options) {
    _defineProperty(this, "_getPackageMainPath", packageJsonPath => {
      const package_ = this._options.moduleCache.getPackage(packageJsonPath);

      return package_.getMain(this._options.mainFields);
    });

    this._options = options;
  }

  _redirectRequire(fromModule, modulePath) {
    const moduleCache = this._options.moduleCache;

    try {
      if (modulePath.startsWith(".")) {
        const fromPackage = fromModule.getPackage();

        if (fromPackage) {
          // We need to convert the module path from module-relative to
          // package-relative, so that we can easily match it against the
          // "browser" map (where all paths are relative to the package root)
          const fromPackagePath =
            "./" +
            path.relative(
              path.dirname(fromPackage.path),
              path.resolve(path.dirname(fromModule.path), modulePath)
            );
          let redirectedPath = fromPackage.redirectRequire(
            fromPackagePath,
            this._options.mainFields
          ); // Since the redirected path is still relative to the package root,
          // we have to transform it back to be module-relative (as it
          // originally was)

          if (redirectedPath !== false) {
            redirectedPath =
              "./" +
              path.relative(
                path.dirname(fromModule.path),
                path.resolve(path.dirname(fromPackage.path), redirectedPath)
              );
          }

          return redirectedPath;
        }
      } else {
        const pck = path.isAbsolute(modulePath)
          ? moduleCache.getModule(modulePath).getPackage()
          : fromModule.getPackage();

        if (pck) {
          return pck.redirectRequire(modulePath, this._options.mainFields);
        }
      }
    } catch (err) {
      // Do nothing. The standard module cache does not trigger any error, but
      // the ModuleGraph one does, if the module does not exist.
    }

    return modulePath;
  }

  resolveDependency(fromModule, moduleName, allowHaste, platform) {
    try {
      const result = Resolver.resolve(
        _objectSpread({}, this._options, {
          originModulePath: fromModule.path,
          redirectModulePath: modulePath =>
            this._redirectRequire(fromModule, modulePath),
          allowHaste,
          platform,
          resolveHasteModule: name =>
            this._options.moduleMap.getModule(name, platform, true),
          resolveHastePackage: name =>
            this._options.moduleMap.getPackage(name, platform, true),
          getPackageMainPath: this._getPackageMainPath
        }),
        moduleName,
        platform
      );
      return this._getFileResolvedModule(result);
    } catch (error) {
      if (error instanceof Resolver.FailedToResolvePathError) {
        const candidates = error.candidates;
        throw new UnableToResolveError(
          path.relative(this._options.projectRoot, fromModule.path),
          moduleName,
          [
            "\n\nNone of these files exist:",
            `  * ${Resolver.formatFileCandidates(
              this._removeRoot(candidates.file)
            )}`,
            `  * ${Resolver.formatFileCandidates(
              this._removeRoot(candidates.dir)
            )}`
          ].join("\n")
        );
      }

      if (error instanceof Resolver.FailedToResolveNameError) {
        const dirPaths = error.dirPaths,
          extraPaths = error.extraPaths;
        const displayDirPaths = dirPaths
          .filter(dirPath => this._options.dirExists(dirPath))
          .map(dirPath => path.relative(this._options.projectRoot, dirPath))
          .concat(extraPaths);
        const hint = displayDirPaths.length ? " or in these directories:" : "";
        throw new UnableToResolveError(
          path.relative(this._options.projectRoot, fromModule.path),
          moduleName,
          [`${moduleName} could not be found within the project${hint || "."}`]
            .concat(
              _toConsumableArray(
                displayDirPaths.map(dirPath => `  ${path.dirname(dirPath)}`)
              ),
              [
                "\nIf you are sure the module exists, try these steps:",
                " 1. Clear watchman watches: watchman watch-del-all",
                " 2. Delete node_modules: rm -rf node_modules and run yarn install",
                " 3. Reset Metro's cache: yarn start --reset-cache",
                " 4. Remove the cache: rm -rf /tmp/metro-*"
              ]
            )
            .join("\n")
        );
      }

      throw error;
    }
  }

  /**
   * FIXME: get rid of this function and of the reliance on `TModule`
   * altogether, return strongly typed resolutions at the top-level instead.
   */
  _getFileResolvedModule(resolution) {
    switch (resolution.type) {
      case "sourceFile":
        return this._options.moduleCache.getModule(resolution.filePath);

      case "assetFiles":
        // FIXME: we should forward ALL the paths/metadata,
        // not just an arbitrary item!
        const arbitrary = getArrayLowestItem(resolution.filePaths);
        invariant(arbitrary != null, "invalid asset resolution");
        return this._options.moduleCache.getModule(arbitrary);

      case "empty":
        const moduleCache = this._options.moduleCache;
        const module = moduleCache.getModule(ModuleResolver.EMPTY_MODULE);
        invariant(module != null, "empty module is not available");
        return module;

      default:
        resolution.type;
        throw new Error("invalid type");
    }
  }

  _removeRoot(candidates) {
    if (candidates.filePathPrefix) {
      candidates.filePathPrefix = path.relative(
        this._options.projectRoot,
        candidates.filePathPrefix
      );
    }

    return candidates;
  }
}

_defineProperty(
  ModuleResolver,
  "EMPTY_MODULE",
  require.resolve("./assets/empty-module.js")
);

function getArrayLowestItem(a) {
  if (a.length === 0) {
    return undefined;
  }

  let lowest = a[0];

  for (let i = 1; i < a.length; ++i) {
    if (a[i] < lowest) {
      lowest = a[i];
    }
  }

  return lowest;
}

class UnableToResolveError extends Error {
  /**
   * File path of the module that tried to require a module, ex. `/js/foo.js`.
   */

  /**
   * The name of the module that was required, no necessarily a path,
   * ex. `./bar`, or `invariant`.
   */
  constructor(originModulePath, targetModuleName, message) {
    super();
    this.originModulePath = originModulePath;
    this.targetModuleName = targetModuleName;
    this.message = util.format(
      "Unable to resolve module `%s` from `%s`: %s",
      targetModuleName,
      originModulePath,
      message
    );
  }
}

module.exports = {
  ModuleResolver,
  UnableToResolveError
};
