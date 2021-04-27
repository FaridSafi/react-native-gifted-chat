"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _Server() {
  const data = _interopRequireDefault(require("metro/src/Server"));

  _Server = function () {
    return data;
  };

  return data;
}

function _bundle() {
  const data = _interopRequireDefault(require("metro/src/shared/output/bundle"));

  _bundle = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

var _saveAssets = _interopRequireDefault(require("./saveAssets"));

var _loadMetroConfig = _interopRequireDefault(require("../../tools/loadMetroConfig"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function buildBundle(args, ctx, output = _bundle().default) {
  const config = await (0, _loadMetroConfig.default)(ctx, {
    maxWorkers: args.maxWorkers,
    resetCache: args.resetCache,
    config: args.config
  });

  if (config.resolver.platforms.indexOf(args.platform) === -1) {
    _cliTools().logger.error(`Invalid platform ${args.platform ? `"${_chalk().default.bold(args.platform)}" ` : ''}selected.`);

    _cliTools().logger.info(`Available platforms are: ${config.resolver.platforms.map(x => `"${_chalk().default.bold(x)}"`).join(', ')}. If you are trying to bundle for an out-of-tree platform, it may not be installed.`);

    throw new Error('Bundling failed');
  } // This is used by a bazillion of npm modules we don't control so we don't
  // have other choice than defining it as an env variable here.


  process.env.NODE_ENV = args.dev ? 'development' : 'production';
  let sourceMapUrl = args.sourcemapOutput;

  if (sourceMapUrl && !args.sourcemapUseAbsolutePath) {
    sourceMapUrl = _path().default.basename(sourceMapUrl);
  }

  const requestOpts = {
    entryFile: args.entryFile,
    sourceMapUrl,
    dev: args.dev,
    minify: args.minify !== undefined ? args.minify : !args.dev,
    platform: args.platform
  };
  const server = new (_Server().default)(config);

  try {
    const bundle = await output.build(server, requestOpts);
    await output.save(bundle, args, _cliTools().logger.info); // Save the assets of the bundle

    const outputAssets = await server.getAssets(_objectSpread({}, _Server().default.DEFAULT_BUNDLE_OPTIONS, requestOpts, {
      bundleType: 'todo'
    })); // When we're done saving bundle output and the assets, we're done.

    return await (0, _saveAssets.default)(outputAssets, args.platform, args.assetsDest);
  } finally {
    server.end();
  }
}

var _default = buildBundle;
exports.default = _default;