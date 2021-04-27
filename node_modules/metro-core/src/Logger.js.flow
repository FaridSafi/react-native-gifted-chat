/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const os = require('os');
const path = require('path');
const process = require('process');

const {EventEmitter} = require('events');

import type {BundleOptions} from 'metro/src/shared/types.flow';

const VERSION = require('../package.json').version;

export type ActionLogEntryData = {
  action_name: string,
  log_entry_label?: string,
};

export type ActionStartLogEntry = {
  action_name?: string,
  action_phase?: string,
  log_entry_label: string,
  log_session?: string,
  start_timestamp?: [number, number],
};

export type LogEntry = {
  action_name?: string,
  action_phase?: string,
  duration_ms?: number,
  entry_point?: string,
  log_entry_label: string,
  log_session?: string,
  start_timestamp?: [number, number],
  outdated_modules?: number,
  bundle_size?: number,
  bundle_options?: BundleOptions,
  bundle_hash?: string,
  build_id?: string,
};

const log_session = `${os.hostname()}-${Date.now()}`;
const eventEmitter = new EventEmitter();

function on(event: string, handler: (logEntry: LogEntry) => void): void {
  eventEmitter.on(event, handler);
}

function createEntry(data: LogEntry | string): LogEntry {
  const logEntry: LogEntry =
    typeof data === 'string' ? {log_entry_label: data} : data;

  const entryPoint = logEntry.entry_point;
  if (entryPoint) {
    logEntry.entry_point = path.relative(process.cwd(), entryPoint);
  }

  return {
    ...logEntry,
    log_session,
    metro_bundler_version: VERSION,
  };
}

function createActionStartEntry(data: ActionLogEntryData | string): LogEntry {
  const logEntry = typeof data === 'string' ? {action_name: data} : data;
  const {action_name} = logEntry;

  return createEntry({
    ...logEntry,
    action_name,
    action_phase: 'start',
    log_entry_label: action_name,
    start_timestamp: process.hrtime(),
  });
}

function createActionEndEntry(logEntry: ActionStartLogEntry): LogEntry {
  const {action_name, action_phase, start_timestamp} = logEntry;

  if (action_phase !== 'start' || !Array.isArray(start_timestamp)) {
    throw new Error('Action has not started or has already ended');
  }

  const timeDelta = process.hrtime(start_timestamp);
  const duration_ms = Math.round((timeDelta[0] * 1e9 + timeDelta[1]) / 1e6);

  return createEntry({
    ...logEntry,
    action_name,
    action_phase: 'end',
    duration_ms,
    log_entry_label: action_name,
  });
}

function log(logEntry: LogEntry): LogEntry {
  eventEmitter.emit('log', logEntry);
  return logEntry;
}

module.exports = {
  on,
  createEntry,
  createActionStartEntry,
  createActionEndEntry,
  log,
};
