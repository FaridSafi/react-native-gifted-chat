/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

/* eslint-env browser */
/* eslint-disable no-console */

'use strict';

declare var __DEV__: boolean;

const injectUpdate = require('./injectUpdate');

function registerServiceWorker(swUrl: string): void {
  const serviceWorker = navigator.serviceWorker;

  if (!serviceWorker) {
    if (__DEV__) {
      console.info('ServiceWorker not supported');
    }

    return;
  }

  window.addEventListener('load', function() {
    const registrationPromise = serviceWorker.register(swUrl);

    if (__DEV__) {
      registrationPromise.then(
        (registration: ServiceWorkerRegistration) => {
          console.info(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          );
        },
        error => {
          console.error('ServiceWorker registration failed: ', error);
        },
      );

      serviceWorker.addEventListener('message', (event: MessageEvent) => {
        const data = event.data;

        /* $FlowFixMe(>=0.97.0 site=react_native_fb) This comment suppresses an
         * error found when Flow v0.97 was deployed. To see the error delete
         * this comment and run Flow. */
        if (!(data instanceof Object) || typeof data.type !== 'string') {
          return;
        }

        switch (data.type) {
          case 'METRO_UPDATE_START': {
            console.info('Metro update started.');
            break;
          }
          case 'METRO_UPDATE': {
            /* $FlowFixMe(>=0.97.0 site=react_native_fb) This comment
             * suppresses an error found when Flow v0.97 was deployed. To see
             * the error delete this comment and run Flow. */
            console.info('Injecting metro update:', data.body);
            /* $FlowFixMe(>=0.97.0 site=react_native_fb) This comment
             * suppresses an error found when Flow v0.97 was deployed. To see
             * the error delete this comment and run Flow. */
            injectUpdate(data.body);
            break;
          }
          case 'METRO_UPDATE_ERROR': {
            /* $FlowFixMe(>=0.97.0 site=react_native_fb) This comment
             * suppresses an error found when Flow v0.97 was deployed. To see
             * the error delete this comment and run Flow. */
            console.error('Metro update error: ', data.error);
            break;
          }
        }
      });
    }
  });
}

module.exports = registerServiceWorker;
