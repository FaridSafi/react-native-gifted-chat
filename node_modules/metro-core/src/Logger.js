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

const os = require("os");

const path = require("path");

const process = require("process");

const _require = require("events"),
  EventEmitter = _require.EventEmitter;

const VERSION = require("../package.json").version;

const log_session = `${os.hostname()}-${Date.now()}`;
const eventEmitter = new EventEmitter();

function on(event, handler) {
  eventEmitter.on(event, handler);
}

function createEntry(data) {
  const logEntry =
    typeof data === "string"
      ? {
          log_entry_label: data
        }
      : data;
  const entryPoint = logEntry.entry_point;

  if (entryPoint) {
    logEntry.entry_point = path.relative(process.cwd(), entryPoint);
  }

  return _objectSpread({}, logEntry, {
    log_session,
    metro_bundler_version: VERSION
  });
}

function createActionStartEntry(data) {
  const logEntry =
    typeof data === "string"
      ? {
          action_name: data
        }
      : data;
  const action_name = logEntry.action_name;
  return createEntry(
    _objectSpread({}, logEntry, {
      action_name,
      action_phase: "start",
      log_entry_label: action_name,
      start_timestamp: process.hrtime()
    })
  );
}

function createActionEndEntry(logEntry) {
  const action_name = logEntry.action_name,
    action_phase = logEntry.action_phase,
    start_timestamp = logEntry.start_timestamp;

  if (action_phase !== "start" || !Array.isArray(start_timestamp)) {
    throw new Error("Action has not started or has already ended");
  }

  const timeDelta = process.hrtime(start_timestamp);
  const duration_ms = Math.round((timeDelta[0] * 1e9 + timeDelta[1]) / 1e6);
  return createEntry(
    _objectSpread({}, logEntry, {
      action_name,
      action_phase: "end",
      duration_ms,
      log_entry_label: action_name
    })
  );
}

function log(logEntry) {
  eventEmitter.emit("log", logEntry);
  return logEntry;
}

module.exports = {
  on,
  createEntry,
  createActionStartEntry,
  createActionEndEntry,
  log
};
