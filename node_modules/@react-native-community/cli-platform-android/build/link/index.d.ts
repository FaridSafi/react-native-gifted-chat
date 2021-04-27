/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import isInstalled from './isInstalled';
import register from './registerNativeModule';
import unregister from './unregisterNativeModule';
import copyAssets from './copyAssets';
import unlinkAssets from './unlinkAssets';
export declare function getAndroidLinkConfig(): {
    isInstalled: typeof isInstalled;
    register: typeof register;
    unregister: typeof unregister;
    copyAssets: typeof copyAssets;
    unlinkAssets: typeof unlinkAssets;
};
export default getAndroidLinkConfig;
//# sourceMappingURL=index.d.ts.map