"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;
exports.getDefaultConfig = void 0;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _metro() {
  const data = require("metro");

  _metro = function () {
    return data;
  };

  return data;
}

function _metroConfig() {
  const data = require("metro-config");

  _metroConfig = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function () {
    return data;
  };

  return data;
}

var _findSymlinkedModules = _interopRequireDefault(require("./findSymlinkedModules"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function resolveSymlinksForRoots(roots) {
  return roots.reduce((arr, rootPath) => arr.concat((0, _findSymlinkedModules.default)(rootPath, roots)), [...roots]);
}

function getWatchFolders() {
  const root = process.env.REACT_NATIVE_APP_ROOT;
  return root ? resolveSymlinksForRoots([_path().default.resolve(root)]) : [];
}

const getBlacklistRE = () => (0, _metro().createBlacklist)([/.*\/__fixtures__\/.*/]);

const INTERNAL_CALLSITES_REGEX = new RegExp(['/Libraries/Renderer/implementations/.+\\.js$', '/Libraries/BatchedBridge/MessageQueue\\.js$', '/Libraries/YellowBox/.+\\.js$', '/Libraries/LogBox/.+\\.js$', '/Libraries/Core/Timers/.+\\.js$', '/node_modules/react-devtools-core/.+\\.js$', '/node_modules/react-refresh/.+\\.js$', '/node_modules/scheduler/.+\\.js$'].join('|'));

/**
 * Default configuration
 *
 * @todo(grabbou): As a separate PR, haste.platforms should be added before "native".
 * Otherwise, a.native.js will not load on Windows or other platforms
 */
const getDefaultConfig = ctx => {
  const hasteImplPath = _path().default.join(ctx.reactNativePath, 'jest/hasteImpl.js');

  return {
    resolver: {
      resolverMainFields: ['react-native', 'browser', 'main'],
      blacklistRE: getBlacklistRE(),
      platforms: [...ctx.haste.platforms, 'native'],
      providesModuleNodeModules: ctx.haste.providesModuleNodeModules,
      hasteImplModulePath: (0, _fs().existsSync)(hasteImplPath) ? hasteImplPath : undefined
    },
    serializer: {
      getModulesRunBeforeMainModule: () => [require.resolve(_path().default.join(ctx.reactNativePath, 'Libraries/Core/InitializeCore'))],
      getPolyfills: () => require(_path().default.join(ctx.reactNativePath, 'rn-get-polyfills'))()
    },
    server: {
      port: Number(process.env.RCT_METRO_PORT) || 8081
    },
    symbolicator: {
      customizeFrame: frame => {
        const collapse = Boolean(frame.file && INTERNAL_CALLSITES_REGEX.test(frame.file));
        return {
          collapse
        };
      }
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
      assetRegistryPath: _path().default.join(ctx.reactNativePath, 'Libraries/Image/AssetRegistry')
    },
    watchFolders: getWatchFolders()
  };
};

exports.getDefaultConfig = getDefaultConfig;

/**
 * Loads Metro Config and applies `options` on top of the resolved config.
 *
 * This allows the CLI to always overwrite the file settings.
 */
function load(ctx, options) {
  const defaultConfig = getDefaultConfig(ctx);

  if (options && options.reporter) {
    defaultConfig.reporter = options.reporter;
  }

  return (0, _metroConfig().loadConfig)(_objectSpread({
    cwd: ctx.root
  }, options), defaultConfig);
}