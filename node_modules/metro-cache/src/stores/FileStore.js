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

const fs = require("fs");

const mkdirp = require("mkdirp");

const path = require("path");

const rimraf = require("rimraf");

const NULL_BYTE = 0x00;
const NULL_BYTE_BUFFER = Buffer.from([NULL_BYTE]);

class FileStore {
  constructor(options) {
    this._root = options.root;

    this._createDirs();
  }

  get(key) {
    try {
      const data = fs.readFileSync(this._getFilePath(key));

      if (data[0] === NULL_BYTE) {
        return data.slice(1);
      } else {
        return JSON.parse(data.toString("utf8"));
      }
    } catch (err) {
      if (err.code === "ENOENT" || err instanceof SyntaxError) {
        return null;
      }

      throw err;
    }
  }

  set(key, value) {
    const filePath = this._getFilePath(key);

    try {
      this._set(filePath, value);
    } catch (err) {
      if (err.code === "ENOENT") {
        mkdirp.sync(path.dirname(filePath));

        this._set(filePath, value);
      } else {
        throw err;
      }
    }
  }

  _set(filePath, value) {
    if (value instanceof Buffer) {
      const fd = fs.openSync(filePath, "w");
      fs.writeSync(fd, NULL_BYTE_BUFFER);
      fs.writeSync(fd, value);
      fs.closeSync(fd);
    } else {
      /* $FlowFixMe(>=0.95.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.95 was deployed. To see the error, delete
       * this comment and run Flow. */
      fs.writeFileSync(filePath, JSON.stringify(value));
    }
  }

  clear() {
    this._removeDirs();

    this._createDirs();
  }

  _getFilePath(key) {
    return path.join(
      this._root,
      key.slice(0, 1).toString("hex"),
      key.slice(1).toString("hex")
    );
  }

  _createDirs() {
    for (let i = 0; i < 256; i++) {
      mkdirp.sync(path.join(this._root, ("0" + i.toString(16)).slice(-2)));
    }
  }

  _removeDirs() {
    for (let i = 0; i < 256; i++) {
      rimraf.sync(path.join(this._root, ("0" + i.toString(16)).slice(-2)));
    }
  }
}

module.exports = FileStore;
