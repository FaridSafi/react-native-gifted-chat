/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PlistValue } from 'plist';
/**
 * Writes to Info.plist located in the iOS project
 *
 * Returns `null` if INFOPLIST_FILE is not specified or file is non-existent.
 */
export default function writePlist(project: any, sourceDir: string, plist: PlistValue | null): void | null;
//# sourceMappingURL=writePlist.d.ts.map