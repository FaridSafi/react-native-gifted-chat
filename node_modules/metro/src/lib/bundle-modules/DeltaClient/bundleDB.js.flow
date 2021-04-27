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

const DB_VERSION = 1;

// Flow's IndexedDB definitions are unusable.
// $FlowIssue https://github.com/facebook/flow/issues/3324
type IDBFactory = $FlowIssue;
type IDBDatabase = $FlowIssue;

async function openDB(dbName: string): Promise<IDBDatabase> {
  return await new Promise(
    (resolve: (result: IDBDatabase) => void, reject: mixed => void) => {
      const request = (self.indexedDB: IDBFactory).open(dbName, DB_VERSION);

      request.onerror = event => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        request.result.createObjectStore('metadata', {keyPath: 'revisionId'});
      };
    },
  );
}

/**
 * Retrieves bundle metadata from the database.
 */
async function getBundleMetadata(
  db: IDBDatabase,
  revisionId: string,
): Promise<?BundleMetadata> {
  return await new Promise(
    (resolve: (result: ?BundleMetadata) => void, reject: mixed => void) => {
      const transaction = db.transaction(['metadata']);
      transaction.onerror = () => {
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore('metadata');
      const request = objectStore.get(revisionId);
      request.onsuccess = () => {
        if (request.result != null) {
          resolve(request.result.metadata);
        } else {
          resolve(null);
        }
      };
    },
  );
}

/**
 * Stores bundle metadata to the database.
 */
async function setBundleMetadata(
  db: IDBDatabase,
  revisionId: string,
  metadata: BundleMetadata,
): Promise<void> {
  await new Promise((resolve: () => void, reject: (error?: mixed) => void) => {
    const transaction = db.transaction(['metadata'], 'readwrite');
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = event => {
      // transaction.error has yet to be set at this point.
      reject(event.target.error);
    };

    const objectStore = transaction.objectStore('metadata');
    objectStore.add({
      revisionId,
      metadata,
    });
  });
}

/**
 * Removes bundle metadata from the database.
 */
async function removeBundleMetadata(
  db: IDBDatabase,
  revisionId: string,
): Promise<void> {
  await new Promise((resolve: () => void, reject: (error?: mixed) => void) => {
    const transaction = db.transaction(['metadata'], 'readwrite');
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };

    const objectStore = transaction.objectStore('metadata');
    objectStore.delete(revisionId);
  });
}

module.exports = {
  openDB,
  getBundleMetadata,
  setBundleMetadata,
  removeBundleMetadata,
};
