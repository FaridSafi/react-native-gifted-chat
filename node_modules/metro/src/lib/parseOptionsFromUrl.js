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

const nullthrows = require("nullthrows");

const parseCustomTransformOptions = require("./parseCustomTransformOptions");

const parsePlatformFilePath = require("../node-haste/lib/parsePlatformFilePath");

const path = require("path");

const url = require("url");

const _require = require("../IncrementalBundler"),
  revisionIdFromString = _require.revisionIdFromString;

const getBoolean = (query, opt, defaultVal) =>
  query[opt] == null ? defaultVal : query[opt] === "true" || query[opt] === "1";

const getBundleType = bundleName => {
  const bundleType = path.extname(bundleName).substr(1);
  return bundleType === "delta" || bundleType === "map" || bundleType === "meta"
    ? bundleType
    : "bundle";
};

module.exports = function parseOptionsFromUrl(requestUrl, platforms) {
  const parsedURL = nullthrows(url.parse(requestUrl, true)); // `true` to parse the query param as an object.

  const query = nullthrows(parsedURL.query);
  const pathname =
    query.bundleEntry ||
    (parsedURL.pathname != null ? decodeURIComponent(parsedURL.pathname) : "");
  const platform =
    query.platform || parsePlatformFilePath(pathname, platforms).platform;
  const revisionId = query.revisionId || query.deltaBundleId || null;
  return {
    revisionId: revisionId != null ? revisionIdFromString(revisionId) : null,
    options: {
      bundleType: getBundleType(pathname),
      customTransformOptions: parseCustomTransformOptions(parsedURL),
      dev: getBoolean(query, "dev", true),
      entryFile: pathname.replace(/^(?:\.?\/)?/, "./").replace(/\.[^/.]+$/, ""),
      excludeSource: getBoolean(query, "excludeSource", false),
      hot: true,
      inlineSourceMap: getBoolean(query, "inlineSourceMap", false),
      minify: getBoolean(query, "minify", false),
      modulesOnly: getBoolean(query, "modulesOnly", false),
      onProgress: null,
      platform,
      runModule: getBoolean(query, "runModule", true),
      shallow: getBoolean(query, "shallow", false),
      sourceMapUrl: url.format(
        _objectSpread({}, parsedURL, {
          // The Chrome Debugger loads bundles via Blob urls, whose
          // protocol is blob:http. This breaks loading source maps through
          // protocol-relative URLs, which is why we must force the HTTP protocol
          // when loading the bundle for either Android or iOS.
          protocol:
            platform != null && platform.match(/^(android|ios)$/) ? "http" : "",
          pathname: pathname.replace(/\.(bundle|delta)$/, ".map")
        })
      ),
      sourceUrl: requestUrl
    }
  };
};
