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

const invariant = require("invariant");

/**
 * We batch items together trying to minimize their processing, for example as
 * network queries. For that we wait a small moment before processing a batch.
 * We limit also the number of items we try to process in a single batch so that
 * if we have many items pending in a short amount of time, we can start
 * processing right away.
 */
class BatchProcessor {
  constructor(options, processBatch) {
    this._options = options;
    this._processBatch = processBatch;
    this._queue = [];
    this._timeoutHandle = null;
    this._currentProcessCount = 0;
    this._processQueue = this._processQueue.bind(this);
  }

  _onBatchFinished() {
    this._currentProcessCount--;

    this._processQueueOnceReady();
  }

  _onBatchResults(jobs, results) {
    invariant(results.length === jobs.length, "Not enough results returned.");

    for (let i = 0; i < jobs.length; ++i) {
      jobs[i].resolve(results[i]);
    }

    this._onBatchFinished();
  }

  _onBatchError(jobs, error) {
    for (let i = 0; i < jobs.length; ++i) {
      jobs[i].reject(error);
    }

    this._onBatchFinished();
  }

  _processQueue() {
    this._timeoutHandle = null;
    const concurrency = this._options.concurrency;

    while (this._queue.length > 0 && this._currentProcessCount < concurrency) {
      this._currentProcessCount++;

      const jobs = this._queue.splice(0, this._options.maximumItems);

      this._processBatch(jobs.map(job => job.item)).then(
        this._onBatchResults.bind(this, jobs),
        this._onBatchError.bind(this, jobs)
      );
    }
  }

  _processQueueOnceReady() {
    if (this._queue.length >= this._options.maximumItems) {
      clearTimeout(this._timeoutHandle);
      process.nextTick(this._processQueue);
      return;
    }

    if (this._timeoutHandle == null) {
      this._timeoutHandle = setTimeout(
        this._processQueue,
        this._options.maximumDelayMs
      );
    }
  }

  queue(item) {
    return new Promise((resolve, reject) => {
      this._queue.push({
        item,
        resolve,
        reject
      });

      this._processQueueOnceReady();
    });
  }
}

module.exports = BatchProcessor;
