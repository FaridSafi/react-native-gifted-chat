/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Note: This is a fork of the fb-specific transform.js
 *
 *
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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

const crypto = require("crypto");

const fs = require("fs");

const inlineRequiresPlugin = require("babel-preset-fbjs/plugins/inline-requires");

const makeHMRConfig = require("metro-react-native-babel-preset/src/configs/hmr");

const path = require("path");

const _require = require("@babel/core"),
  parseSync = _require.parseSync,
  transformFromAstSync = _require.transformFromAstSync;

const _require2 = require("metro-source-map"),
  generateFunctionMap = _require2.generateFunctionMap;

const cacheKeyParts = [
  fs.readFileSync(__filename),
  require("babel-preset-fbjs/package.json").version
];
/**
 * Return a memoized function that checks for the existence of a
 * project level .babelrc file, and if it doesn't exist, reads the
 * default RN babelrc file and uses that.
 */

const getBabelRC = (function() {
  let babelRC = null;
  return function _getBabelRC(projectRoot, options) {
    if (babelRC != null) {
      return babelRC;
    }

    babelRC = {
      plugins: []
    }; // Let's look for a babel config file in the project root.
    // TODO look into adding a command line option to specify this location

    let projectBabelRCPath; // .babelrc

    if (projectRoot) {
      projectBabelRCPath = path.resolve(projectRoot, ".babelrc");
    }

    if (projectBabelRCPath) {
      // .babelrc.js
      if (!fs.existsSync(projectBabelRCPath)) {
        projectBabelRCPath = path.resolve(projectRoot, ".babelrc.js");
      } // babel.config.js

      if (!fs.existsSync(projectBabelRCPath)) {
        projectBabelRCPath = path.resolve(projectRoot, "babel.config.js");
      } // If we found a babel config file, extend our config off of it
      // otherwise the default config will be used

      if (fs.existsSync(projectBabelRCPath)) {
        babelRC.extends = projectBabelRCPath;
      }
    } // If a babel config file doesn't exist in the project then
    // the default preset for react-native will be used instead.

    if (!babelRC.extends) {
      const experimentalImportSupport = options.experimentalImportSupport,
        presetOptions = _objectWithoutProperties(options, [
          "experimentalImportSupport"
        ]);

      babelRC.presets = [
        [
          require("metro-react-native-babel-preset"),
          _objectSpread({}, presetOptions, {
            disableImportExportTransform: experimentalImportSupport,
            enableBabelRuntime: options.enableBabelRuntime
          })
        ]
      ];
    }

    return babelRC;
  };
})();
/**
 * Given a filename and options, build a Babel
 * config object with the appropriate plugins.
 */

function buildBabelConfig(filename, options) {
  let plugins =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const babelRC = getBabelRC(options.projectRoot, options);
  const extraConfig = {
    babelrc:
      typeof options.enableBabelRCLookup === "boolean"
        ? options.enableBabelRCLookup
        : true,
    code: false,
    filename,
    highlightCode: true
  };
  let config = Object.assign({}, babelRC, extraConfig); // Add extra plugins

  const extraPlugins = [];

  if (options.inlineRequires) {
    extraPlugins.push(inlineRequiresPlugin);
  }

  config.plugins = extraPlugins.concat(config.plugins, plugins);

  if (options.dev && options.hot) {
    // Note: this intentionally doesn't include the path separator because
    // I'm not sure which one it should use on Windows, and false positives
    // are unlikely anyway. If you later decide to include the separator,
    // don't forget that the string usually *starts* with "node_modules" so
    // the first one often won't be there.
    const mayContainEditableReactComponents =
      filename.indexOf("node_modules") === -1;

    if (mayContainEditableReactComponents) {
      const hmrConfig = makeHMRConfig();
      config = Object.assign({}, config, hmrConfig);
    }
  }

  return Object.assign({}, babelRC, config);
}

function transform(_ref) {
  let filename = _ref.filename,
    options = _ref.options,
    src = _ref.src,
    plugins = _ref.plugins;
  const OLD_BABEL_ENV = process.env.BABEL_ENV;
  process.env.BABEL_ENV = options.dev
    ? "development"
    : process.env.BABEL_ENV || "production";

  try {
    const babelConfig = _objectSpread(
      {
        // ES modules require sourceType='module' but OSS may not always want that
        sourceType: "unambiguous"
      },
      buildBabelConfig(filename, options, plugins),
      {
        caller: {
          name: "metro",
          platform: options.platform
        },
        ast: true
      }
    );

    const sourceAst = parseSync(src, babelConfig);
    const result = transformFromAstSync(sourceAst, src, babelConfig);
    const functionMap = generateFunctionMap(sourceAst, {
      filename
    }); // The result from `transformFromAstSync` can be null (if the file is ignored)

    if (!result) {
      return {
        ast: null,
        functionMap
      };
    }

    return {
      ast: result.ast,
      functionMap
    };
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV;
  }
}

function getCacheKey() {
  var key = crypto.createHash("md5");
  cacheKeyParts.forEach(part => key.update(part));
  return key.digest("hex");
}

module.exports = {
  transform,
  getCacheKey
};
