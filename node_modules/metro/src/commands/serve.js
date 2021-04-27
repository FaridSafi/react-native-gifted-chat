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

const MetroApi = require("../index");

const _require = require("../cli-utils"),
  watchFile = _require.watchFile,
  makeAsyncCommand = _require.makeAsyncCommand;

const _require2 = require("metro-config"),
  loadConfig = _require2.loadConfig,
  resolveConfig = _require2.resolveConfig;

const _require3 = require("util"),
  promisify = _require3.promisify;

module.exports = () => ({
  command: "serve",
  description:
    "Starts a Metro server on the given port, building bundles on the fly",
  builder: yargs => {
    yargs.option("project-roots", {
      alias: "P",
      type: "string",
      array: true
    });
    yargs.option("host", {
      alias: "h",
      type: "string",
      default: "localhost"
    });
    yargs.option("port", {
      alias: "p",
      type: "number",
      default: 8080
    });
    yargs.option("max-workers", {
      alias: "j",
      type: "number"
    });
    yargs.option("secure", {
      type: "boolean"
    });
    yargs.option("secure-key", {
      type: "string"
    });
    yargs.option("secure-cert", {
      type: "string"
    });
    yargs.option("hmr-enabled", {
      alias: "hmr",
      type: "boolean"
    });
    yargs.option("config", {
      alias: "c",
      type: "string"
    }); // Deprecated
    // $FlowFixMe Errors found when flow-typing `yargs`

    yargs.option("reset-cache", {
      type: "boolean",
      describe: null
    });
  },
  // eslint-disable-next-line lint/no-unclear-flowtypes
  handler: makeAsyncCommand(
    /*#__PURE__*/
    (function() {
      var _ref = _asyncToGenerator(function*(argv) {
        let server = null;
        let restarting = false;

        function restart() {
          return _restart.apply(this, arguments);
        }

        function _restart() {
          _restart = _asyncToGenerator(function*() {
            if (restarting) {
              return;
            } else {
              restarting = true;
            }

            if (server) {
              // eslint-disable-next-line no-console
              console.log("Configuration changed. Restarting the server...");
              yield promisify(server.close).call(server);
            }

            const config = yield loadConfig(argv);
            server = yield MetroApi.runServer(config, argv);
            restarting = false;
          });
          return _restart.apply(this, arguments);
        }

        const foundConfig = yield resolveConfig(argv.config, argv.cwd);

        if (foundConfig) {
          yield watchFile(foundConfig.filepath, restart);
        } else {
          yield restart();
        }
      });

      return function(_x) {
        return _ref.apply(this, arguments);
      };
    })()
  )
});
