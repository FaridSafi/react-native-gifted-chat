/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

/* eslint-env worker, serviceworker */
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

const DB_VERSION = 1; // Flow's IndexedDB definitions are unusable.
// $FlowIssue https://github.com/facebook/flow/issues/3324

function openDB(_x) {
  return _openDB.apply(this, arguments);
}
/**
 * Retrieves bundle metadata from the database.
 */

function _openDB() {
  _openDB = _asyncToGenerator(function*(dbName) {
    return yield new Promise((resolve, reject) => {
      const request = self.indexedDB.open(dbName, DB_VERSION);

      request.onerror = event => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        request.result.createObjectStore("metadata", {
          keyPath: "revisionId"
        });
      };
    });
  });
  return _openDB.apply(this, arguments);
}

function getBundleMetadata(_x2, _x3) {
  return _getBundleMetadata.apply(this, arguments);
}
/**
 * Stores bundle metadata to the database.
 */

function _getBundleMetadata() {
  _getBundleMetadata = _asyncToGenerator(function*(db, revisionId) {
    return yield new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"]);

      transaction.onerror = () => {
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore("metadata");
      const request = objectStore.get(revisionId);

      request.onsuccess = () => {
        if (request.result != null) {
          resolve(request.result.metadata);
        } else {
          resolve(null);
        }
      };
    });
  });
  return _getBundleMetadata.apply(this, arguments);
}

function setBundleMetadata(_x4, _x5, _x6) {
  return _setBundleMetadata.apply(this, arguments);
}
/**
 * Removes bundle metadata from the database.
 */

function _setBundleMetadata() {
  _setBundleMetadata = _asyncToGenerator(function*(db, revisionId, metadata) {
    yield new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"], "readwrite");

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = event => {
        // transaction.error has yet to be set at this point.
        reject(event.target.error);
      };

      const objectStore = transaction.objectStore("metadata");
      objectStore.add({
        revisionId,
        metadata
      });
    });
  });
  return _setBundleMetadata.apply(this, arguments);
}

function removeBundleMetadata(_x7, _x8) {
  return _removeBundleMetadata.apply(this, arguments);
}

function _removeBundleMetadata() {
  _removeBundleMetadata = _asyncToGenerator(function*(db, revisionId) {
    yield new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"], "readwrite");

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore("metadata");
      objectStore.delete(revisionId);
    });
  });
  return _removeBundleMetadata.apply(this, arguments);
}

module.exports = {
  openDB,
  getBundleMetadata,
  setBundleMetadata,
  removeBundleMetadata
};
