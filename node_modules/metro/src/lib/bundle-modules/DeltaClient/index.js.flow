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

const BundleNotFoundError = require('./BundleNotFoundError');

const bundleToString = require('./bundleToString');
const patchBundle = require('./patchBundle');
const stringToBundle = require('./stringToBundle');

const {
  openDB,
  getBundleMetadata: getBundleMetadataFromDB,
  setBundleMetadata,
  removeBundleMetadata,
} = require('./bundleDB');
const {fetchBundleMetadata} = require('./metadata');
const {createResponse, getRevisionId} = require('./response');

import type {BundleVariant} from '../types.flow';
import type {GetBundleMetadata} from './metadata';

export type GetDeltaBundle = (
  bundleKey: string,
  fromRevisionId: string,
  toRevisionId: ?string,
) => Promise<BundleVariant>;

export type DeltaClientOptions = {|
  +bundleCacheName?: string,
  +bundleDBName?: string,
  +getDeltaBundle: GetDeltaBundle,
  +getBundleMetadata: GetBundleMetadata,
|};

export type DeltaClient = {|
  +getBundle: (
    bundleKey: string,
    revisionId: string,
    waitUntil: <T>(op: Promise<T>) => void,
  ) => Promise<Response>,
  +registerBundle: (
    bundleKey: string,
    revisionId: string,
    bundleRes: Response,
    waitUntil: <T>(op: Promise<T>) => void,
  ) => Response,
|};

async function defaultGetDeltaBundle(
  bundleUrl: string,
  fromRevisionId: string,
  toRevisionId: ?string,
): Promise<BundleVariant> {
  const url = new URL(bundleUrl);
  url.pathname = url.pathname.replace(/\.(bundle|js)$/, '.delta');
  if (fromRevisionId != null) {
    url.searchParams.append('revisionId', fromRevisionId);
  }
  const res = await fetch(url.href, {
    includeCredentials: true,
  });
  const json = await res.json();
  if (res.status != 200 && res.status != 304) {
    throw new Error(
      `Error retrieving delta for the bundle \`${bundleUrl}\`: ${json.type}: ${
        json.message
      }`,
    );
  }
  return json;
}

const DEFAULT_DB_NAME = '__metroBundleDB';
const CACHE_VERSION = 1;
const DEFAULT_CACHE_NAME = '__metroBundleCacheV' + CACHE_VERSION;

function create({
  getDeltaBundle = defaultGetDeltaBundle,
  getBundleMetadata = fetchBundleMetadata,
  bundleCacheName = DEFAULT_CACHE_NAME,
  bundleDBName = DEFAULT_DB_NAME,
}: DeltaClientOptions = {}): DeltaClient {
  const cachePromise = caches.open(bundleCacheName);
  const dbPromise = openDB(DEFAULT_DB_NAME);

  const getBundle = async (
    bundleKey: string,
    revisionId: string,
    waitUntil: <T>(op: Promise<T>) => void,
  ) => {
    const cache = await cachePromise;
    const db = await dbPromise;

    const prevBundleRes = await cache.match(bundleKey);

    if (prevBundleRes == null) {
      throw new BundleNotFoundError(bundleKey);
    }

    const prevRevisionId = getRevisionId(prevBundleRes);

    if (revisionId === prevRevisionId) {
      return prevBundleRes;
    }

    const [prevStringBundle, prevBundleMetadata, delta] = await Promise.all([
      prevBundleRes.text(),
      (async () => {
        const metadata = await getBundleMetadataFromDB(db, prevRevisionId);
        if (metadata != null) {
          return metadata;
        }
        return await getBundleMetadata(bundleKey, prevRevisionId);
      })(),
      getDeltaBundle(bundleKey, prevRevisionId, revisionId),
    ]);

    const prevBundle = stringToBundle(prevStringBundle, prevBundleMetadata);
    const bundle = delta.base
      ? {pre: delta.pre, post: delta.post, modules: delta.modules}
      : patchBundle(prevBundle, {
          added: delta.added,
          modified: delta.modified,
          deleted: delta.deleted,
        });
    const {code: stringBundle, metadata} = bundleToString(bundle);
    const bundleRes = createResponse(stringBundle, revisionId, [
      ...prevBundleRes.headers,
      ['Date', new Date().toUTCString()],
    ]);

    waitUntil(
      Promise.all([
        cache.put(bundleKey, bundleRes.clone()),
        setBundleMetadata(db, revisionId, metadata),
        removeBundleMetadata(db, prevRevisionId),
      ]),
    );

    return bundleRes;
  };

  const registerBundle = (
    bundleKey: string,
    initialRevisionId: string,
    initialBundleRes,
    waitUntil: <T>(op: Promise<T>) => void,
  ) => {
    const res = createResponse(
      initialBundleRes.clone().body,
      initialRevisionId,
      initialBundleRes.headers,
    );

    waitUntil(
      Promise.all([
        (async () => {
          const cache = await cachePromise;
          await cache.put(bundleKey, res);
        })(),
        (async () => {
          const db = await dbPromise;
          const metadata = await getBundleMetadataFromDB(db, initialRevisionId);
          if (metadata != null) {
            return;
          }
          await setBundleMetadata(
            db,
            initialRevisionId,
            await getBundleMetadata(bundleKey, initialRevisionId),
          );
        })(),
      ]),
    );

    return res;
  };

  return {getBundle, registerBundle};
}

module.exports = {create, BundleNotFoundError, CACHE_VERSION};
