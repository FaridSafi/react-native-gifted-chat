/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 */
"use strict";

const FileStore = require("./FileStore");

const fs = require("fs");

const path = require("path");

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      filelist = walkSync(fullPath + path.sep, filelist);
    } else {
      filelist.push({
        path: fullPath,
        stats
      });
    }
  });
  return filelist;
};

function get(property, defaultValue) {
  if (property == null) {
    return defaultValue;
  }

  return property;
}
/**
 * A FileStore that cleans itself up in a given interval
 */

class AutoCleanFileStore extends FileStore {
  constructor(opts) {
    super({
      root: opts.root
    });
    this._intervalMs = get(opts.intervalMs, 10 * 60 * 1000); // 10 minutes

    this._cleanupThresholdMs = get(
      opts.cleanupThresholdMs,
      3 * 24 * 60 * 60 * 1000 // 3 days
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
              "Problem cleaning up cache for " + file.path + ": " + e.message
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
