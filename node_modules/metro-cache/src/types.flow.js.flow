/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

export type CacheStore<T> = {
  get(key: Buffer): ?T | Promise<?T>,
  set(key: Buffer, value: T): void | Promise<void>,
  clear(): void | Promise<void>,
};
