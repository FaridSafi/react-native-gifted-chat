/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
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

const uglify = require("uglify-es");

function minifier(options) {
  const result = minify(options);

  if (!options.map || result.map == null) {
    return {
      code: result.code
    };
  }

  const map = JSON.parse(result.map);
  return {
    code: result.code,
    map: _objectSpread({}, map, {
      sources: [options.filename]
    })
  };
}

function minify(_ref) {
  let code = _ref.code,
    map = _ref.map,
    reserved = _ref.reserved,
    config = _ref.config;

  const options = _objectSpread({}, config, {
    mangle: _objectSpread({}, config.mangle, {
      reserved
    }),
    sourceMap: _objectSpread({}, config.sourceMap, {
      content: map
    })
  });

  const result = uglify.minify(code, options);

  if (result.error) {
    throw result.error;
  }

  return {
    code: result.code,
    // eslint-disable-next-line lint/flow-no-fixme
    // $FlowFixMe flow cannot coerce the uglify options after using spread.
    map: result.map
  };
}

module.exports = minifier;
