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

const chalk = require("chalk");

const _require = require("metro-core"),
  Logger = _require.Logger;

const JestWorker = require("jest-worker").default;

class WorkerFarm {
  constructor(config, transformerConfig) {
    this._config = config;
    this._transformerConfig = transformerConfig;

    if (this._config.maxWorkers > 1) {
      const worker = this._makeFarm(
        this._config.transformer.workerPath,
        ["transform"],
        this._config.maxWorkers
      );

      worker.getStdout().on("data", chunk => {
        this._config.reporter.update({
          type: "worker_stdout_chunk",
          chunk: chunk.toString("utf8")
        });
      });
      worker.getStderr().on("data", chunk => {
        this._config.reporter.update({
          type: "worker_stderr_chunk",
          chunk: chunk.toString("utf8")
        });
      });
      this._worker = worker;
    } else {
      // eslint-disable-next-line lint/flow-no-fixme
      // $FlowFixMe: Flow doesn't support dynamic requires
      this._worker = require(this._config.transformer.workerPath);
    }
  }

  kill() {
    if (this._worker && typeof this._worker.end === "function") {
      this._worker.end();
    }
  }

  transform(filename, options) {
    var _this = this;

    return _asyncToGenerator(function*() {
      try {
        const data = yield _this._worker.transform(
          filename,
          options,
          _this._config.projectRoot,
          _this._transformerConfig
        );
        Logger.log(data.transformFileStartLogEntry);
        Logger.log(data.transformFileEndLogEntry);
        return {
          result: data.result,
          sha1: data.sha1
        };
      } catch (err) {
        if (err.loc) {
          throw _this._formatBabelError(err, filename);
        } else {
          throw _this._formatGenericError(err, filename);
        }
      }
    })();
  }

  _makeFarm(workerPath, exposedMethods, numWorkers) {
    const env = _objectSpread({}, process.env, {
      // Force color to print syntax highlighted code frames.
      FORCE_COLOR: chalk.supportsColor ? 1 : 0
    });

    return new JestWorker(workerPath, {
      computeWorkerKey: this._config.stickyWorkers
        ? this._computeWorkerKey
        : undefined,
      exposedMethods,
      forkOptions: {
        env
      },
      numWorkers
    });
  }

  _computeWorkerKey(method, filename) {
    // Only when transforming a file we want to stick to the same worker; and
    // we'll shard by file path. If not; we return null, which tells the worker
    // to pick the first available one.
    if (method === "transform") {
      return filename;
    }

    return null;
  }

  _formatGenericError(err, filename) {
    const error = new TransformError(`${filename}: ${err.message}`);
    return Object.assign(error, {
      stack: (err.stack || "")
        .split("\n")
        .slice(0, -1)
        .join("\n"),
      lineNumber: 0
    });
  }

  _formatBabelError(err, filename) {
    const error = new TransformError(
      `${err.type || "Error"}${
        err.message.includes(filename) ? "" : " in " + filename
      }: ${err.message}`
    ); // $FlowFixMe: extending an error.

    return Object.assign(error, {
      stack: err.stack,
      snippet: err.codeFrame,
      lineNumber: err.loc.line,
      column: err.loc.column,
      filename
    });
  }
}

class TransformError extends SyntaxError {
  constructor(message) {
    super(message);

    _defineProperty(this, "type", "TransformError");

    Error.captureStackTrace && Error.captureStackTrace(this, TransformError);
  }
}

module.exports = WorkerFarm;
