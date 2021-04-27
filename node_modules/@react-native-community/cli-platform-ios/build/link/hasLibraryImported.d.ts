/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Given an array of libraries already imported and packageName that will be
 * added, returns true or false depending on whether the library is already linked
 * or not
 */
export default function hasLibraryImported(libraries: {
    children: Array<{
        comment: string;
    }>;
}, packageName: string): boolean;
//# sourceMappingURL=hasLibraryImported.d.ts.map