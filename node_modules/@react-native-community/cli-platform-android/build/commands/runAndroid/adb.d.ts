/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Executes the commands needed to get a list of devices from ADB
 */
declare function getDevices(adbPath: string): Array<string>;
/**
 * Gets available CPUs of devices from ADB
 */
declare function getAvailableCPUs(adbPath: string, device: string): Array<string>;
declare const _default: {
    getDevices: typeof getDevices;
    getAvailableCPUs: typeof getAvailableCPUs;
};
export default _default;
//# sourceMappingURL=adb.d.ts.map