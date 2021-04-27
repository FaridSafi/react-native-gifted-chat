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

const BundleNotFoundError = require("./BundleNotFoundError");

const WebSocketHMRClient = require("../WebSocketHMRClient");

const bundleToString = require("./bundleToString");

const patchBundle = require("./patchBundle");

const stringToBundle = require("./stringToBundle");

const _require = require("./bundleDB"),
  openDB = _require.openDB,
  getBundleMetadataFromDB = _require.getBundleMetadata,
  setBundleMetadata = _require.setBundleMetadata,
  removeBundleMetadata = _require.removeBundleMetadata;

const _require2 = require("./metadata"),
  fetchBundleMetadata = _require2.fetchBundleMetadata;

const _require3 = require("./response"),
  createResponse = _require3.createResponse,
  getRevisionId = _require3.getRevisionId;

class UpdateError extends Error {
  constructor(bundleUrl, originalError) {
    super(
      `Error retrieving an initial update for the bundle \`${bundleUrl}\`.`
    );
    this.stack = "Caused by: " + originalError.stack;
  }
}

function defaultGetHmrServerUrl(bundleUrl, revisionId) {
  const url = new URL(bundleUrl);
  return `${url.protocol === "https:" ? "wss" : "ws"}://${
    url.host
  }/hot?revisionId=${revisionId}`;
}

function defaultOnUpdate(clientId, update) {
  clients.get(clientId).then(client => {
    if (client != null) {
      client.postMessage({
        type: "METRO_UPDATE",
        update
      });
    }
  });
}

function defaultOnUpdateStart(clientId) {
  clients.get(clientId).then(client => {
    if (client != null) {
      client.postMessage({
        type: "METRO_UPDATE_START"
      });
    }
  });
}

function defaultOnUpdateError(clientId, error) {
  clients.get(clientId).then(client => {
    if (client != null) {
      client.postMessage({
        type: "METRO_UPDATE_ERROR",
        error
      });
    }
  });
}

const DEFAULT_DB_NAME = "__metroBundleDB";
const CACHE_VERSION = 1;
const DEFAULT_CACHE_NAME = "__metroBundleCacheV" + CACHE_VERSION;

function create() {
  let _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$getHmrServerUrl = _ref.getHmrServerUrl,
    getHmrServerUrl =
      _ref$getHmrServerUrl === void 0
        ? defaultGetHmrServerUrl
        : _ref$getHmrServerUrl,
    _ref$getBundleMetadat = _ref.getBundleMetadata,
    getBundleMetadata =
      _ref$getBundleMetadat === void 0
        ? fetchBundleMetadata
        : _ref$getBundleMetadat,
    _ref$onUpdateStart = _ref.onUpdateStart,
    onUpdateStart =
      _ref$onUpdateStart === void 0 ? defaultOnUpdateStart : _ref$onUpdateStart,
    _ref$onUpdate = _ref.onUpdate,
    onUpdate = _ref$onUpdate === void 0 ? defaultOnUpdate : _ref$onUpdate,
    _ref$onUpdateError = _ref.onUpdateError,
    onUpdateError =
      _ref$onUpdateError === void 0 ? defaultOnUpdateError : _ref$onUpdateError,
    _ref$bundleCacheName = _ref.bundleCacheName,
    bundleCacheName =
      _ref$bundleCacheName === void 0
        ? DEFAULT_CACHE_NAME
        : _ref$bundleCacheName,
    _ref$bundleDBName = _ref.bundleDBName,
    bundleDBName =
      _ref$bundleDBName === void 0 ? DEFAULT_DB_NAME : _ref$bundleDBName;

  const cachePromise = caches.open(bundleCacheName);
  const dbPromise = openDB(DEFAULT_DB_NAME);
  const clients = new Map();

  const setupUpdates =
    /*#__PURE__*/
    (function() {
      var _ref2 = _asyncToGenerator(function*(
        bundleKey,
        clientId,
        prevRevisionId,
        prevBundleRes,
        prevBundleMetadataPromise
      ) {
        const cache = yield cachePromise;
        const db = yield dbPromise;
        let bundleRes = prevBundleRes;
        let revisionId = prevRevisionId;

        let bundlePromise = _asyncToGenerator(function*() {
          const stringBundle = yield prevBundleRes.clone().text();
          const prevBundleMetadata = yield prevBundleMetadataPromise;
          return stringToBundle(stringBundle, prevBundleMetadata);
        })();

        let resolveBundleRes;
        let rejectBundleRes;
        const client = {
          ids: new Set([clientId]),
          bundleResPromise: new Promise((resolve, reject) => {
            // Note: the arg type will be a Resolve result in service-workers
            resolveBundleRes = resolve;
            rejectBundleRes = reject;
          })
        };
        clients.set(bundleKey, client);
        let resolved = false;
        const wsClient = new WebSocketHMRClient(
          getHmrServerUrl(bundleKey, prevRevisionId)
        );
        wsClient.on("open", () => {
          wsClient.send(
            JSON.stringify({
              type: "register-entrypoints",
              entryPoints: [getHmrServerUrl(bundleKey, prevRevisionId)]
            })
          );
        });
        wsClient.on("connection-error", error => {
          rejectBundleRes(error);
        });
        wsClient.on("close", () => {
          clients.delete(bundleKey);
        });
        wsClient.on("error", error => {
          if (!resolved) {
            rejectBundleRes(error);
            return;
          }

          client.ids.forEach(clientId => onUpdateError(clientId, error));
        });
        wsClient.on("update-start", () => {
          client.ids.forEach(clientId => onUpdateStart(clientId));
        });
        wsClient.on(
          "update",
          /*#__PURE__*/
          (function() {
            var _ref4 = _asyncToGenerator(function*(update) {
              if (resolved) {
                // Only notify clients for later updates.
                client.ids.forEach(clientId => onUpdate(clientId, update));
              }

              let nextBundleRes; // type: Response, built-in function for service worker

              if (revisionId === update.revisionId) {
                nextBundleRes = bundleRes;
              } else {
                let bundle;

                try {
                  bundle = yield bundlePromise;
                } catch (error) {
                  // This error should only happen when either the initial bundle or the
                  // initial bundle metadata are invalid or cannot be retrieved.
                  rejectBundleRes(error);
                  return;
                }

                const nextBundle = patchBundle(bundle, {
                  added: update.added,
                  modified: update.modified,
                  deleted: update.deleted
                });
                bundlePromise = Promise.resolve(nextBundle);

                const _bundleToString = bundleToString(nextBundle),
                  stringBundle = _bundleToString.code,
                  metadata = _bundleToString.metadata;

                nextBundleRes = createResponse(
                  stringBundle,
                  update.revisionId,
                  new Headers({
                    // In development, we expect the bundle URL to be static. As such,
                    // the browser should always request the Service Worker for the
                    // latest version.
                    "Cache-Control": "no-cache"
                  })
                );
                cache.put(bundleKey, nextBundleRes.clone());
                setBundleMetadata(db, update.revisionId, metadata);
                removeBundleMetadata(db, revisionId);
                revisionId = update.revisionId;
              } // We need to clone the response before it can be consumed anywhere else.

              bundleRes = nextBundleRes.clone();

              if (!resolved) {
                resolved = true;
                resolveBundleRes(nextBundleRes);
              } else {
                client.bundleResPromise = Promise.resolve(nextBundleRes);
              }
            });

            return function(_x6) {
              return _ref4.apply(this, arguments);
            };
          })()
        );
        return client;
      });

      return function setupUpdates(_x, _x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    })();

  function getOrFetchBundleMetadata(_x7, _x8) {
    return _getOrFetchBundleMetadata.apply(this, arguments);
  }

  function _getOrFetchBundleMetadata() {
    _getOrFetchBundleMetadata = _asyncToGenerator(function*(
      bundleKey,
      revisionId
    ) {
      const metadata = yield getBundleMetadataFromDB(
        yield dbPromise,
        revisionId
      );

      if (metadata != null) {
        return metadata;
      }

      return yield getBundleMetadata(bundleKey, revisionId);
    });
    return _getOrFetchBundleMetadata.apply(this, arguments);
  }

  const getBundle =
    /*#__PURE__*/
    (function() {
      var _ref5 = _asyncToGenerator(function*(bundleKey, clientId) {
        let client = clients.get(bundleKey);

        if (client != null) {
          // There's already an update client running for this bundle URL.
          client.ids.add(clientId);
        } else {
          const cache = yield cachePromise;
          const prevBundleRes = yield cache.match(bundleKey);

          if (prevBundleRes == null) {
            throw new BundleNotFoundError(bundleKey);
          }

          const prevRevisionId = getRevisionId(prevBundleRes); // We could expect metadata to always be defined. However, the cache and the
          // database can be cleared independently, which means that there is a
          // possibility that the bundle cache was cleared and the database was not
          // and vice versa.

          const prevBundleMetadataPromise = getOrFetchBundleMetadata(
            bundleKey,
            prevRevisionId
          );
          client = yield setupUpdates(
            bundleKey,
            clientId,
            prevRevisionId,
            prevBundleRes,
            prevBundleMetadataPromise
          );
        }

        let bundleRes;

        try {
          // Whenever we consume a response, we need to clone it so that we can
          // still use its body for the next request.
          bundleRes = yield client.bundleResPromise;
          client.bundleResPromise = Promise.resolve(bundleRes.clone());
        } catch (error) {
          throw new UpdateError(bundleKey, error);
        }

        return bundleRes;
      });

      return function getBundle(_x9, _x10) {
        return _ref5.apply(this, arguments);
      };
    })();

  const registerBundle =
    /*#__PURE__*/
    (function() {
      var _ref6 = _asyncToGenerator(function*(bundleKey, bundleRes, clientId) {
        const cache = yield cachePromise; // Since the user might not be aware of Response semantics, we should not
        // consume the provided response's body, but instead make clones of it.

        const initialRevisionId = getRevisionId(bundleRes);
        const putPromise = cache.put(bundleKey, bundleRes.clone()); // See the comment regarding getOrFetchBundleMetadata in getBundle.

        const metadataPromise = getOrFetchBundleMetadata(
          bundleKey,
          initialRevisionId
        );
        yield Promise.all([
          putPromise,
          _asyncToGenerator(function*() {
            const metadata = yield metadataPromise;
            yield setBundleMetadata(
              yield dbPromise,
              initialRevisionId,
              metadata
            );
          })(),
          setupUpdates(
            bundleKey,
            clientId,
            initialRevisionId,
            bundleRes.clone(),
            metadataPromise
          )
        ]);
      });

      return function registerBundle(_x11, _x12, _x13) {
        return _ref6.apply(this, arguments);
      };
    })();

  return {
    getBundle,
    registerBundle
  };
}

module.exports = {
  create,
  BundleNotFoundError,
  UpdateError,
  CACHE_VERSION
};
