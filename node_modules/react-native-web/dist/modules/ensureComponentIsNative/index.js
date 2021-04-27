/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import invariant from 'fbjs/lib/invariant';

var ensureComponentIsNative = function ensureComponentIsNative(component) {
  invariant(component && typeof component.setNativeProps === 'function', 'Touchable child must either be native or forward setNativeProps to a native component');
};

export default ensureComponentIsNative;