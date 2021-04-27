/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import NativeMethodsMixin from '../NativeMethodsMixin';

var applyNativeMethods = function applyNativeMethods(Component) {
  Object.keys(NativeMethodsMixin).forEach(function (method) {
    if (!Component.prototype[method]) {
      Component.prototype[method] = NativeMethodsMixin[method];
    }
  });
  return Component;
};

export default applyNativeMethods;