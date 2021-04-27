/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="node" />
import plistParser from 'plist';
/**
 * Returns Info.plist located in the iOS project
 *
 * Returns `null` if INFOPLIST_FILE is not specified.
 */
export default function getPlist(project: any, sourceDir: string): string | number | boolean | Date | Buffer | plistParser.PlistObject | plistParser.PlistArray | null;
//# sourceMappingURL=getPlist.d.ts.map