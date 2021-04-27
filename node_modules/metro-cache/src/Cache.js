/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
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

const _require = require("metro-core"),
  Logger = _require.Logger;

/**
 * Main cache class. Receives an array of cache instances, and sequentially
 * traverses them to return a previously stored value. It also ensures setting
 * the value in all instances.
 *
 * All get/set operations are logged via Metro's logger.
 */
class Cache {
  constructor(stores) {
    this._hits = new WeakMap();
    this._stores = stores;
  }

  get(key) {
    var _this = this;

    return _asyncToGenerator(function*() {
      const stores = _this._stores;
      const length = stores.length;

      for (let i = 0; i < length; i++) {
        const store = stores[i];
        const name = store.constructor.name + "::" + key.toString("hex");
        let value = null;
        const logStart = Logger.log(
          Logger.createActionStartEntry({
            action_name: "Cache get",
            log_entry_label: name
          })
        );

        try {
          const valueOrPromise = store.get(key);

          if (valueOrPromise && typeof valueOrPromise.then === "function") {
            value = yield valueOrPromise;
          } else {
            value = valueOrPromise;
          }
        } finally {
          Logger.log(Logger.createActionEndEntry(logStart));
          Logger.log(
            Logger.createEntry({
              action_name: "Cache " + (value == null ? "miss" : "hit"),
              log_entry_label: name
            })
          );

          if (value != null) {
            _this._hits.set(key, store);

            return value;
          }
        }
      }

      return null;
    })();
  }

  set(key, value) {
    const stores = this._stores;

    const stop = this._hits.get(key);

    const length = stores.length;
    const promises = [];

    for (let i = 0; i < length && stores[i] !== stop; i++) {
      const store = stores[i];
      const name = store.constructor.name + "::" + key.toString("hex");
      Logger.log(
        Logger.createEntry({
          action_name: "Cache set",
          log_entry_label: name
        })
      );
      promises.push(stores[i].set(key, value));
    }

    Promise.all(promises).catch(err => {
      process.nextTick(() => {
        throw err;
      });
    });
  }
}

module.exports = Cache;
