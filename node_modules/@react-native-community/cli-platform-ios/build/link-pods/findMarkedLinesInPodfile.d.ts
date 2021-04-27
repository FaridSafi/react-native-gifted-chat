/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const MARKER_TEXT = "# Add new pods below this line";
export default function findMarkedLinesInPodfile(podLines: Array<string>): {
    line: number;
    indentation: number;
}[];
//# sourceMappingURL=findMarkedLinesInPodfile.d.ts.map