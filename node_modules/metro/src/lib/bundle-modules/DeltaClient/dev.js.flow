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
const WebSocketHMRClient = require('../WebSocketHMRClient');

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

import type {BundleMetadata, HmrUpdate, FormattedError} from '../types.flow';
import type {GetBundleMetadata} from './metadata';

export type GetHmrServerUrl = (bundleUrl: string, revisionId: string) => string;

export type DeltaClientOptions = {|
  +bundleCacheName?: string,
  +bundleDBName?: string,
  +getBundleMetadata?: GetBundleMetadata,
  +getHmrServerUrl?: GetHmrServerUrl,
  +onUpdateStart?: (clientId: string) => void,
  +onUpdate?: (clientId: string, update: HmrUpdate) => void,
  +onUpdateError?: (clientId: string, error: FormattedError) => void,
|};

export type DeltaClient = {|
  +getBundle: (bundleKey: string, clientId: string) => Promise<Response>,
  +registerBundle: (
    bundleKey: string,
    bundleRes: Response,
    clientId: string,
  ) => Promise<void>,
|};

export type CreateDeltaClient = (options: DeltaClientOptions) => DeltaClient;

export type HandleOptions = {|
  +bundleUrl: string,
  +bundleKey: string,
  +clientId: string,
|};

export type Handle = HandleOptions => Promise<Response>;

type UpdateClient = {|bundleResPromise: Promise<Response>, +ids: Set<string>|};

class UpdateError extends Error {
  constructor(bundleUrl: string, originalError: Error) {
    super(
      `Error retrieving an initial update for the bundle \`${bundleUrl}\`.`,
    );
    this.stack = 'Caused by: ' + originalError.stack;
  }
}

function defaultGetHmrServerUrl(bundleUrl: string, revisionId: string): string {
  const url = new URL(bundleUrl);
  return `${url.protocol === 'https:' ? 'wss' : 'ws'}://${
    url.host
  }/hot?revisionId=${revisionId}`;
}

function defaultOnUpdate(clientId: string, update: HmrUpdate): void {
  clients.get(clientId).then((client: ?Client) => {
    if (client != null) {
      client.postMessage({
        type: 'METRO_UPDATE',
        update,
      });
    }
  });
}

function defaultOnUpdateStart(clientId: string): void {
  clients.get(clientId).then((client: ?Client) => {
    if (client != null) {
      client.postMessage({
        type: 'METRO_UPDATE_START',
      });
    }
  });
}

function defaultOnUpdateError(clientId: string, error: FormattedError): void {
  clients.get(clientId).then((client: ?Client) => {
    if (client != null) {
      client.postMessage({
        type: 'METRO_UPDATE_ERROR',
        error,
      });
    }
  });
}

const DEFAULT_DB_NAME = '__metroBundleDB';
const CACHE_VERSION = 1;
const DEFAULT_CACHE_NAME = '__metroBundleCacheV' + CACHE_VERSION;

function create({
  getHmrServerUrl = defaultGetHmrServerUrl,
  getBundleMetadata = fetchBundleMetadata,
  onUpdateStart = defaultOnUpdateStart,
  onUpdate = defaultOnUpdate,
  onUpdateError = defaultOnUpdateError,
  bundleCacheName = DEFAULT_CACHE_NAME,
  bundleDBName = DEFAULT_DB_NAME,
}: DeltaClientOptions = {}): DeltaClient {
  const cachePromise = caches.open(bundleCacheName);
  const dbPromise = openDB(DEFAULT_DB_NAME);
  const clients: Map<string, UpdateClient> = new Map();

  const setupUpdates = async (
    bundleKey: string,
    clientId: string,
    prevRevisionId: string,
    prevBundleRes: Response,
    prevBundleMetadataPromise: Promise<BundleMetadata>,
  ): Promise<UpdateClient> => {
    const cache = await cachePromise;
    const db = await dbPromise;

    let bundleRes = prevBundleRes;
    let revisionId = prevRevisionId;
    let bundlePromise = (async () => {
      const stringBundle = await prevBundleRes.clone().text();
      const prevBundleMetadata = await prevBundleMetadataPromise;
      return stringToBundle(stringBundle, prevBundleMetadata);
    })();

    let resolveBundleRes;
    let rejectBundleRes;
    const client = {
      ids: new Set([clientId]),
      bundleResPromise: new Promise(
        (resolve, reject: (error: mixed) => void) => {
          // Note: the arg type will be a Resolve result in service-workers
          resolveBundleRes = resolve;
          rejectBundleRes = reject;
        },
      ),
    };

    clients.set(bundleKey, client);

    let resolved = false;
    const wsClient = new WebSocketHMRClient(
      getHmrServerUrl(bundleKey, prevRevisionId),
    );

    wsClient.on('open', () => {
      wsClient.send(
        JSON.stringify({
          type: 'register-entrypoints',
          entryPoints: [getHmrServerUrl(bundleKey, prevRevisionId)],
        }),
      );
    });

    wsClient.on('connection-error', error => {
      rejectBundleRes(error);
    });

    wsClient.on('close', () => {
      clients.delete(bundleKey);
    });

    wsClient.on('error', error => {
      if (!resolved) {
        rejectBundleRes(error);
        return;
      }
      client.ids.forEach((clientId: string) => onUpdateError(clientId, error));
    });

    wsClient.on('update-start', () => {
      client.ids.forEach((clientId: string) => onUpdateStart(clientId));
    });

    wsClient.on('update', async update => {
      if (resolved) {
        // Only notify clients for later updates.
        client.ids.forEach((clientId: string) => onUpdate(clientId, update));
      }

      let nextBundleRes; // type: Response, built-in function for service worker
      if (revisionId === update.revisionId) {
        nextBundleRes = bundleRes;
      } else {
        let bundle;
        try {
          bundle = await bundlePromise;
        } catch (error) {
          // This error should only happen when either the initial bundle or the
          // initial bundle metadata are invalid or cannot be retrieved.
          rejectBundleRes(error);
          return;
        }
        const nextBundle = patchBundle(bundle, {
          added: update.added,
          modified: update.modified,
          deleted: update.deleted,
        });
        bundlePromise = Promise.resolve(nextBundle);

        const {code: stringBundle, metadata} = bundleToString(nextBundle);
        nextBundleRes = createResponse(
          stringBundle,
          update.revisionId,
          new Headers({
            // In development, we expect the bundle URL to be static. As such,
            // the browser should always request the Service Worker for the
            // latest version.
            'Cache-Control': 'no-cache',
          }),
        );

        cache.put(bundleKey, nextBundleRes.clone());
        setBundleMetadata(db, update.revisionId, metadata);
        removeBundleMetadata(db, revisionId);

        revisionId = update.revisionId;
      }

      // We need to clone the response before it can be consumed anywhere else.
      bundleRes = nextBundleRes.clone();

      if (!resolved) {
        resolved = true;
        resolveBundleRes(nextBundleRes);
      } else {
        client.bundleResPromise = Promise.resolve(nextBundleRes);
      }
    });

    return client;
  };

  async function getOrFetchBundleMetadata(
    bundleKey: string,
    revisionId: string,
  ): Promise<BundleMetadata> {
    const metadata = await getBundleMetadataFromDB(await dbPromise, revisionId);
    if (metadata != null) {
      return metadata;
    }
    return await getBundleMetadata(bundleKey, revisionId);
  }

  const getBundle = async (bundleKey: string, clientId: string) => {
    let client = clients.get(bundleKey);
    if (client != null) {
      // There's already an update client running for this bundle URL.
      client.ids.add(clientId);
    } else {
      const cache = await cachePromise;
      const prevBundleRes = await cache.match(bundleKey);

      if (prevBundleRes == null) {
        throw new BundleNotFoundError(bundleKey);
      }

      const prevRevisionId = getRevisionId(prevBundleRes);
      // We could expect metadata to always be defined. However, the cache and the
      // database can be cleared independently, which means that there is a
      // possibility that the bundle cache was cleared and the database was not
      // and vice versa.
      const prevBundleMetadataPromise = getOrFetchBundleMetadata(
        bundleKey,
        prevRevisionId,
      );

      client = await setupUpdates(
        bundleKey,
        clientId,
        prevRevisionId,
        prevBundleRes,
        prevBundleMetadataPromise,
      );
    }

    let bundleRes;
    try {
      // Whenever we consume a response, we need to clone it so that we can
      // still use its body for the next request.
      bundleRes = await client.bundleResPromise;
      client.bundleResPromise = Promise.resolve(bundleRes.clone());
    } catch (error) {
      throw new UpdateError(bundleKey, error);
    }

    return bundleRes;
  };

  const registerBundle = async (
    bundleKey: string,
    bundleRes,
    clientId: string,
  ) => {
    const cache = await cachePromise;
    // Since the user might not be aware of Response semantics, we should not
    // consume the provided response's body, but instead make clones of it.
    const initialRevisionId = getRevisionId(bundleRes);
    const putPromise = cache.put(bundleKey, bundleRes.clone());
    // See the comment regarding getOrFetchBundleMetadata in getBundle.
    const metadataPromise = getOrFetchBundleMetadata(
      bundleKey,
      initialRevisionId,
    );

    await Promise.all([
      putPromise,
      (async () => {
        const metadata = await metadataPromise;
        await setBundleMetadata(await dbPromise, initialRevisionId, metadata);
      })(),
      setupUpdates(
        bundleKey,
        clientId,
        initialRevisionId,
        bundleRes.clone(),
        metadataPromise,
      ),
    ]);
  };

  return {getBundle, registerBundle};
}

module.exports = {
  create,
  BundleNotFoundError,
  UpdateError,
  CACHE_VERSION,
};
