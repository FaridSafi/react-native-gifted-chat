/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const EXTRACT_MODULE_NAME_REGEX = /'\.\/(.+)'/;

let didError = false;

// Make sure we have a lib to read files from. Take it as the first argument.
assert(
  process.argv.length >= 3,
  'Expected to receive an argument to a lib directory'
);

const pathToLib = path.resolve(process.cwd(), process.argv[2]);

fs.readdir(pathToLib, (err, files) => {
  files = files.filter((filename) => path.parse(filename).ext === '.js');

  files.forEach((filename) => {
    const requirePath = path.join(pathToLib, filename);
    const moduleName = path.parse(filename).name;

    try {
      require(requirePath);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        const missingModule = e.toString().match(EXTRACT_MODULE_NAME_REGEX)[1];
        console.error(moduleName, 'is missing a dependency:', missingModule);
      } else {
        console.error('UNKNOWN ERROR', e);
      }
      didError = true;
    }
  });

  process.exit(didError ? 1 : 0);
});
