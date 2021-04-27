/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Device } from '../../types';
/**
 * Parses the output of `xcrun simctl list devices` command
 */
declare function parseIOSDevicesList(text: string): Array<Device>;
export default parseIOSDevicesList;
//# sourceMappingURL=parseIOSDevicesList.d.ts.map