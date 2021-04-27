/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import findIndex from 'array-find-index';
import invariant from 'fbjs/lib/invariant';
var connection = ExecutionEnvironment.canUseDOM && (window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection); // Prevent the underlying event handlers from leaking and include additional
// properties available in browsers

var getConnectionInfoObject = function getConnectionInfoObject() {
  var result = {
    effectiveType: 'unknown',
    type: 'unknown'
  };

  if (!connection) {
    return result;
  }

  for (var prop in connection) {
    var value = connection[prop];

    if (typeof value !== 'function' && value != null) {
      result[prop] = value;
    }
  }

  return result;
}; // Map React Native events to browser equivalents


var eventTypesMap = {
  change: 'change',
  connectionChange: 'change'
};
var eventTypes = Object.keys(eventTypesMap);
var connectionListeners = [];
var netInfoListeners = [];
/**
 * Navigator online: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
 * Network Connection API: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */

var NetInfo = {
  addEventListener: function addEventListener(type, handler) {
    invariant(eventTypes.indexOf(type) !== -1, 'Trying to subscribe to unknown event: "%s"', type);

    if (type === 'change') {
      console.warn('Listening to event `change` is deprecated. Use `connectionChange` instead.');
    }

    if (!connection) {
      console.error('Network Connection API is not supported. Not listening for connection type changes.');
      return {
        remove: function remove() {}
      };
    }

    var wrappedHandler = function wrappedHandler() {
      return handler(getConnectionInfoObject());
    };

    netInfoListeners.push([handler, wrappedHandler]);
    connection.addEventListener(eventTypesMap[type], wrappedHandler);
    return {
      remove: function remove() {
        return NetInfo.removeEventListener(eventTypesMap[type], handler);
      }
    };
  },
  removeEventListener: function removeEventListener(type, handler) {
    invariant(eventTypes.indexOf(type) !== -1, 'Trying to unsubscribe from unknown event: "%s"', type);

    if (type === 'change') {
      console.warn('Listening to event `change` is deprecated. Use `connectionChange` instead.');
    }

    var listenerIndex = findIndex(netInfoListeners, function (pair) {
      return pair[0] === handler;
    });
    invariant(listenerIndex !== -1, 'Trying to remove NetInfo listener for unregistered handler');
    var _netInfoListeners$lis = netInfoListeners[listenerIndex],
        wrappedHandler = _netInfoListeners$lis[1];
    connection.removeEventListener(eventTypesMap[type], wrappedHandler);
    netInfoListeners.splice(listenerIndex, 1);
  },
  fetch: function fetch() {
    console.warn('`fetch` is deprecated. Use `getConnectionInfo` instead.');
    return new Promise(function (resolve, reject) {
      try {
        resolve(connection.type);
      } catch (err) {
        resolve('unknown');
      }
    });
  },
  getConnectionInfo: function getConnectionInfo() {
    return new Promise(function (resolve, reject) {
      resolve(getConnectionInfoObject());
    });
  },
  isConnected: {
    addEventListener: function addEventListener(type, handler) {
      invariant(eventTypes.indexOf(type) !== -1, 'Trying to subscribe to unknown event: "%s"', type);

      if (type === 'change') {
        console.warn('Listening to event `change` is deprecated. Use `connectionChange` instead.');
      }

      var onlineCallback = function onlineCallback() {
        return handler(true);
      };

      var offlineCallback = function offlineCallback() {
        return handler(false);
      };

      connectionListeners.push([handler, onlineCallback, offlineCallback]);
      window.addEventListener('online', onlineCallback, false);
      window.addEventListener('offline', offlineCallback, false);
      return {
        remove: function remove() {
          return NetInfo.isConnected.removeEventListener(eventTypesMap[type], handler);
        }
      };
    },
    removeEventListener: function removeEventListener(type, handler) {
      invariant(eventTypes.indexOf(type) !== -1, 'Trying to subscribe to unknown event: "%s"', type);

      if (type === 'change') {
        console.warn('Listening to event `change` is deprecated. Use `connectionChange` instead.');
      }

      var listenerIndex = findIndex(connectionListeners, function (pair) {
        return pair[0] === handler;
      });
      invariant(listenerIndex !== -1, 'Trying to remove NetInfo connection listener for unregistered handler');
      var _connectionListeners$ = connectionListeners[listenerIndex],
          onlineCallback = _connectionListeners$[1],
          offlineCallback = _connectionListeners$[2];
      window.removeEventListener('online', onlineCallback, false);
      window.removeEventListener('offline', offlineCallback, false);
      connectionListeners.splice(listenerIndex, 1);
    },
    fetch: function fetch() {
      return new Promise(function (resolve, reject) {
        try {
          resolve(window.navigator.onLine);
        } catch (err) {
          resolve(true);
        }
      });
    }
  }
};
export default NetInfo;