/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Device } from '../../types';
/**
 * Takes in a parsed simulator list and a desired name, and returns an object with the matching simulator. The desired
 * name can optionally include the iOS version in between parenthesis after the device name. Ex: "iPhone 6 (9.2)" in
 * which case it'll attempt to find a simulator with the exact version specified.
 *
 * If the simulatorString argument is null, we'll go into default mode and return the currently booted simulator, or if
 * none is booted, it will be the first in the list.
 *
 * @param simulators a parsed list from `xcrun simctl list --json devices` command
 * @param simulatorString the string with the name of desired simulator. If null, it will use the currently
 *        booted simulator, or if none are booted, the first in the list.
 */
declare function findMatchingSimulator(simulators: {
    devices: {
        [index: string]: Array<Device>;
    };
}, simulatorString: string): {
    udid: string;
    name: string;
    booted: boolean;
    version: string;
} | null;
export default findMatchingSimulator;
//# sourceMappingURL=findMatchingSimulator.d.ts.map