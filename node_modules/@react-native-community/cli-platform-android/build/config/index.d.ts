/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { AndroidProjectParams, AndroidDependencyParams } from '@react-native-community/cli-types';
/**
 * Gets android project config by analyzing given folder and taking some
 * defaults specified by user into consideration
 */
export declare function projectConfig(folder: string, userConfig?: AndroidProjectParams): {
    sourceDir: string;
    isFlat: boolean;
    folder: string;
    stringsPath: string;
    manifestPath: string;
    buildGradlePath: string;
    settingsGradlePath: string;
    assetsPath: string;
    mainFilePath: string;
    packageName: string;
} | null;
/**
 * Same as projectConfigAndroid except it returns
 * different config that applies to packages only
 */
export declare function dependencyConfig(folder: string, userConfig?: AndroidDependencyParams): {
    sourceDir: string;
    folder: string;
    packageImportPath: string;
    packageInstance: string;
} | null;
//# sourceMappingURL=index.d.ts.map