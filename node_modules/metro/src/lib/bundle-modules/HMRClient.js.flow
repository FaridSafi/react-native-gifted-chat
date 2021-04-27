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

const WebSocketHMRClient = require('./WebSocketHMRClient');

const injectUpdate = require('./injectUpdate');

import type {HmrUpdate} from './types.flow';

class HMRClient extends WebSocketHMRClient {
  _isEnabled: boolean = false;
  _pendingUpdate: HmrUpdate | null = null;

  constructor(url: string) {
    super(url);

    this.on('update', (update: HmrUpdate) => {
      if (this._isEnabled) {
        injectUpdate(update);
      } else if (this._pendingUpdate == null) {
        this._pendingUpdate = update;
      } else {
        this._pendingUpdate = mergeUpdates(this._pendingUpdate, update);
      }
    });
  }

  enable() {
    this._isEnabled = true;
    const update = this._pendingUpdate;
    this._pendingUpdate = null;
    if (update != null) {
      injectUpdate(update);
    }
  }

  disable() {
    this._isEnabled = false;
  }

  isEnabled() {
    return this._isEnabled;
  }

  hasPendingUpdates() {
    return this._pendingUpdate != null;
  }
}

function mergeUpdates(base: HmrUpdate, next: HmrUpdate): HmrUpdate {
  const addedIDs = new Set();
  const deletedIDs = new Set();
  const moduleMap = new Map();

  // Fill in the temporary maps and sets from both updates in their order.
  applyUpdateLocally(base);
  applyUpdateLocally(next);

  function applyUpdateLocally(update: HmrUpdate) {
    update.deleted.forEach(id => {
      if (addedIDs.has(id)) {
        addedIDs.delete(id);
      } else {
        deletedIDs.add(id);
      }
      moduleMap.delete(id);
    });
    update.added.forEach(item => {
      const id = item.module[0];
      if (deletedIDs.has(id)) {
        deletedIDs.delete(id);
      } else {
        addedIDs.add(id);
      }
      moduleMap.set(id, item);
    });
    update.modified.forEach(item => {
      const id = item.module[0];
      moduleMap.set(id, item);
    });
  }

  // Now reconstruct a unified update from our in-memory maps and sets.
  // Applying it should be equivalent to applying both of them individually.
  const result = {
    isInitialUpdate: next.isInitialUpdate,
    revisionId: next.revisionId,
    added: [],
    modified: [],
    deleted: [],
  };
  deletedIDs.forEach(id => {
    result.deleted.push(id);
  });
  moduleMap.forEach((item, id) => {
    if (deletedIDs.has(id)) {
      return;
    }

    if (addedIDs.has(id)) {
      result.added.push(item);
    } else {
      result.modified.push(item);
    }
  });
  return result;
}

module.exports = HMRClient;
