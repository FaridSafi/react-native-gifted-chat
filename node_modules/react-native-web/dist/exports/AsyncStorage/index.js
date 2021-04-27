/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import merge from 'deep-assign';

var mergeLocalStorageItem = function mergeLocalStorageItem(key, value) {
  var oldValue = window.localStorage.getItem(key);
  var oldObject = JSON.parse(oldValue);
  var newObject = JSON.parse(value);
  var nextValue = JSON.stringify(merge({}, oldObject, newObject));
  window.localStorage.setItem(key, nextValue);
};

var createPromise = function createPromise(getValue, callback) {
  return new Promise(function (resolve, reject) {
    try {
      var value = getValue();

      if (callback) {
        callback(null, value);
      }

      resolve(value);
    } catch (err) {
      if (callback) {
        callback(err);
      }

      reject(err);
    }
  });
};

var createPromiseAll = function createPromiseAll(promises, callback, processResult) {
  return Promise.all(promises).then(function (result) {
    var value = processResult ? processResult(result) : null;
    callback && callback(null, value);
    return Promise.resolve(value);
  }, function (errors) {
    callback && callback(errors);
    return Promise.reject(errors);
  });
};

var AsyncStorage =
/*#__PURE__*/
function () {
  function AsyncStorage() {}

  /**
   * Erases *all* AsyncStorage for the domain.
   */
  AsyncStorage.clear = function clear(callback) {
    return createPromise(function () {
      window.localStorage.clear();
    }, callback);
  }
  /**
   * (stub) Flushes any pending requests using a single batch call to get the data.
   */
  ;

  AsyncStorage.flushGetRequests = function flushGetRequests() {}
  /**
   * Gets *all* keys known to the app, for all callers, libraries, etc.
   */
  ;

  AsyncStorage.getAllKeys = function getAllKeys(callback) {
    return createPromise(function () {
      var numberOfKeys = window.localStorage.length;
      var keys = [];

      for (var i = 0; i < numberOfKeys; i += 1) {
        var key = window.localStorage.key(i);
        keys.push(key);
      }

      return keys;
    }, callback);
  }
  /**
   * Fetches `key` value.
   */
  ;

  AsyncStorage.getItem = function getItem(key, callback) {
    return createPromise(function () {
      return window.localStorage.getItem(key);
    }, callback);
  }
  /**
   * multiGet resolves to an array of key-value pair arrays that matches the
   * input format of multiSet.
   *
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  ;

  AsyncStorage.multiGet = function multiGet(keys, callback) {
    var promises = keys.map(function (key) {
      return AsyncStorage.getItem(key);
    });

    var processResult = function processResult(result) {
      return result.map(function (value, i) {
        return [keys[i], value];
      });
    };

    return createPromiseAll(promises, callback, processResult);
  }
  /**
   * Sets `value` for `key`.
   */
  ;

  AsyncStorage.setItem = function setItem(key, value, callback) {
    return createPromise(function () {
      window.localStorage.setItem(key, value);
    }, callback);
  }
  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  ;

  AsyncStorage.multiSet = function multiSet(keyValuePairs, callback) {
    var promises = keyValuePairs.map(function (item) {
      return AsyncStorage.setItem(item[0], item[1]);
    });
    return createPromiseAll(promises, callback);
  }
  /**
   * Merges existing value with input value, assuming they are stringified JSON.
   */
  ;

  AsyncStorage.mergeItem = function mergeItem(key, value, callback) {
    return createPromise(function () {
      mergeLocalStorageItem(key, value);
    }, callback);
  }
  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  ;

  AsyncStorage.multiMerge = function multiMerge(keyValuePairs, callback) {
    var promises = keyValuePairs.map(function (item) {
      return AsyncStorage.mergeItem(item[0], item[1]);
    });
    return createPromiseAll(promises, callback);
  }
  /**
   * Removes a `key`
   */
  ;

  AsyncStorage.removeItem = function removeItem(key, callback) {
    return createPromise(function () {
      return window.localStorage.removeItem(key);
    }, callback);
  }
  /**
   * Delete all the keys in the `keys` array.
   */
  ;

  AsyncStorage.multiRemove = function multiRemove(keys, callback) {
    var promises = keys.map(function (key) {
      return AsyncStorage.removeItem(key);
    });
    return createPromiseAll(promises, callback);
  };

  return AsyncStorage;
}();

export { AsyncStorage as default };