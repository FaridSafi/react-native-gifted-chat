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

const DeltaClient = require('./DeltaClient/dev');

const deltaClient = DeltaClient.create();

self.addEventListener('fetch', event => {
  const bundleUrl = new URL(event.request.url);
  if (/\/(.+?.bundle)$/.test(bundleUrl.pathname)) {
    event.respondWith(
      deltaClient.getBundle(event.request.url, event.clientId).catch(error =>
        fetch(event.request).then(res => {
          deltaClient.registerBundle(
            event.request.url,
            res.clone(),
            event.clientId,
          );
          return res;
        }),
      ),
    );
  }
});
