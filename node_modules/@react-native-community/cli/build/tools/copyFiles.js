"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _walk = _interopRequireDefault(require("./walk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Copy files (binary included) recursively.
 */
async function copyFiles(srcPath, destPath, options = {}) {
  return Promise.all((0, _walk.default)(srcPath).map(async absoluteSrcFilePath => {
    const exclude = options.exclude;

    if (exclude && exclude.some(p => p.test(absoluteSrcFilePath))) {
      return;
    }

    const relativeFilePath = _path().default.relative(srcPath, absoluteSrcFilePath);

    await copyFile(absoluteSrcFilePath, _path().default.resolve(destPath, relativeFilePath));
  }));
}
/**
 * Copy a file to given destination.
 */


function copyFile(srcPath, destPath) {
  if (_fs().default.lstatSync(srcPath).isDirectory()) {
    if (!_fs().default.existsSync(destPath)) {
      _fs().default.mkdirSync(destPath);
    } // Not recursive


    return;
  }

  return new Promise((resolve, reject) => {
    copyBinaryFile(srcPath, destPath, err => {
      if (err) {
        reject(err);
      }

      resolve(destPath);
    });
  });
}
/**
 * Same as 'cp' on Unix. Don't do any replacements.
 */


function copyBinaryFile(srcPath, destPath, cb) {
  let cbCalled = false;

  const {
    mode
  } = _fs().default.statSync(srcPath);

  const readStream = _fs().default.createReadStream(srcPath);

  const writeStream = _fs().default.createWriteStream(destPath);

  readStream.on('error', err => {
    done(err);
  });
  writeStream.on('error', err => {
    done(err);
  });
  readStream.on('close', () => {
    done();

    _fs().default.chmodSync(destPath, mode);
  });
  readStream.pipe(writeStream);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

var _default = copyFiles;
exports.default = _default;