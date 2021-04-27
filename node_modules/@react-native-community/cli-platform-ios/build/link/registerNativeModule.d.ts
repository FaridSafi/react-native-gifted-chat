/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { IOSDependencyConfig, IOSProjectConfig } from '@react-native-community/cli-types';
/**
 * Register native module IOS adds given dependency to project by adding
 * its xcodeproj to project libraries as well as attaching static library
 * to the first target (the main one)
 *
 * If library is already linked, this action is a no-op.
 */
export default function registerNativeModuleIOS(dependencyConfig: IOSDependencyConfig, projectConfig: IOSProjectConfig): void;
//# sourceMappingURL=registerNativeModule.d.ts.map