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

declare var __DEV__: boolean;

// Note: the type `Response` is a built-in object in a service worker...

export type GetRevisionId = (bundleUrl: string, bundleRes: Response) => string;

const REVISION_ID_HEADER = 'X-Metro-Delta-ID';

function getRevisionId(bundleRes: Response): string {
  const revisionId = bundleRes.headers.get(REVISION_ID_HEADER);
  if (revisionId == null) {
    if (__DEV__) {
      throw new Error(
        `The \`${REVISION_ID_HEADER}\` header should be present on bundle responses from the Metro server.`,
      );
    } else {
      // This should never happen since we fully control the cache contents in
      // the production version of the delta client.
      throw new Error('The bundle cache is corrupted.');
    }
  }
  return revisionId;
}

function createResponse(
  contents: ?string | ReadableStream,
  revisionId: string,
  headersEntries: Iterable<[string, string]> = new Map(),
): Response {
  const headers = new Headers();
  for (const [name, value] of headersEntries) {
    headers.append(name, value);
  }
  headers.set(REVISION_ID_HEADER, revisionId);
  return new Response(contents, {headers});
}

module.exports = {createResponse, getRevisionId};
