/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

/* eslint-env worker, serviceworker */

'use strict';

import type {BundleMetadata} from '../types.flow';

export type GetBundleMetadata = (
  bundleUrl: string,
  revisionId: string,
) => Promise<BundleMetadata>;

const fetchBundleMetadata: GetBundleMetadata = async (
  bundleUrl: string,
  revisionId: string,
) => {
  const url = new URL(bundleUrl);
  url.pathname = url.pathname.replace(/\.(bundle|js)$/, '.meta');
  url.searchParams.append('revisionId', revisionId);
  const res = await fetch(url.href, {
    includeCredentials: true,
  });
  const json = await res.json();
  if (res.status != 200 && res.status != 304) {
    throw new Error(
      `Error retrieving metadata for the bundle \`${bundleUrl}\`: ${
        json.type
      }: ${json.message}`,
    );
  }
  return json;
};

module.exports = {
  fetchBundleMetadata,
};
