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

const cosmiconfig = require("cosmiconfig");

const getDefaultConfig = require("./defaults");

const validConfig = require("./defaults/validConfig");

const _require = require("jest-validate"),
  validate = _require.validate;

const _require2 = require("path"),
  dirname = _require2.dirname,
  resolve = _require2.resolve,
  join = _require2.join;

/**
 * Takes the last argument if multiple of the same argument are given
 */
function overrideArgument(arg) {
  if (arg == null) {
    return arg;
  }

  if (Array.isArray(arg)) {
    return arg[arg.length - 1];
  }

  return arg;
}

const explorer = cosmiconfig("metro", {
  searchPlaces: [
    "metro.config.js",
    "metro.config.json",
    "package.json",
    "rn-cli.config.js"
  ],
  loaders: {
    ".json": cosmiconfig.loadJson,
    ".yaml": cosmiconfig.loadYaml,
    ".yml": cosmiconfig.loadYaml,
    ".js": cosmiconfig.loadJs,
    ".es6": cosmiconfig.loadJs,
    noExt: cosmiconfig.loadYaml
  }
});

function resolveConfig(_x, _x2) {
  return _resolveConfig.apply(this, arguments);
}

function _resolveConfig() {
  _resolveConfig = _asyncToGenerator(function*(path, cwd) {
    if (path) {
      return explorer.load(path);
    }

    const result = yield explorer.search(cwd);

    if (result == null) {
      // No config file found, return a default
      return {
        isEmpty: true,
        filepath: join(cwd || process.cwd(), "metro.config.stub.js"),
        config: {}
      };
    }

    return result;
  });
  return _resolveConfig.apply(this, arguments);
}

function mergeConfig(defaultConfig) {
  for (
    var _len = arguments.length,
      configs = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    configs[_key - 1] = arguments[_key];
  }

  // If the file is a plain object we merge the file with the default config,
  // for the function we don't do this since that's the responsibility of the user

  /* $FlowFixMe(>=0.98.0 site=react_native_fb) This comment suppresses an error
   * found when Flow v0.98 was deployed. To see the error delete this comment
   * and run Flow. */
  return configs.reduce(
    (totalConfig, nextConfig) =>
      _objectSpread({}, totalConfig, nextConfig, {
        resolver: _objectSpread(
          {},
          totalConfig.resolver,
          nextConfig.resolver || {}
        ),
        serializer: _objectSpread(
          {},
          totalConfig.serializer,
          nextConfig.serializer || {}
        ),
        transformer: _objectSpread(
          {},
          totalConfig.transformer,
          nextConfig.transformer || {}
        ),
        server: _objectSpread({}, totalConfig.server, nextConfig.server || {}),
        symbolicator: _objectSpread(
          {},
          totalConfig.symbolicator,
          nextConfig.symbolicator || {}
        )
      }),
    defaultConfig
  );
}

function loadMetroConfigFromDisk(_x3, _x4, _x5) {
  return _loadMetroConfigFromDisk.apply(this, arguments);
}

function _loadMetroConfigFromDisk() {
  _loadMetroConfigFromDisk = _asyncToGenerator(function*(
    path,
    cwd,
    defaultConfigOverrides
  ) {
    const resolvedConfigResults = yield resolveConfig(path, cwd);
    const configModule = resolvedConfigResults.config,
      filepath = resolvedConfigResults.filepath;
    const rootPath = dirname(filepath);
    const defaultConfig = yield getDefaultConfig(rootPath);

    if (typeof configModule === "function") {
      // Get a default configuration based on what we know, which we in turn can pass
      // to the function.
      const resultedConfig = yield configModule(defaultConfig);
      return resultedConfig;
    }

    return mergeConfig(defaultConfig, defaultConfigOverrides, configModule);
  });
  return _loadMetroConfigFromDisk.apply(this, arguments);
}

function overrideConfigWithArguments(config, argv) {
  // We override some config arguments here with the argv
  const output = {
    resolver: {},
    serializer: {},
    server: {},
    transformer: {}
  };

  if (argv.port != null) {
    output.server.port = Number(argv.port);
  }

  if (argv.runInspectorProxy != null) {
    output.server.runInspectorProxy = Boolean(argv.runInspectorProxy);
  }

  if (argv.projectRoot != null) {
    output.projectRoot = argv.projectRoot;
  }

  if (argv.watchFolders != null) {
    output.watchFolders = argv.watchFolders;
  }

  if (argv.assetExts != null) {
    output.resolver.assetExts = argv.assetExts;
  }

  if (argv.sourceExts != null) {
    output.resolver.sourceExts = argv.sourceExts;
  }

  if (argv.platforms != null) {
    output.resolver.platforms = argv.platforms;
  }

  if (argv["max-workers"] != null || argv.maxWorkers != null) {
    output.maxWorkers = Number(argv["max-workers"] || argv.maxWorkers);
  }

  if (argv.transformer != null) {
    output.transformer.babelTransformerPath = resolve(argv.transformer);
  }

  if (argv["reset-cache"] != null) {
    output.resetCache = argv["reset-cache"];
  }

  if (argv.resetCache != null) {
    output.resetCache = argv.resetCache;
  }

  if (argv.verbose === false) {
    output.reporter = {
      update: () => {}
    }; // TODO: Ask if this is the way to go
  }

  return mergeConfig(config, output);
}
/**
 * Load the metro configuration from disk
 * @param  {object} argv                    Arguments coming from the CLI, can be empty
 * @param  {object} defaultConfigOverrides  A configuration that can override the default config
 * @return {object}                         Configuration returned
 */

function loadConfig() {
  return _loadConfig.apply(this, arguments);
}

function _loadConfig() {
  _loadConfig = _asyncToGenerator(function*() {
    let argv =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let defaultConfigOverrides =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    argv.config = overrideArgument(argv.config);
    const configuration = yield loadMetroConfigFromDisk(
      argv.config,
      argv.cwd,
      defaultConfigOverrides
    );
    validate(configuration, {
      exampleConfig: yield validConfig(),
      recursiveBlacklist: ["reporter", "resolver", "transformer"]
    }); // Override the configuration with cli parameters

    const configWithArgs = overrideConfigWithArguments(configuration, argv);
    const overriddenConfig = {}; // The resolver breaks if "json" is missing from `resolver.sourceExts`

    const sourceExts = configWithArgs.resolver.sourceExts;

    if (!configWithArgs.resolver.sourceExts.includes("json")) {
      overriddenConfig.resolver = {
        sourceExts: _toConsumableArray(sourceExts).concat(["json"])
      };
    }

    overriddenConfig.watchFolders = [configWithArgs.projectRoot].concat(
      _toConsumableArray(configWithArgs.watchFolders)
    ); // Set the watchfolders to include the projectRoot, as Metro assumes that is
    // the case

    return mergeConfig(configWithArgs, overriddenConfig);
  });
  return _loadConfig.apply(this, arguments);
}

module.exports = {
  loadConfig,
  resolveConfig,
  mergeConfig
};
