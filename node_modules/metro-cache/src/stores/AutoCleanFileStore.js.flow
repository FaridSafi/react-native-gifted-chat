/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const FileStore = require('./FileStore');

const fs = require('fs');
const path = require('path');

import type {Options} from './FileStore';

type CleanOptions = {
  ...Options,
  intervalMs?: number,
  cleanupThresholdMs?: number,
};

type FileList = {
  path: string,
  stats: fs.Stats,
};

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(
  dir: string,
  filelist: Array<FileList>,
): Array<FileList> {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      filelist = walkSync(fullPath + path.sep, filelist);
    } else {
      filelist.push({path: fullPath, stats});
    }
  });
  return filelist;
};

function get<T>(property: ?T, defaultValue: T): T {
  if (property == null) {
    return defaultValue;
  }

  return property;
}

/**
 * A FileStore that cleans itself up in a given interval
 */
class AutoCleanFileStore<T> extends FileStore<T> {
  _intervalMs: number;
  _cleanupThresholdMs: number;
  _root: string;

  constructor(opts: CleanOptions) {
    super({root: opts.root});

    this._intervalMs = get(opts.intervalMs, 10 * 60 * 1000); // 10 minutes
    this._cleanupThresholdMs = get(
      opts.cleanupThresholdMs,
      3 * 24 * 60 * 60 * 1000, // 3 days
    );

    this._scheduleCleanup();
  }

  _scheduleCleanup() {
    setTimeout(this._doCleanup.bind(this), this._intervalMs);
  }

  _doCleanup() {
    const files = walkSync(this._root, []);

    let warned = false;
    files.forEach(file => {
      if (file.stats.mtimeMs < Date.now() - this._cleanupThresholdMs) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          if (!warned) {
            console.warn(
              'Problem cleaning up cache for ' + file.path + ': ' + e.message,
            );
            warned = true;
          }
        }
      }
    });

    this._scheduleCleanup();
  }
}

module.exports = AutoCleanFileStore;
