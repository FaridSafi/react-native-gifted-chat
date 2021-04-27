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

const blacklist = require("metro-config/src/defaults/blacklist");

const invariant = require("invariant");

const _require = require("metro-core"),
  Logger = _require.Logger;

const _require2 = require("metro-source-map"),
  fromRawMappings = _require2.fromRawMappings,
  toSegmentTuple = _require2.toSegmentTuple;

exports.createBlacklist = blacklist;
exports.sourceMaps = {
  fromRawMappings,
  compactMapping: toSegmentTuple
};
exports.createServer = createServer;
exports.Logger = Logger;

/**
 * This is a public API, so we don't trust the value and purposefully downgrade
 * it as `mixed`. Because it understands `invariant`, Flow ensure that we
 * refine these values completely.
 */
function assertPublicBundleOptions(bo) {
  invariant(
    typeof bo === "object" && bo != null,
    "bundle options must be an object"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.dev === undefined || typeof bo.dev === "boolean",
    "bundle options field `dev` must be a boolean"
  );
  const entryFile = bo.entryFile;
  invariant(
    typeof entryFile === "string",
    "bundle options must contain a string field `entryFile`"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.inlineSourceMap === undefined || typeof bo.inlineSourceMap === "boolean",
    "bundle options field `inlineSourceMap` must be a boolean"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.minify === undefined || typeof bo.minify === "boolean",
    "bundle options field `minify` must be a boolean"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.platform === undefined || typeof bo.platform === "string",
    "bundle options field `platform` must be a string"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.runModule === undefined || typeof bo.runModule === "boolean",
    "bundle options field `runModule` must be a boolean"
  );
  invariant(
    // eslint-disable-next-line lint/strictly-null
    bo.sourceMapUrl === undefined || typeof bo.sourceMapUrl === "string",
    "bundle options field `sourceMapUrl` must be a boolean"
  );
  return _objectSpread(
    {
      entryFile
    },
    bo
  );
}

exports.build =
  /*#__PURE__*/
  (function() {
    var _ref = _asyncToGenerator(function*(options, bundleOptions) {
      // TODO: Find out if this is used at all
      // // eslint-disable-next-line lint/strictly-null
      // if (options.targetBabelVersion !== undefined) {
      //   process.env.BABEL_VERSION = String(options.targetBabelVersion);
      // }
      var server = createNonPersistentServer(options);

      const ServerClass = require("./Server");

      const result = yield server.build(
        _objectSpread(
          {},
          ServerClass.DEFAULT_BUNDLE_OPTIONS,
          assertPublicBundleOptions(bundleOptions),
          {
            bundleType: "todo"
          }
        )
      );
      server.end();
      return result;
    });

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

exports.getOrderedDependencyPaths =
  /*#__PURE__*/
  (function() {
    var _ref2 = _asyncToGenerator(function*(options, depOptions) {
      var server = createNonPersistentServer(options);

      try {
        return yield server.getOrderedDependencyPaths(depOptions);
      } finally {
        server.end();
      }
    });

    return function(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  })();

function createServer(options) {
  // Some callsites may not be Flowified yet.
  invariant(
    options.transformer.assetRegistryPath != null,
    "createServer() requires assetRegistryPath"
  );

  const ServerClass = require("./Server");

  return new ServerClass(options);
}

function createNonPersistentServer(config) {
  return createServer(config);
}
