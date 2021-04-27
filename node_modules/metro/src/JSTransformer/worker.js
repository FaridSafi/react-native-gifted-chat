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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const JsFileWrapping = require("../ModuleGraph/worker/JsFileWrapping");

const assetTransformer = require("../assetTransformer");

const babylon = require("@babel/parser");

const collectDependencies = require("../ModuleGraph/worker/collectDependencies");

const constantFoldingPlugin = require("./worker/constant-folding-plugin");

const generateImportNames = require("../ModuleGraph/worker/generateImportNames");

const generate = require("@babel/generator").default;

const getKeyFromFiles = require("../lib/getKeyFromFiles");

const getMinifier = require("../lib/getMinifier");

const importExportPlugin = require("./worker/import-export-plugin");

const inlinePlugin = require("./worker/inline-plugin");

const inlineRequiresPlugin = require("babel-preset-fbjs/plugins/inline-requires");

const normalizePseudoglobals = require("./worker/normalizePseudoglobals");

const _require = require("@babel/core"),
  transformFromAstSync = _require.transformFromAstSync;

const _require2 = require("metro-cache"),
  stableHash = _require2.stableHash;

const types = require("@babel/types");

const countLines = require("../lib/countLines");

const _require3 = require("metro-source-map"),
  fromRawMappings = _require3.fromRawMappings,
  toBabelSegments = _require3.toBabelSegments,
  toSegmentTuple = _require3.toSegmentTuple;

function getDynamicDepsBehavior(inPackages, filename) {
  switch (inPackages) {
    case "reject":
      return "reject";

    case "throwAtRuntime":
      const isPackage = /(?:^|[/\\])node_modules[/\\]/.test(filename);
      return isPackage ? inPackages : "reject";

    default:
      inPackages;
      throw new Error(
        `invalid value for dynamic deps behavior: \`${inPackages}\``
      );
  }
}

class JsTransformer {
  constructor(projectRoot, config) {
    this._projectRoot = projectRoot;
    this._config = config;
  }

  transform(filename, data, options) {
    var _this = this;

    return _asyncToGenerator(function*() {
      const sourceCode = data.toString("utf8");
      let type = "js/module";

      if (options.type === "asset") {
        type = "js/module/asset";
      }

      if (options.type === "script") {
        type = "js/script";
      }

      if (filename.endsWith(".json")) {
        let code = JsFileWrapping.wrapJson(sourceCode);
        let map = [];

        if (options.minify) {
          var _ref = yield _this._minifyCode(filename, code, sourceCode, map);

          map = _ref.map;
          code = _ref.code;
        }

        return {
          dependencies: [],
          output: [
            {
              data: {
                code,
                lineCount: countLines(code),
                map,
                functionMap: null
              },
              type
            }
          ]
        };
      } // $FlowFixMe TODO t26372934 Plugin system

      const transformer = require(_this._config.babelTransformerPath);

      const transformerArgs = {
        filename,
        options: _objectSpread({}, options, {
          enableBabelRCLookup: _this._config.enableBabelRCLookup,
          enableBabelRuntime: _this._config.enableBabelRuntime,
          // Inline requires are now performed at a secondary step. We cannot
          // unfortunately remove it from the internal transformer, since this one
          // is used by other tooling, and this would affect it.
          inlineRequires: false,
          projectRoot: _this._projectRoot,
          publicPath: _this._config.publicPath
        }),
        plugins: [],
        src: sourceCode
      };
      const transformResult =
        type === "js/module/asset"
          ? _objectSpread(
              {},
              yield assetTransformer.transform(
                transformerArgs,
                _this._config.assetRegistryPath,
                _this._config.assetPlugins
              ),
              {
                functionMap: null
              }
            )
          : yield transformer.transform(transformerArgs); // Transformers can ouptut null ASTs (if they ignore the file). In that case
      // we need to parse the module source code to get their AST.

      let ast =
        transformResult.ast ||
        babylon.parse(sourceCode, {
          sourceType: "unambiguous"
        });

      const _generateImportNames = generateImportNames(ast),
        importDefault = _generateImportNames.importDefault,
        importAll = _generateImportNames.importAll; // Add "use strict" if the file was parsed as a module, and the directive did
      // not exist yet.

      const directives = ast.program.directives;

      if (
        ast.program.sourceType === "module" &&
        directives.findIndex(d => d.value.value === "use strict") === -1
      ) {
        directives.push(types.directive(types.directiveLiteral("use strict")));
      } // Perform the import-export transform (in case it's still needed), then
      // fold requires and perform constant folding (if in dev).

      const plugins = [];

      const opts = _objectSpread({}, options, {
        inlineableCalls: [importDefault, importAll],
        importDefault,
        importAll
      });

      if (options.experimentalImportSupport) {
        plugins.push([importExportPlugin, opts]);
      }

      if (options.inlineRequires) {
        plugins.push([inlineRequiresPlugin, opts]);
      }

      if (!options.dev) {
        plugins.push([constantFoldingPlugin, opts]);
      }

      plugins.push([inlinePlugin, opts]);

      var _transformFromAstSync = transformFromAstSync(ast, "", {
        ast: true,
        babelrc: false,
        code: false,
        configFile: false,
        comments: false,
        compact: false,
        filename,
        plugins,
        sourceMaps: false
      });

      ast = _transformFromAstSync.ast;
      let dependencyMapName = "";
      let dependencies;
      let wrappedAst; // If the module to transform is a script (meaning that is not part of the
      // dependency graph and it code will just be prepended to the bundle modules),
      // we need to wrap it differently than a commonJS module (also, scripts do
      // not have dependencies).

      if (type === "js/script") {
        dependencies = [];
        wrappedAst = JsFileWrapping.wrapPolyfill(ast);
      } else {
        try {
          const opts = {
            asyncRequireModulePath: _this._config.asyncRequireModulePath,
            dynamicRequires: getDynamicDepsBehavior(
              _this._config.dynamicDepsInPackages,
              filename
            ),
            inlineableCalls: [importDefault, importAll],
            keepRequireNames: options.dev
          };

          var _collectDependencies = collectDependencies(ast, opts);

          ast = _collectDependencies.ast;
          dependencies = _collectDependencies.dependencies;
          dependencyMapName = _collectDependencies.dependencyMapName;
        } catch (error) {
          if (error instanceof collectDependencies.InvalidRequireCallError) {
            throw new InvalidRequireCallError(error, filename);
          }

          throw error;
        }

        var _JsFileWrapping$wrapM = JsFileWrapping.wrapModule(
          ast,
          importDefault,
          importAll,
          dependencyMapName
        );

        wrappedAst = _JsFileWrapping$wrapM.ast;
      }

      const reserved =
        options.minify && data.length <= _this._config.optimizationSizeLimit
          ? normalizePseudoglobals(wrappedAst)
          : [];
      const result = generate(
        wrappedAst,
        {
          comments: false,
          compact: false,
          filename,
          retainLines: false,
          sourceFileName: filename,
          sourceMaps: true
        },
        sourceCode
      );
      let map = result.rawMappings
        ? result.rawMappings.map(toSegmentTuple)
        : [];
      let code = result.code;

      if (options.minify) {
        var _ref2 = yield _this._minifyCode(
          filename,
          result.code,
          sourceCode,
          map,
          reserved
        );

        map = _ref2.map;
        code = _ref2.code;
      }

      const functionMap = transformResult.functionMap;
      return {
        dependencies,
        output: [
          {
            data: {
              code,
              lineCount: countLines(code),
              map,
              functionMap
            },
            type
          }
        ]
      };
    })();
  }

  _minifyCode(filename, code, source, map) {
    var _this2 = this;

    let reserved =
      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    return _asyncToGenerator(function*() {
      const sourceMap = fromRawMappings([
        {
          code,
          source,
          map,
          functionMap: null,
          path: filename
        }
      ]).toMap(undefined, {});
      const minify = getMinifier(_this2._config.minifierPath);

      try {
        const minified = minify({
          code,
          map: sourceMap,
          filename,
          reserved,
          config: _this2._config.minifierConfig
        });
        return {
          code: minified.code,
          map: minified.map
            ? toBabelSegments(minified.map).map(toSegmentTuple)
            : []
        };
      } catch (error) {
        if (error.constructor.name === "JS_Parse_Error") {
          throw new Error(
            `${error.message} in file ${filename} at ${error.line}:${error.col}`
          );
        }

        throw error;
      }
    })();
  }

  getCacheKey() {
    const _this$_config = this._config,
      babelTransformerPath = _this$_config.babelTransformerPath,
      minifierPath = _this$_config.minifierPath,
      config = _objectWithoutProperties(_this$_config, [
        "babelTransformerPath",
        "minifierPath"
      ]);

    const filesKey = getKeyFromFiles([
      require.resolve(babelTransformerPath),
      require.resolve(minifierPath),
      require.resolve("../ModuleGraph/worker/JsFileWrapping"),
      require.resolve("../assetTransformer"),
      require.resolve("../ModuleGraph/worker/collectDependencies"),
      require.resolve("./worker/constant-folding-plugin"),
      require.resolve("../lib/getMinifier"),
      require.resolve("./worker/inline-plugin"),
      require.resolve("./worker/import-export-plugin"),
      require.resolve("./worker/normalizePseudoglobals"),
      require.resolve("../ModuleGraph/worker/optimizeDependencies"),
      require.resolve("../ModuleGraph/worker/generateImportNames")
    ]);

    const babelTransformer = require(babelTransformerPath);

    const babelTransformerKey = babelTransformer.getCacheKey
      ? babelTransformer.getCacheKey()
      : "";
    return [
      filesKey,
      stableHash(config).toString("hex"),
      babelTransformerKey
    ].join("$");
  }
}

class InvalidRequireCallError extends Error {
  constructor(innerError, filename) {
    super(`${filename}:${innerError.message}`);
    this.innerError = innerError;
    this.filename = filename;
  }
}

module.exports = JsTransformer;
