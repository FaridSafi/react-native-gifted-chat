/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict"; // Debounces calls with the given delay, and queues the next call while the
// previous one hasn't completed so that no two calls can execute concurrently.

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

function debounceAsyncQueue(fn, delay) {
  let timeout;
  let waiting = false;
  let executing = false;
  let callbacks = [];

  function execute() {
    return _execute.apply(this, arguments);
  }

  function _execute() {
    _execute = _asyncToGenerator(function*() {
      const currentCallbacks = callbacks;
      callbacks = [];
      executing = true;
      const res = yield fn();
      currentCallbacks.forEach(c => c(res));
      executing = false;

      if (callbacks.length > 0) {
        yield execute();
      }
    });
    return _execute.apply(this, arguments);
  }

  return () =>
    new Promise((resolve, reject) => {
      callbacks.push(resolve);

      if (!executing) {
        if (waiting) {
          clearTimeout(timeout);
        } else {
          waiting = true;
        }

        timeout = setTimeout(
          /*#__PURE__*/
          _asyncToGenerator(function*() {
            waiting = false;
            yield execute();
          }),
          delay
        );
      }
    });
}

module.exports = debounceAsyncQueue;
