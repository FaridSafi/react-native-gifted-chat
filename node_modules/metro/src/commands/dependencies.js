/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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

const denodeify = require("denodeify");

const fs = require("fs");

const path = require("path");

const _require = require("metro-config"),
  loadConfig = _require.loadConfig;

const _require2 = require("../legacy"),
  getOrderedDependencyPaths = _require2.getOrderedDependencyPaths;

const _require3 = require("../cli-utils"),
  makeAsyncCommand = _require3.makeAsyncCommand;

function dependencies(_x, _x2) {
  return _dependencies.apply(this, arguments);
}

function _dependencies() {
  _dependencies = _asyncToGenerator(function*(args, config) {
    const rootModuleAbsolutePath = args.entryFile;

    if (!fs.existsSync(rootModuleAbsolutePath)) {
      return Promise.reject(
        new Error(`File ${rootModuleAbsolutePath} does not exist`)
      );
    }

    config.cacheStores = [];
    const relativePath = path.relative(
      config.projectRoot,
      rootModuleAbsolutePath
    );
    const options = {
      platform: args.platform,
      entryFile: relativePath,
      dev: args.dev,
      minify: false,
      generateSourceMaps: !args.dev
    };
    const writeToFile = args.output;
    const outStream = writeToFile
      ? fs.createWriteStream(args.output)
      : process.stdout;
    const deps = yield getOrderedDependencyPaths(config, options);
    deps.forEach(modulePath => {
      // Temporary hack to disable listing dependencies not under this directory.
      // Long term, we need either
      // (a) JS code to not depend on anything outside this directory, or
      // (b) Come up with a way to declare this dependency in Buck.
      const isInsideProjectRoots =
        config.watchFolders.filter(root => modulePath.startsWith(root)).length >
        0;

      if (isInsideProjectRoots) {
        outStream.write(modulePath + "\n");
      }
    });
    return writeToFile
      ? denodeify(outStream.end).bind(outStream)()
      : Promise.resolve();
  });
  return _dependencies.apply(this, arguments);
}

module.exports = () => ({
  command: "get-dependencies",
  description: "List dependencies",
  builder: yargs => {
    yargs.option("entry-file", {
      type: "string",
      demandOption: true,
      describe: "Absolute path to the root JS file"
    });
    yargs.option("output", {
      type: "string",
      describe: "File name where to store the output, ex. /tmp/dependencies.txt"
    });
    yargs.option("platform", {
      type: "string",
      describe: "The platform extension used for selecting modules"
    });
    yargs.option("transformer", {
      type: "string",
      describe: "Specify a custom transformer to be used"
    });
    yargs.option("max-workers", {
      type: "number",
      describe:
        "Specifies the maximum number of workers the worker-pool " +
        "will spawn for transforming files. This defaults to the number of the " +
        "cores available on your machine."
    });
    yargs.option("dev", {
      type: "boolean",
      default: true,
      describe: "If false, skip all dev-only code path"
    });
    yargs.option("verbose", {
      type: "boolean",
      default: false,
      description: "Enables logging"
    });
  },
  handler: makeAsyncCommand(
    /*#__PURE__*/
    (function() {
      var _ref = _asyncToGenerator(function*(argv) {
        const config = yield loadConfig(argv);
        yield dependencies(argv, config);
      });

      return function(_x3) {
        return _ref.apply(this, arguments);
      };
    })()
  )
});
