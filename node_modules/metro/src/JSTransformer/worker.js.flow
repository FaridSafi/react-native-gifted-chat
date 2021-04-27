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

const JsFileWrapping = require('../ModuleGraph/worker/JsFileWrapping');

const assetTransformer = require('../assetTransformer');
const babylon = require('@babel/parser');
const collectDependencies = require('../ModuleGraph/worker/collectDependencies');
const constantFoldingPlugin = require('./worker/constant-folding-plugin');
const generateImportNames = require('../ModuleGraph/worker/generateImportNames');
const generate = require('@babel/generator').default;
const getKeyFromFiles = require('../lib/getKeyFromFiles');
const getMinifier = require('../lib/getMinifier');
const importExportPlugin = require('./worker/import-export-plugin');
const inlinePlugin = require('./worker/inline-plugin');
const inlineRequiresPlugin = require('babel-preset-fbjs/plugins/inline-requires');
const normalizePseudoglobals = require('./worker/normalizePseudoglobals');
const {transformFromAstSync} = require('@babel/core');
const {stableHash} = require('metro-cache');
const types = require('@babel/types');
const countLines = require('../lib/countLines');

const {
  fromRawMappings,
  toBabelSegments,
  toSegmentTuple,
} = require('metro-source-map');
import type {TransformResultDependency} from 'metro/src/DeltaBundler';
import type {DynamicRequiresBehavior} from '../ModuleGraph/worker/collectDependencies';
import type {
  BasicSourceMap,
  FBSourceFunctionMap,
  MetroSourceMapSegmentTuple,
} from 'metro-source-map';

type MinifierConfig = $ReadOnly<{[string]: mixed}>;

export type MinifierOptions = {
  code: string,
  map: ?BasicSourceMap,
  filename: string,
  reserved: $ReadOnlyArray<string>,
  config: MinifierConfig,
};

export type Type = 'script' | 'module' | 'asset';

export type JsTransformerConfig = $ReadOnly<{|
  assetPlugins: $ReadOnlyArray<string>,
  assetRegistryPath: string,
  asyncRequireModulePath: string,
  babelTransformerPath: string,
  dynamicDepsInPackages: DynamicRequiresBehavior,
  enableBabelRCLookup: boolean,
  enableBabelRuntime: boolean,
  experimentalImportBundleSupport: boolean,
  minifierConfig: MinifierConfig,
  minifierPath: string,
  optimizationSizeLimit: number,
  publicPath: string,
|}>;

import type {CustomTransformOptions} from 'metro-babel-transformer';
export type {CustomTransformOptions} from 'metro-babel-transformer';

export type JsTransformOptions = $ReadOnly<{|
  customTransformOptions?: CustomTransformOptions,
  dev: boolean,
  disableFlowStripTypesTransform?: boolean,
  experimentalImportSupport?: boolean,
  hot: boolean,
  inlinePlatform: boolean,
  inlineRequires: boolean,
  minify: boolean,
  unstable_disableES6Transforms?: boolean,
  platform: ?string,
  type: Type,
|}>;

export type JsOutput = $ReadOnly<{|
  data: $ReadOnly<{|
    code: string,
    lineCount: number,
    map: Array<MetroSourceMapSegmentTuple>,
    functionMap: ?FBSourceFunctionMap,
  |}>,
  type: string,
|}>;

type Result = {|
  output: $ReadOnlyArray<JsOutput>,
  dependencies: $ReadOnlyArray<TransformResultDependency>,
|};

function getDynamicDepsBehavior(
  inPackages: DynamicRequiresBehavior,
  filename: string,
): DynamicRequiresBehavior {
  switch (inPackages) {
    case 'reject':
      return 'reject';
    case 'throwAtRuntime':
      const isPackage = /(?:^|[/\\])node_modules[/\\]/.test(filename);
      return isPackage ? inPackages : 'reject';
    default:
      (inPackages: empty);
      throw new Error(
        `invalid value for dynamic deps behavior: \`${inPackages}\``,
      );
  }
}

class JsTransformer {
  _config: JsTransformerConfig;
  _projectRoot: string;

  constructor(projectRoot: string, config: JsTransformerConfig) {
    this._projectRoot = projectRoot;
    this._config = config;
  }

  async transform(
    filename: string,
    data: Buffer,
    options: JsTransformOptions,
  ): Promise<Result> {
    const sourceCode = data.toString('utf8');
    let type = 'js/module';

    if (options.type === 'asset') {
      type = 'js/module/asset';
    }
    if (options.type === 'script') {
      type = 'js/script';
    }

    if (filename.endsWith('.json')) {
      let code = JsFileWrapping.wrapJson(sourceCode);
      let map = [];

      if (options.minify) {
        ({map, code} = await this._minifyCode(filename, code, sourceCode, map));
      }

      return {
        dependencies: [],
        output: [
          {
            data: {code, lineCount: countLines(code), map, functionMap: null},
            type,
          },
        ],
      };
    }

    // $FlowFixMe TODO t26372934 Plugin system
    const transformer: Transformer<*> = require(this._config
      .babelTransformerPath);

    const transformerArgs = {
      filename,
      options: {
        ...options,
        enableBabelRCLookup: this._config.enableBabelRCLookup,
        enableBabelRuntime: this._config.enableBabelRuntime,
        // Inline requires are now performed at a secondary step. We cannot
        // unfortunately remove it from the internal transformer, since this one
        // is used by other tooling, and this would affect it.
        inlineRequires: false,
        projectRoot: this._projectRoot,
        publicPath: this._config.publicPath,
      },
      plugins: [],
      src: sourceCode,
    };

    const transformResult =
      type === 'js/module/asset'
        ? {
            ...(await assetTransformer.transform(
              transformerArgs,
              this._config.assetRegistryPath,
              this._config.assetPlugins,
            )),
            functionMap: null,
          }
        : await transformer.transform(transformerArgs);

    // Transformers can ouptut null ASTs (if they ignore the file). In that case
    // we need to parse the module source code to get their AST.
    let ast =
      transformResult.ast ||
      babylon.parse(sourceCode, {sourceType: 'unambiguous'});

    const {importDefault, importAll} = generateImportNames(ast);

    // Add "use strict" if the file was parsed as a module, and the directive did
    // not exist yet.
    const {directives} = ast.program;

    if (
      ast.program.sourceType === 'module' &&
      directives.findIndex(d => d.value.value === 'use strict') === -1
    ) {
      directives.push(types.directive(types.directiveLiteral('use strict')));
    }

    // Perform the import-export transform (in case it's still needed), then
    // fold requires and perform constant folding (if in dev).
    const plugins = [];
    const opts = {
      ...options,
      inlineableCalls: [importDefault, importAll],
      importDefault,
      importAll,
    };

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

    ({ast} = transformFromAstSync(ast, '', {
      ast: true,
      babelrc: false,
      code: false,
      configFile: false,
      comments: false,
      compact: false,
      filename,
      plugins,
      sourceMaps: false,
    }));

    let dependencyMapName = '';
    let dependencies;
    let wrappedAst;

    // If the module to transform is a script (meaning that is not part of the
    // dependency graph and it code will just be prepended to the bundle modules),
    // we need to wrap it differently than a commonJS module (also, scripts do
    // not have dependencies).
    if (type === 'js/script') {
      dependencies = [];
      wrappedAst = JsFileWrapping.wrapPolyfill(ast);
    } else {
      try {
        const opts = {
          asyncRequireModulePath: this._config.asyncRequireModulePath,
          dynamicRequires: getDynamicDepsBehavior(
            this._config.dynamicDepsInPackages,
            filename,
          ),
          inlineableCalls: [importDefault, importAll],
          keepRequireNames: options.dev,
        };
        ({ast, dependencies, dependencyMapName} = collectDependencies(
          ast,
          opts,
        ));
      } catch (error) {
        if (error instanceof collectDependencies.InvalidRequireCallError) {
          throw new InvalidRequireCallError(error, filename);
        }
        throw error;
      }

      ({ast: wrappedAst} = JsFileWrapping.wrapModule(
        ast,
        importDefault,
        importAll,
        dependencyMapName,
      ));
    }

    const reserved =
      options.minify && data.length <= this._config.optimizationSizeLimit
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
        sourceMaps: true,
      },
      sourceCode,
    );

    let map = result.rawMappings ? result.rawMappings.map(toSegmentTuple) : [];
    let code = result.code;

    if (options.minify) {
      ({map, code} = await this._minifyCode(
        filename,
        result.code,
        sourceCode,
        map,
        reserved,
      ));
    }

    const {functionMap} = transformResult;

    return {
      dependencies,
      output: [
        {data: {code, lineCount: countLines(code), map, functionMap}, type},
      ],
    };
  }

  async _minifyCode(
    filename: string,
    code: string,
    source: string,
    map: Array<MetroSourceMapSegmentTuple>,
    reserved?: $ReadOnlyArray<string> = [],
  ): Promise<{code: string, map: Array<MetroSourceMapSegmentTuple>}> {
    const sourceMap = fromRawMappings([
      {code, source, map, functionMap: null, path: filename},
    ]).toMap(undefined, {});

    const minify = getMinifier(this._config.minifierPath);

    try {
      const minified = minify({
        code,
        map: sourceMap,
        filename,
        reserved,
        config: this._config.minifierConfig,
      });

      return {
        code: minified.code,
        map: minified.map
          ? toBabelSegments(minified.map).map(toSegmentTuple)
          : [],
      };
    } catch (error) {
      if (error.constructor.name === 'JS_Parse_Error') {
        throw new Error(
          `${error.message} in file ${filename} at ${error.line}:${error.col}`,
        );
      }

      throw error;
    }
  }

  getCacheKey(): string {
    const {babelTransformerPath, minifierPath, ...config} = this._config;

    const filesKey = getKeyFromFiles([
      require.resolve(babelTransformerPath),
      require.resolve(minifierPath),
      require.resolve('../ModuleGraph/worker/JsFileWrapping'),
      require.resolve('../assetTransformer'),
      require.resolve('../ModuleGraph/worker/collectDependencies'),
      require.resolve('./worker/constant-folding-plugin'),
      require.resolve('../lib/getMinifier'),
      require.resolve('./worker/inline-plugin'),
      require.resolve('./worker/import-export-plugin'),
      require.resolve('./worker/normalizePseudoglobals'),
      require.resolve('../ModuleGraph/worker/optimizeDependencies'),
      require.resolve('../ModuleGraph/worker/generateImportNames'),
    ]);

    const babelTransformer = require(babelTransformerPath);
    const babelTransformerKey = babelTransformer.getCacheKey
      ? babelTransformer.getCacheKey()
      : '';

    return [
      filesKey,
      stableHash(config).toString('hex'),
      babelTransformerKey,
    ].join('$');
  }
}

class InvalidRequireCallError extends Error {
  innerError: collectDependencies.InvalidRequireCallError;
  filename: string;

  constructor(
    innerError: collectDependencies.InvalidRequireCallError,
    filename: string,
  ) {
    super(`${filename}:${innerError.message}`);
    this.innerError = innerError;
    this.filename = filename;
  }
}

module.exports = JsTransformer;
