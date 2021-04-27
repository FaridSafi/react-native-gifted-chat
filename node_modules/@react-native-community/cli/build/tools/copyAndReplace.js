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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
// Binary files, don't process these (avoid decoding as utf8)
const binaryExtensions = ['.png', '.jar', '.keystore'];

/**
 * Copy a file to given destination, replacing parts of its contents.
 * @param srcPath Path to a file to be copied.
 * @param destPath Destination path.
 * @param replacements: e.g. {'TextToBeReplaced': 'Replacement'}
 * @param contentChangedCallback
 *        Used when upgrading projects. Based on if file contents would change
 *        when being replaced, allows the caller to specify whether the file
 *        should be replaced or not.
 *        If null, files will be overwritten.
 *        Function(path, 'identical' | 'changed' | 'new') => 'keep' | 'overwrite'
 */
function copyAndReplace(srcPath, destPath, replacements, contentChangedCallback) {
  if (_fs().default.lstatSync(srcPath).isDirectory()) {
    if (!_fs().default.existsSync(destPath)) {
      _fs().default.mkdirSync(destPath);
    } // Not recursive


    return;
  }

  const extension = _path().default.extname(srcPath);

  if (binaryExtensions.indexOf(extension) !== -1) {
    // Binary file
    let shouldOverwrite = 'overwrite';

    if (contentChangedCallback) {
      const newContentBuffer = _fs().default.readFileSync(srcPath);

      let contentChanged = 'identical';

      try {
        const origContentBuffer = _fs().default.readFileSync(destPath);

        if (Buffer.compare(origContentBuffer, newContentBuffer) !== 0) {
          contentChanged = 'changed';
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          contentChanged = 'new';
        } else {
          throw err;
        }
      }

      shouldOverwrite = contentChangedCallback(destPath, contentChanged);
    }

    if (shouldOverwrite === 'overwrite') {
      copyBinaryFile(srcPath, destPath, err => {
        if (err) {
          throw err;
        }
      });
    }
  } else {
    // Text file
    const srcPermissions = _fs().default.statSync(srcPath).mode;

    let content = _fs().default.readFileSync(srcPath, 'utf8');

    Object.keys(replacements).forEach(regex => {
      content = content.replace(new RegExp(regex, 'g'), replacements[regex]);
    });
    let shouldOverwrite = 'overwrite';

    if (contentChangedCallback) {
      // Check if contents changed and ask to overwrite
      let contentChanged = 'identical';

      try {
        const origContent = _fs().default.readFileSync(destPath, 'utf8');

        if (content !== origContent) {
          // logger.info('Content changed: ' + destPath);
          contentChanged = 'changed';
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          contentChanged = 'new';
        } else {
          throw err;
        }
      }

      shouldOverwrite = contentChangedCallback(destPath, contentChanged);
    }

    if (shouldOverwrite === 'overwrite') {
      _fs().default.writeFileSync(destPath, content, {
        encoding: 'utf8',
        mode: srcPermissions
      });
    }
  }
}
/**
 * Same as 'cp' on Unix. Don't do any replacements.
 */


function copyBinaryFile(srcPath, destPath, cb) {
  let cbCalled = false;

  const srcPermissions = _fs().default.statSync(srcPath).mode;

  const readStream = _fs().default.createReadStream(srcPath);

  readStream.on('error', err => {
    done(err);
  });

  const writeStream = _fs().default.createWriteStream(destPath, {
    mode: srcPermissions
  });

  writeStream.on('error', err => {
    done(err);
  });
  writeStream.on('close', () => {
    done();
  });
  readStream.pipe(writeStream);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

var _default = copyAndReplace;
exports.default = _default;