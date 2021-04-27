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

const path = require("path");

const _require = require("./Assets"),
  getAssetData = _require.getAssetData;

const _require2 = require("./Bundler/util"),
  generateAssetCodeFileAst = _require2.generateAssetCodeFileAst;

function transform(_x, _x2, _x3) {
  return _transform.apply(this, arguments);
}

function _transform() {
  _transform = _asyncToGenerator(function*(
    _ref,
    assetRegistryPath,
    assetDataPlugins
  ) {
    let filename = _ref.filename,
      options = _ref.options,
      src = _ref.src;
    options = options || {
      platform: "",
      projectRoot: "",
      inlineRequires: false,
      minify: false
    };
    const absolutePath = path.resolve(options.projectRoot, filename);
    const data = yield getAssetData(
      absolutePath,
      filename,
      assetDataPlugins,
      options.platform,
      options.publicPath
    );
    return {
      ast: generateAssetCodeFileAst(assetRegistryPath, data)
    };
  });
  return _transform.apply(this, arguments);
}

module.exports = {
  transform
};
