/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const {Logger} = require('metro-core');

import type {CacheStore} from 'metro-cache';

/**
 * Main cache class. Receives an array of cache instances, and sequentially
 * traverses them to return a previously stored value. It also ensures setting
 * the value in all instances.
 *
 * All get/set operations are logged via Metro's logger.
 */
class Cache<T> {
  _stores: $ReadOnlyArray<CacheStore<T>>;

  _hits: WeakMap<Buffer, CacheStore<T>>;

  constructor(stores: $ReadOnlyArray<CacheStore<T>>) {
    this._hits = new WeakMap();
    this._stores = stores;
  }

  async get(key: Buffer): Promise<?T> {
    const stores = this._stores;
    const length = stores.length;

    for (let i = 0; i < length; i++) {
      const store = stores[i];
      const name = store.constructor.name + '::' + key.toString('hex');
      let value = null;

      const logStart = Logger.log(
        Logger.createActionStartEntry({
          action_name: 'Cache get',
          log_entry_label: name,
        }),
      );

      try {
        const valueOrPromise = store.get(key);

        if (valueOrPromise && typeof valueOrPromise.then === 'function') {
          value = await valueOrPromise;
        } else {
          value = valueOrPromise;
        }
      } finally {
        Logger.log(Logger.createActionEndEntry(logStart));

        Logger.log(
          Logger.createEntry({
            action_name: 'Cache ' + (value == null ? 'miss' : 'hit'),
            log_entry_label: name,
          }),
        );

        if (value != null) {
          this._hits.set(key, store);

          return value;
        }
      }
    }

    return null;
  }

  set(key: Buffer, value: T): void {
    const stores = this._stores;
    const stop = this._hits.get(key);
    const length = stores.length;
    const promises = [];

    for (let i = 0; i < length && stores[i] !== stop; i++) {
      const store = stores[i];
      const name = store.constructor.name + '::' + key.toString('hex');

      Logger.log(
        Logger.createEntry({
          action_name: 'Cache set',
          log_entry_label: name,
        }),
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
