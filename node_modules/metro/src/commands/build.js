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

const MetroApi = require("../index");

const TerminalReporter = require("../lib/TerminalReporter");

const _require = require("../cli-utils"),
  makeAsyncCommand = _require.makeAsyncCommand;

const _require2 = require("metro-config"),
  loadConfig = _require2.loadConfig;

const _require3 = require("metro-core"),
  Terminal = _require3.Terminal;

const term = new Terminal(process.stdout);
const updateReporter = new TerminalReporter(term);

module.exports = () => ({
  command: "build <entry>",
  description:
    "Generates a JavaScript bundle containing the specified entrypoint and its descendants",
  builder: yargs => {
    yargs.option("project-roots", {
      alias: "P",
      type: "string",
      array: true
    });
    yargs.option("out", {
      alias: "O",
      type: "string",
      demandOption: true
    });
    yargs.option("platform", {
      alias: "p",
      type: "string"
    });
    yargs.option("output-type", {
      alias: "t",
      type: "string"
    });
    yargs.option("max-workers", {
      alias: "j",
      type: "number"
    });
    yargs.option("minify", {
      alias: "z",
      type: "boolean"
    });
    yargs.option("dev", {
      alias: "g",
      type: "boolean"
    });
    yargs.option("source-map", {
      type: "boolean"
    });
    yargs.option("source-map-url", {
      type: "string"
    });
    yargs.option("legacy-bundler", {
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
        const config = yield loadConfig(argv);
        yield MetroApi.runBuild(
          config,
          _objectSpread({}, argv, {
            onBegin: () => {
              updateReporter.update({
                buildID: "$",
                type: "bundle_build_started",
                bundleDetails: {
                  entryFile: argv.entry,
                  platform: argv.platform,
                  dev: !!argv.dev,
                  minify: !!argv.optimize,
                  bundleType: "Bundle"
                }
              });
            },
            onProgress: (transformedFileCount, totalFileCount) => {
              updateReporter.update({
                buildID: "$",
                type: "bundle_transform_progressed_throttled",
                transformedFileCount,
                totalFileCount
              });
            },
            onComplete: () => {
              updateReporter.update({
                buildID: "$",
                type: "bundle_build_done"
              });
            }
          })
        );
      });

      return function(_x) {
        return _ref.apply(this, arguments);
      };
    })()
  )
});
