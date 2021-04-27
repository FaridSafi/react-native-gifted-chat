/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { IOSProjectParams } from '@react-native-community/cli-types';
/**
 * Returns project config by analyzing given folder and applying some user defaults
 * when constructing final object
 */
export declare function projectConfig(folder: string, userConfig: IOSProjectParams): {
    sourceDir: string;
    folder: string;
    pbxprojPath: string;
    podfile: string | null;
    podspecPath: string | null;
    projectPath: string;
    projectName: string;
    libraryFolder: string;
    sharedLibraries: string[];
    plist: any[];
    scriptPhases: any[];
} | null | undefined;
export declare const dependencyConfig: typeof projectConfig;
//# sourceMappingURL=index.d.ts.map