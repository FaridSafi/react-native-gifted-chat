/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+js_symbolication
 * @format
 */

'use strict';

const Symbolication = require('../Symbolication.js');

const fs = require('fs');
const path = require('path');

const {SourceMapConsumer} = require('source-map');

const resolve = fileName => path.resolve(__dirname, '__fixtures__', fileName);
const read = fileName => fs.readFileSync(resolve(fileName), 'utf8');

const TESTFILE_MAP = resolve('testfile.js.map');

const UNKNOWN_MODULE_IDS = {
  segmentId: 0,
  localId: undefined,
};

test('symbolicating with context created from source map object', async () => {
  const map = JSON.parse(read(TESTFILE_MAP));
  const context = Symbolication.createContext(SourceMapConsumer, map);
  expect(
    Symbolication.getOriginalPositionFor(1, 161, UNKNOWN_MODULE_IDS, context),
  ).toMatchInlineSnapshot(`
    Object {
      "column": 20,
      "line": 18,
      "name": null,
      "source": "thrower.js",
    }
  `);
});

test('symbolicating with context created from source map string', async () => {
  const map = read(TESTFILE_MAP);
  const context = Symbolication.createContext(SourceMapConsumer, map);
  expect(
    Symbolication.getOriginalPositionFor(1, 161, UNKNOWN_MODULE_IDS, context),
  ).toMatchInlineSnapshot(`
    Object {
      "column": 20,
      "line": 18,
      "name": null,
      "source": "thrower.js",
    }
  `);
});

test('symbolicating without specifying module IDs', async () => {
  const map = read(TESTFILE_MAP);
  const context = Symbolication.createContext(SourceMapConsumer, map);
  expect(Symbolication.getOriginalPositionFor(1, 161, null, context))
    .toMatchInlineSnapshot(`
    Object {
      "column": 20,
      "line": 18,
      "name": null,
      "source": "thrower.js",
    }
  `);
});
