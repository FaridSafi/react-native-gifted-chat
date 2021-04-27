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

const IncrementalBundler = require("./IncrementalBundler");

const MetroHmrServer = require("./HmrServer");

const MetroServer = require("./Server");

const attachWebsocketServer = require("./lib/attachWebsocketServer");

const http = require("http");

const https = require("https");

const makeBuildCommand = require("./commands/build");

const makeDependenciesCommand = require("./commands/dependencies");

const makeServeCommand = require("./commands/serve");

const outputBundle = require("./shared/output/bundle");

const _require = require("fs-extra"),
  readFile = _require.readFile;

const _require2 = require("metro-config"),
  loadConfig = _require2.loadConfig,
  mergeConfig = _require2.mergeConfig,
  getDefaultConfig = _require2.getDefaultConfig;

const _require3 = require("metro-inspector-proxy"),
  InspectorProxy = _require3.InspectorProxy;

function getConfig(_x) {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = _asyncToGenerator(function*(config) {
    const defaultConfig = yield getDefaultConfig(config.projectRoot);
    return mergeConfig(defaultConfig, config);
  });
  return _getConfig.apply(this, arguments);
}

function runMetro(_x2) {
  return _runMetro.apply(this, arguments);
}

function _runMetro() {
  _runMetro = _asyncToGenerator(function*(config) {
    const mergedConfig = yield getConfig(config);
    mergedConfig.reporter.update({
      type: "initialize_started",
      port: mergedConfig.server.port,
      // FIXME: We need to change that to watchFolders. It will be a
      // breaking since it affects custom reporter API.
      projectRoots: mergedConfig.watchFolders
    });
    return new MetroServer(mergedConfig);
  });
  return _runMetro.apply(this, arguments);
}

exports.runMetro = runMetro;
exports.loadConfig = loadConfig;

exports.createConnectMiddleware =
  /*#__PURE__*/
  (function() {
    var _ref = _asyncToGenerator(function*(config) {
      const metroServer = yield runMetro(config);
      let enhancedMiddleware = metroServer.processRequest; // Enhance the resulting middleware using the config options

      if (config.server.enhanceMiddleware) {
        enhancedMiddleware = config.server.enhanceMiddleware(
          enhancedMiddleware,
          metroServer
        );
      }

      return {
        attachHmrServer(httpServer) {
          attachWebsocketServer({
            httpServer,
            path: "/hot",
            websocketServer: new MetroHmrServer(
              metroServer.getBundler(),
              metroServer.getCreateModuleId(),
              config
            )
          });
        },

        metroServer,
        middleware: enhancedMiddleware,

        end() {
          metroServer.end();
        }
      };
    });

    return function(_x3) {
      return _ref.apply(this, arguments);
    };
  })();

exports.runServer =
  /*#__PURE__*/
  (function() {
    var _ref2 = _asyncToGenerator(function*(config, _ref3) {
      let host = _ref3.host,
        onReady = _ref3.onReady,
        onError = _ref3.onError,
        _ref3$secure = _ref3.secure,
        secure = _ref3$secure === void 0 ? false : _ref3$secure,
        secureKey = _ref3.secureKey,
        secureCert = _ref3.secureCert,
        _ref3$hmrEnabled = _ref3.hmrEnabled,
        hmrEnabled = _ref3$hmrEnabled === void 0 ? false : _ref3$hmrEnabled;

      // Lazy require
      const connect = require("connect");

      const serverApp = connect();

      const _ref4 = yield exports.createConnectMiddleware(config),
        attachHmrServer = _ref4.attachHmrServer,
        middleware = _ref4.middleware,
        metroServer = _ref4.metroServer,
        end = _ref4.end;

      serverApp.use(middleware);

      if (config.server.enableVisualizer) {
        let initializeVisualizerMiddleware;

        try {
          // eslint-disable-next-line import/no-extraneous-dependencies
          var _require4 = require("metro-visualizer");

          initializeVisualizerMiddleware =
            _require4.initializeVisualizerMiddleware;
        } catch (e) {
          console.warn(
            "'config.server.enableVisualizer' is enabled but the 'metro-visualizer' package was not found - have you installed it?"
          );
        }

        if (initializeVisualizerMiddleware) {
          serverApp.use(
            "/visualizer",
            initializeVisualizerMiddleware(metroServer)
          );
        }
      }

      let inspectorProxy = null;

      if (config.server.runInspectorProxy) {
        inspectorProxy = new InspectorProxy();
      }

      let httpServer;

      if (secure) {
        httpServer = https.createServer(
          {
            key: yield readFile(secureKey),
            cert: yield readFile(secureCert)
          },
          serverApp
        );
      } else {
        httpServer = http.createServer(serverApp);
      }

      httpServer.on("error", error => {
        onError && onError(error);
        end();
      });
      return new Promise((resolve, reject) => {
        httpServer.listen(config.server.port, host, () => {
          onReady && onReady(httpServer);

          if (hmrEnabled) {
            attachHmrServer(httpServer);
          }

          if (inspectorProxy) {
            inspectorProxy.addWebSocketListener(httpServer); // TODO(hypuk): Refactor inspectorProxy.processRequest into separate request handlers
            // so that we could provide routes (/json/list and /json/version) here.
            // Currently this causes Metro to give warning about T31407894.

            serverApp.use(inspectorProxy.processRequest.bind(inspectorProxy));
          }

          resolve(httpServer);
        }); // Disable any kind of automatic timeout behavior for incoming
        // requests in case it takes the packager more than the default
        // timeout of 120 seconds to respond to a request.

        httpServer.timeout = 0;
        httpServer.on("error", error => {
          end();
          reject(error);
        });
        httpServer.on("close", () => {
          end();
        });
      });
    });

    return function(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  })();

exports.runBuild =
  /*#__PURE__*/
  (function() {
    var _ref5 = _asyncToGenerator(function*(config, _ref6) {
      let _ref6$dev = _ref6.dev,
        dev = _ref6$dev === void 0 ? false : _ref6$dev,
        entry = _ref6.entry,
        onBegin = _ref6.onBegin,
        onComplete = _ref6.onComplete,
        onProgress = _ref6.onProgress,
        _ref6$minify = _ref6.minify,
        minify = _ref6$minify === void 0 ? true : _ref6$minify,
        _ref6$output = _ref6.output,
        output = _ref6$output === void 0 ? outputBundle : _ref6$output,
        out = _ref6.out,
        _ref6$platform = _ref6.platform,
        platform = _ref6$platform === void 0 ? "web" : _ref6$platform,
        _ref6$sourceMap = _ref6.sourceMap,
        sourceMap = _ref6$sourceMap === void 0 ? false : _ref6$sourceMap,
        sourceMapUrl = _ref6.sourceMapUrl;
      const metroServer = yield runMetro(config);

      try {
        const requestOptions = {
          dev,
          entryFile: entry,
          inlineSourceMap: sourceMap && !sourceMapUrl,
          minify,
          platform,
          sourceMapUrl: sourceMap === false ? undefined : sourceMapUrl,
          createModuleIdFactory: config.serializer.createModuleIdFactory,
          onProgress
        };

        if (onBegin) {
          onBegin();
        }

        const metroBundle = yield output.build(metroServer, requestOptions);

        if (onComplete) {
          onComplete();
        }

        if (out) {
          const bundleOutput = out.replace(/(\.js)?$/, ".js");
          const sourcemapOutput =
            sourceMap === false ? undefined : out.replace(/(\.js)?$/, ".map");
          const outputOptions = {
            bundleOutput,
            sourcemapOutput,
            dev,
            platform
          }; // eslint-disable-next-line no-console

          yield output.save(metroBundle, outputOptions, console.log);
        }

        return metroBundle;
      } finally {
        yield metroServer.end();
      }
    });

    return function(_x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  })();

exports.buildGraph =
  /*#__PURE__*/
  (function() {
    var _ref7 = _asyncToGenerator(function*(config, _ref8) {
      let _ref8$customTransform = _ref8.customTransformOptions,
        customTransformOptions =
          _ref8$customTransform === void 0
            ? Object.create(null)
            : _ref8$customTransform,
        _ref8$dev = _ref8.dev,
        dev = _ref8$dev === void 0 ? false : _ref8$dev,
        entries = _ref8.entries,
        _ref8$minify = _ref8.minify,
        minify = _ref8$minify === void 0 ? false : _ref8$minify,
        onProgress = _ref8.onProgress,
        _ref8$platform = _ref8.platform,
        platform = _ref8$platform === void 0 ? "web" : _ref8$platform,
        _ref8$type = _ref8.type,
        type = _ref8$type === void 0 ? "module" : _ref8$type;
      const mergedConfig = yield getConfig(config);
      const bundler = new IncrementalBundler(mergedConfig);

      try {
        return yield bundler.buildGraphForEntries(
          entries,
          _objectSpread({}, MetroServer.DEFAULT_GRAPH_OPTIONS, {
            customTransformOptions,
            dev,
            minify,
            platform,
            type
          })
        );
      } finally {
        bundler.end();
      }
    });

    return function(_x8, _x9) {
      return _ref7.apply(this, arguments);
    };
  })();

exports.attachMetroCli = function(yargs) {
  let _ref9 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref9$build = _ref9.build,
    build = _ref9$build === void 0 ? {} : _ref9$build,
    _ref9$serve = _ref9.serve,
    serve = _ref9$serve === void 0 ? {} : _ref9$serve,
    _ref9$dependencies = _ref9.dependencies,
    dependencies = _ref9$dependencies === void 0 ? {} : _ref9$dependencies;

  if (build) {
    const _makeBuildCommand = makeBuildCommand(),
      command = _makeBuildCommand.command,
      description = _makeBuildCommand.description,
      builder = _makeBuildCommand.builder,
      handler = _makeBuildCommand.handler;

    yargs.command(command, description, builder, handler);
  }

  if (serve) {
    const _makeServeCommand = makeServeCommand(),
      command = _makeServeCommand.command,
      description = _makeServeCommand.description,
      builder = _makeServeCommand.builder,
      handler = _makeServeCommand.handler;

    yargs.command(command, description, builder, handler);
  }

  if (dependencies) {
    const _makeDependenciesComm = makeDependenciesCommand(),
      command = _makeDependenciesComm.command,
      description = _makeDependenciesComm.description,
      builder = _makeDependenciesComm.builder,
      handler = _makeDependenciesComm.handler;

    yargs.command(command, description, builder, handler);
  }

  return yargs;
}; // The symbols below belong to the legacy API and should not be relied upon

Object.assign(exports, require("./legacy"));
