/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const nullthrows = require('nullthrows');
const parseCustomTransformOptions = require('./parseCustomTransformOptions');
const parsePlatformFilePath = require('../node-haste/lib/parsePlatformFilePath');
const path = require('path');
const url = require('url');

const {revisionIdFromString} = require('../IncrementalBundler');

import type {RevisionId} from '../IncrementalBundler';
import type {BundleOptions} from '../shared/types.flow';

const getBoolean = (query, opt, defaultVal) =>
  query[opt] == null ? defaultVal : query[opt] === 'true' || query[opt] === '1';

const getBundleType = bundleName => {
  const bundleType = path.extname(bundleName).substr(1);
  return bundleType === 'delta' || bundleType === 'map' || bundleType === 'meta'
    ? bundleType
    : 'bundle';
};

module.exports = function parseOptionsFromUrl(
  requestUrl: string,
  platforms: Set<string>,
): {|options: BundleOptions, revisionId: ?RevisionId|} {
  const parsedURL = nullthrows(url.parse(requestUrl, true)); // `true` to parse the query param as an object.
  const query = nullthrows(parsedURL.query);
  const pathname =
    query.bundleEntry ||
    (parsedURL.pathname != null ? decodeURIComponent(parsedURL.pathname) : '');
  const platform =
    query.platform || parsePlatformFilePath(pathname, platforms).platform;
  const revisionId = query.revisionId || query.deltaBundleId || null;
  return {
    revisionId: revisionId != null ? revisionIdFromString(revisionId) : null,
    options: {
      bundleType: getBundleType(pathname),
      customTransformOptions: parseCustomTransformOptions(parsedURL),
      dev: getBoolean(query, 'dev', true),
      entryFile: pathname.replace(/^(?:\.?\/)?/, './').replace(/\.[^/.]+$/, ''),
      excludeSource: getBoolean(query, 'excludeSource', false),
      hot: true,
      inlineSourceMap: getBoolean(query, 'inlineSourceMap', false),
      minify: getBoolean(query, 'minify', false),
      modulesOnly: getBoolean(query, 'modulesOnly', false),
      onProgress: null,
      platform,
      runModule: getBoolean(query, 'runModule', true),
      shallow: getBoolean(query, 'shallow', false),
      sourceMapUrl: url.format({
        ...parsedURL,
        // The Chrome Debugger loads bundles via Blob urls, whose
        // protocol is blob:http. This breaks loading source maps through
        // protocol-relative URLs, which is why we must force the HTTP protocol
        // when loading the bundle for either Android or iOS.
        protocol:
          platform != null && platform.match(/^(android|ios)$/) ? 'http' : '',
        pathname: pathname.replace(/\.(bundle|delta)$/, '.map'),
      }),
      sourceUrl: requestUrl,
    },
  };
};
