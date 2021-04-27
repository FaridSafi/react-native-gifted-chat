/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export default function makeSettingsPatch(name: string, androidConfig: {
    sourceDir: string;
}, projectConfig: {
    settingsGradlePath: string;
}): {
    pattern: string;
    patch: string;
};
//# sourceMappingURL=makeSettingsPatch.d.ts.map